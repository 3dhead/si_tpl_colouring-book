'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles', function () {
  var lessOptions = {
    options: [
      'bower_components',
      path.join(conf.paths.src, '/')
    ]
  };

  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/scripts/**/*.less'),
    path.join(conf.paths.assets, '/less/**/*.less'),
    path.join('!' + conf.paths.assets, '/less/index.less')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '../../', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };


  return gulp.src([
    path.join(conf.paths.src, '/assets/less/index.less')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.less(lessOptions)).on('error', conf.errorHandler('Less'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/styles/')))
    .pipe(browserSync.reload({ stream: true }));
});
