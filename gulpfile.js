/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

(function () {

  'use strict'

  // Include Gulp & Plugins
  const gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    replace = require('gulp-replace'),
    size = require('gulp-size'),
    fs = require('fs')

  // Set the compiler to use Dart Sass instead of Node Sass
  sass.compiler = require('dart-sass')

  var onError = function (err) {
    console.log('An error occurred:', gutil.colors.magenta(err.message))
    gutil.beep()
    this.emit('end')
  }

  // SASS
  gulp.task('sass', function (done) {
    return gulp.src('./src/assets/sass/*.scss')
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleanCSS())
      .pipe(gulp.dest('./src/assets/css'))
      .pipe(size())
    done()
  })

  // inlineCSS
  gulp.task('inlinecss', function (done) {
    return gulp.src([ 'src/partials/inline-css.hbs' ])
      .pipe(replace('@@compiled_css', fs.readFileSync('src/assets/css/style.min.css')))
      .pipe(gulp.dest('src/partials/compiled'))
    done()
  })

  // inlineCSSDark
  gulp.task('inlinecssdark', function (done) {
    return gulp.src([ 'src/partials/inline-css-dark.hbs' ])
      .pipe(replace('@@compiled_css_dark', fs.readFileSync('src/assets/css/dark.min.css')))
      .pipe(gulp.dest('src/partials/compiled'))
    done()
  })

  // JavaScript
  gulp.task('js', function (done) {
    return gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './bower_components/instafeed.js/instafeed.js',
      './bower_components/bootstrap-transition/scripts/transition.js',
      './bower_components/zoom.js/dist/zoom.js',
      './bower_components/jquery.fitvids/jquery.fitvids.js',
      './bower_components/jQuery-viewport-checker/dist/jquery.viewportchecker.min.js',
      './bower_components/masonry-layout/dist/masonry.pkgd.min.js',
      './bower_components/imagesloaded/imagesloaded.pkgd.min.js',
      './node_modules/evil-icons/assets/evil-icons.min.js',
      './node_modules/clipboard/dist/clipboard.js',
      './node_modules/prismjs/prism.js',
      './node_modules/lunr/lunr.js',
      './node_modules/lunr-languages/lunr.stemmer.support.js',
      './node_modules/lunr-languages/lunr.ru.js',
      './node_modules/lunr-languages/lunr.fr.js',
      './node_modules/lunr-languages/lunr.de.js',
      './node_modules/lunr-languages/lunr.es.js',
      './node_modules/lunr-languages/lunr.pt.js',
      './node_modules/lunr-languages/lunr.it.js',
      './node_modules/lunr-languages/lunr.fi.js',
      './node_modules/lunr-languages/lunr.du.js',
      './node_modules/lunr-languages/lunr.da.js',
      './node_modules/lunr-languages/lunr.multi.js',
      './src/assets/js/ghosthunter.js',
      './src/assets/js/app.js' ])
      .pipe(concat('app.js'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('./src/assets/js'))
      .pipe(size())
    done()
  })

  // Watch
  gulp.task('watch', function () {
    gulp.watch('src/assets/sass/**/*.scss', gulp.series('build_css'))
    gulp.watch([ './src/assets/js/app.js', './src/assets/js/ghosthunter.js' ], gulp.series('js'))
  })

  gulp.task(
    'build_css',
    gulp.series('sass', 'inlinecss', 'inlinecssdark')
  )

  gulp.task(
    'build',
    gulp.series('build_css', 'js')
  )

  gulp.task(
    'default',
    gulp.series('build', 'watch')
  )

})()
