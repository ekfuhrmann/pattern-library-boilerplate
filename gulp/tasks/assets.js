'use strict'
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')
const $ = plugins()
const config = require('../config')

const destination = `${config.distFolder}/assets/`

gulp.task('assets', () => {
    return gulp.src(config.assets)
    .pipe($.changed(destination))
    .pipe(gulp.dest(destination))
})
