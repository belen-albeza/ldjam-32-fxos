'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var rsync = require('gulp-rsync');

// load up config file
var config  = require('./gulp.config.json');

//
// browserify and JS
//

var bundler = browserify('./app/js/main.js');

function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('.tmp/js'))
    .pipe(livereload());
}

gulp.task('browserify', bundle);

// 3rd party libs that don't play nice with browserify :(
gulp.task('libs', function () {
  gulp.src(['phaser.min.js', 'phaser.map'], {cwd: 'node_modules/phaser/dist/'})
    .pipe(gulp.dest('.tmp/js/lib/'));
});

gulp.task('js', ['browserify', 'libs']);

//
// web server
//

gulp.task('connect', function () {
  connect.server({
    root: ['app', '.tmp']
  });
});

//
// watch
//

gulp.task('watch', ['connect'], function () {
  livereload.listen();

  bundler = watchify(bundler, watchify.args);
  bundler.on('update', bundle);
});

//
// build and deploy
//

gulp.task('build', ['js']);

gulp.task('copy', function () {
  gulp.src([
    'index.html', 'css/*.css', 'images/**/*', 'fonts/**/*'
  ], {cwd: 'app', base: 'app'})
    .pipe(gulp.dest('./dist/'));


  gulp.src(['js/**/*'], {cwd: '.tmp', base: '.tmp'})
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dist', ['build', 'copy']);

gulp.task('deploy', ['dist'], function () {
  gulp.src('dist')
    .pipe(rsync({
      root: 'dist',
      username: config.deploy.user,
      hostname: config.deploy.host,
      destination: config.deploy.destination,
      recursive: true,
      clean: true,
      progress: true,
      incremental: true
    }));
});

//
// dev tasks
//

gulp.task('server', ['build', 'watch']);

//
// default task
//

gulp.task('default', ['build', 'connect']);
