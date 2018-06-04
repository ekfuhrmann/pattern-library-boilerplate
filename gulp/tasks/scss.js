'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins');
const $ = plugins();
const config = require('../config');
const when = require('gulp-if');

// Check if gulp scripts --prod or --production has been added to the task
const argv = require('yargs').argv;

const production = argv.prod || argv.production;
const destination = `${config.distFolder}/assets/stylesheets`;

gulp.task('scss-pl', () => {
  return (
    gulp
      .src(config.styleFilesPatternLibrary)
      .pipe($.changed(destination))
      .pipe(
        $.sass({
          includePaths: config.scssIncludes
        })
      )
      .on('error', $.notify.onError('Error: <%= error.message %>'))
      .pipe($.concat('main.css'))
      .pipe(
        $.rename({
          basename: 'main-pl'
        })
      )
      .pipe(when(!production, $.sourcemaps.init()))
      .pipe(
        $.autoprefixer({
          browsers: ['last 2 versions', 'ie 10-11']
        })
      )
      .pipe(when(!production, $.sourcemaps.write('./')))
      .pipe(gulp.dest(destination))

      // Production
      .pipe(
        when(
          production,
          $.uncss({
            html: config.uncssHtml,
            ignore: config.uncssIgnore
          })
        )
      )
      .on('error', $.notify.onError('Error: <%= error.message %>'))
      .pipe(when(production, $.cssnano()))
      .pipe(when(production, gulp.dest(destination)))

      // Finally make it uber small with gzip
      .pipe(when(production, $.gzip()))
      .pipe(when(production, gulp.dest(destination)))
  );
});

gulp.task('scss-toolkit', () => {
  return (
    gulp
      .src(config.styleFilesToolkit)
      .pipe($.changed(destination))
      .pipe(
        $.sass({
          includePaths: config.scssIncludes
        })
      )
      .on('error', $.notify.onError('Error: <%= error.message %>'))
      .pipe($.concat('main.css'))
      .pipe(
        $.rename({
          basename: 'main-toolkit'
        })
      )
      .pipe(when(!production, $.sourcemaps.init()))
      .pipe(
        $.autoprefixer({
          browsers: ['last 2 versions', 'ie 10-11']
        })
      )
      .pipe(when(!production, $.sourcemaps.write('./')))
      .pipe(gulp.dest(destination))

      // Production
      .pipe(
        when(
          production,
          $.uncss({
            html: config.uncssHtml,
            ignore: config.uncssIgnore
          })
        )
      )
      .on('error', $.notify.onError('Error: <%= error.message %>'))
      .pipe(when(production, $.cssnano()))
      .pipe(when(production, gulp.dest(destination)))

      // Finally make it uber small with gzip
      .pipe(when(production, $.gzip()))
      .pipe(when(production, gulp.dest(destination)))
  );
});

gulp.task('scss', gulp.parallel('scss-pl', 'scss-toolkit'));
