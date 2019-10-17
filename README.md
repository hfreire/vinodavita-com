# 

[![](https://github.com/hfreire/gott-vin/workflows/ci/badge.svg)](https://github.com/hfreire/gott-vin/actions?workflow=ci)
[![](https://github.com/hfreire/gott-vin/workflows/cd/badge.svg)](https://github.com/hfreire/gott-vin/actions?workflow=cd)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/gott-vin/badge.svg?branch=master)](https://coveralls.io/github/hfreire/gott-vin?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/hfreire/gott-vin/badge.svg)](https://snyk.io/test/github/hfreire/gott-vin)
[![](https://img.shields.io/github/release/hfreire/gott-vin.svg)](https://github.com/hfreire/gott-vin/releases)
[![Docker Stars](https://img.shields.io/docker/stars/hfreire/gott-vin.svg)](https://hub.docker.com/r/hfreire/gott-vin/)
[![Docker Pulls](https://img.shields.io/docker/pulls/hfreire/gott-vin.svg)](https://hub.docker.com/r/hfreire/gott-vin/)

> Uses Ghost blogging platform for publishing and managing content online

<p align="center"><img src="share/github/overview.gif" width="720"></p>

### Features
* :ghost: [Ghost](https://github.com/TryGhost/Ghost) blogging platform publishing platform :white_check_mark:
* Simple and :dizzy: lightweight theme :white_check_mark:

### How to use

#### Use it in your terminal
Using it in your terminal requires [Docker](https://www.docker.com) installed in your system.

##### Run the Docker image in a container 
Detach from the container and expose port `6734`.
```
docker run -d -p "6734:3000" hfreire/gott-vin
```

### How to build
##### Clone the GitHub repo
```
git clone https://github.com/hfreire/gott-vin.git
```

##### Change current directory
```
cd gott-vin
```

##### Run the NPM script that will build the Docker image
```
npm run build
```

### How to deploy

#### Deploy it from your terminal
Deploying it from your terminal requires [terraform](https://www.terraform.io) installed on your system and an [antifragile infrastructure](https://github.com/antifragile-systems/antifragile-infrastructure) setup available in your [AWS](https://aws.amazon.com) account.

##### Clone the GitHub repo
```
git clone https://github.com/hfreire/gott-vin.git
```

##### Change current directory
```
cd gott-vin
```

##### Run the NPM script that will deploy all functions
```
npm run deploy
```

#### Available deployment environment variables
Variable | Description | Required | Default value
:---:|:---:|:---:|:---:
VERSION | The version of the app. | false | `latest`
ANTIFRAGILE_STATE_AWS_REGION | The AWS region used for the antifragile state . | false | `undefined`
ANTIFRAGILE_STATE_AWS_S3_BUCKET | The AWS S3 bucket used for the antifragile state. | false | `undefined`
ANTIFRAGILE_STATE_AWS_DYNAMODB_TABLE | The AWS DynamoDB table used for the antifragile state. | false | `undefined`
ANTIFRAGILE_INFRASTRUCTURE_DOMAIN_NAME | The domain used for the antifragile infrastructure. | true | `undefined`

### How to contribute
You can contribute either with code (e.g., new features, bug fixes and documentation) or by [donating 5 EUR](https://paypal.me/hfreire/5). You can read the [contributing guidelines](CONTRIBUTING.md) for instructions on how to contribute with code. 

All donation proceedings will go to the [Sverige för UNHCR](https://sverigeforunhcr.se), a swedish partner of the [UNHCR - The UN Refugee Agency](http://www.unhcr.org), a global organisation dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.

### License
Read the [license](./LICENSE.md) for permissions and limitations.
