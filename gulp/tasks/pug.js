'use strict'
const fs = require('fs');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')
const $ = plugins()
const changeCase = require('change-case')
const config = require('../config')
const when = require('gulp-if')

const argv = require('yargs').argv
// Check if gulp scripts --prod or --production has been added to the task
const production = argv.prod || argv.production

// Build navigation based off category file structure
const categories = fs.readdirSync('./src/views/categories/');
// Get links within each category
const menuList = categories.map(category => ({
    title: category.substring(5).split('-').join(' '),
    links: fs.readdirSync(`./src/views/categories/${category}`)
}));

const devLocals = {
    base: '',
    extension: '',
    productionMode: false,
    categories: menuList
}

const prodLocals = {
    base: config.productionBase,
    extension: config.productionExtension,
    productionMode: true,
    categories: menuList
}

gulp.task('pug', () => {
    return gulp.src('./src/views/**/!(_)*.pug')
    .pipe($.changed(config.distFolder))
    .pipe($.rename(function(path) {
        path.basename = changeCase.lowerCase(path.basename);
    }))
    .pipe(when(!production, $.pug({
        pretty: true,
        basedir: './src/views',
        locals: devLocals
    }))).on('error', $.notify.onError('Error: <%= error.message %>'))
    .pipe(when(production, $.pug({
        basedir: './src/views',
        locals: prodLocals
    }))).on('error', $.notify.onError('Error: <%= error.message %>'))
    .pipe($.flatten())
    .pipe(gulp.dest(config.distFolder))
})
