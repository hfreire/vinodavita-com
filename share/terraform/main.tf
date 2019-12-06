terraform {
  required_version = ">= 0.12"

  backend "s3" {
  }
}

provider "aws" {
  version = "2.14.0"

  region = var.aws_region
}

provider "aws" {
  version = "2.14.0"

  alias  = "global"
  region = "us-east-1"
}

provider "template" {
  version = "2.1.2"
}

data "terraform_remote_state" "state" {
  backend = "s3"

  config = {
    region = var.state_aws_region
    bucket = var.state_aws_s3_bucket
    key    = "${var.name}.tfstate"
  }
}

data "template_file" "container_definitions" {
  template = file("${path.module}/container-definitions.json")

  vars = {
    name                                    = var.name
    image                                   = "${var.docker_repo}/${var.name}:${var.docker_image_tag}"
    log_level                               = var.log_level
    url                                     = var.url
    database__connection__host              = data.terraform_remote_state.state.outputs.database_host
    database__connection__database          = data.terraform_remote_state.state.outputs.database_name
    aws_ssm_parameter_database_username_arn = data.terraform_remote_state.state.outputs.aws_ssm_parameter_database_username_arn
    aws_ssm_parameter_database_password_arn = data.terraform_remote_state.state.outputs.aws_ssm_parameter_database_password_arn
    mail__from                              = var.mail__from
    mail__options__host                     = var.mail__options__host
    mail__options__auth__user               = var.mail__options__auth__user
    mail__options__auth__pass               = var.mail__options__auth__pass
    storage__s3__bucket                     = var.images_cdn_hostname
    storage__s3__assetHost                  = "//${var.images_cdn_hostname}"
  }
}

module "service" {
  source = "github.com/antifragile-systems/antifragile-service"

  name       = var.name
  aws_region = var.aws_region

  service_desired_count = var.service_desired_count

  container_definitions            = data.template_file.container_definitions.rendered
  health_check_timeout             = 10
  health_check_interval            = 15
  health_check_path_preappend_name = false

  cdn_enabled            = 1
  cdn_hostname           = var.cdn_hostname
  cdn_hostname_aliases   = var.cdn_hostname_aliases
  cdn_hostname_redirects = var.cdn_hostname_redirects
}

module "database" {
  source = "github.com/antifragile-systems/antifragile-database"

  infrastructure_name = var.infrastructure_name
  name                = var.name

  user_password = var.database_user_password
}

resource "aws_acm_certificate" "images_cdn" {
  provider = aws.global

  domain_name       = var.images_cdn_hostname
  validation_method = "DNS"
}

data "aws_route53_zone" "selected" {
  name         = "${var.cdn_hostname}."
  private_zone = false
}

resource "aws_route53_record" "images_cdn_validation" {
  name    = aws_acm_certificate.images_cdn.domain_validation_options[ 0 ].resource_record_name
  type    = aws_acm_certificate.images_cdn.domain_validation_options[ 0 ].resource_record_type
  zone_id = data.aws_route53_zone.selected.id

  records = [
    aws_acm_certificate.images_cdn.domain_validation_options[ 0 ].resource_record_value,
  ]

  ttl = 60
}

resource "aws_acm_certificate_validation" "images_cdn" {
  provider = aws.global

  certificate_arn = aws_acm_certificate.images_cdn.arn

  validation_record_fqdns = [
    aws_route53_record.images_cdn_validation.fqdn
  ]
}

resource "aws_cloudfront_origin_access_identity" "images_cdn" {
}

resource "aws_s3_bucket" "images_cdn" {
  bucket = var.images_cdn_hostname
  acl    = "private"

  tags = {
    IsAntifragile = true
  }
}

resource "aws_s3_bucket_policy" "images_cdn" {
  bucket = aws_s3_bucket.images_cdn.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "s3:GetObject",
            "Principal": {
                "AWS": "${aws_cloudfront_origin_access_identity.images_cdn.iam_arn}"
            },
            "Resource": "${aws_s3_bucket.images_cdn.arn}/*",
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_cloudfront_distribution" "images_cdn" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.images_cdn.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.images_cdn.bucket}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.images_cdn.cloudfront_access_identity_path
    }
  }

  aliases = [
    var.images_cdn_hostname ]

  is_ipv6_enabled = true

  default_cache_behavior {
    allowed_methods  = [
      "GET",
      "HEAD"
    ]
    cached_methods   = [
      "GET",
      "HEAD",
    ]
    target_origin_id = "S3-${aws_s3_bucket.images_cdn.bucket}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    compress = true

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.images_cdn.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}

resource "aws_route53_record" "images_cdn" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name    = var.images_cdn_hostname
  type    = "A"

  alias {
    name    = aws_cloudfront_distribution.images_cdn.domain_name
    zone_id = aws_cloudfront_distribution.images_cdn.hosted_zone_id

    evaluate_target_health = false
  }
}

data "aws_iam_role" "selected" {
  name = module.service.aws_iam_role_name

  depends_on = [
    module.service
  ]
}

resource "aws_iam_role_policy" "service" {
  name = var.name
  role = data.aws_iam_role.selected.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "s3:ListBucket",
            "Resource": "${aws_s3_bucket.images_cdn.arn}",
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:PutObjectVersionAcl",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "${aws_s3_bucket.images_cdn.arn}/*",
            "Effect": "Allow"
        }
    ]
}
EOF
}
