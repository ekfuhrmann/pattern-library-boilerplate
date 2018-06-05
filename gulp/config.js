'use strict';

module.exports = {
  // Just for my own sanity since some Hindi friend can't navigate properly
  productionBase: '/0000/2488',
  productionExtension: '.html',
  // Our main dist folder
  distFolder: './dist',
  // Here you add the paths to the scss files you get with Bower to import and work with.
  scssIncludes: ['./node_modules/'],
  // Stuff for UnCss
  uncssHtml: ['./dist/index.html'],
  uncssIgnore: [''],
  // Here you add the paths to the style files
  styleFilesPatternLibrary: [
    './node_modules/prismjs/themes/prism-okaidia.css',
    './src/assets/pattern-library/styles/main.scss'
  ],
  styleFilesToolkit: ['./src/assets/toolkit/styles/main.scss'],
  // Here you add the paths to the full-length js files from node_modules
  scriptFiles: [
    './src/assets/pattern-library/scripts/main.js',
    './src/assets/toolkit/scripts/main.js'
  ],
  // Path to un-worked font files
  fonts: ['./src/fonts/*.otf', './src/fonts/*.ttf'],
  // Asset File Paths
  assets: [
    './src/assets/!{pattern-library, toolkit}**/*' // exclude pattern-library & toolkit
  ],
  // Asset File Paths
  favicons: ['./src/favicons/**/*']
};
