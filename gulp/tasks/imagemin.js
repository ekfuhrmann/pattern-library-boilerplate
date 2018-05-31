'use strict'
const gulp = require('gulp')
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const plugins = require('gulp-load-plugins')
const $ = plugins()
const config = require('../config')

const destination = `${config.distFolder}/assets/images`

// Image minifcation has been removed in order to
// display the highest quality of images as possible.

gulp.task('imagemin', () => {
    return gulp.src('./src/assets/images/**/*')
    .pipe($.changed(destination))
    // .pipe($.imagemin([
    //     imageminJpegRecompress({
    //         progressive: true,
    //         quality: 'veryhigh'
    //     }), 
    //     imageminPngquant({
    //         quality: '100'
    //     })
    // ])) 
    .pipe(gulp.dest(destination))
})
