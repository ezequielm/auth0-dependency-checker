'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var config = require('./config.json');

gulp.task('develop', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      'NODE_ENV': config.node_env,
      'DATA_STORE': config.data_store
    }
  }).on('restart', function () {
    console.log('Restarted');
  });
});

gulp.task('default', ['develop']);
