'use strict';

var fs = require('fs');
var del = require('del');
var gulp = require('gulp');

var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var ghpages = require('gulp-gh-pages');
var zip = require('gulp-zip');

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

gulp.task('copy', ['build'], function () {
  gulp.src([
    'index.html', 'manifest.webapp', 'css/*.css', 'images/**/*', 'fonts/**/*',
    'audio/**/*', 'fonts/**/*'
  ], {cwd: 'app', base: 'app'})
    .pipe(gulp.dest('./dist/'));

  gulp.src(['js/**/*'], {cwd: '.tmp', base: '.tmp'})
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dist', ['copy']);

gulp.task('clean', function () {
  return del(['.tmp', 'dist', '*.zip']);
});

gulp.task('deploy', ['dist'], function () {
  return gulp.src('./dist/**/*')
    .pipe(ghpages());
});

gulp.task('release', ['dist'], function () {
  var data = JSON.parse(fs.readFileSync('./package.json'));
  var filename = data.name + '-' + data.version + '.zip';

  return gulp.src('./dist/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest('.'));
});

//
// dev tasks
//

gulp.task('server', ['build', 'watch']);

//
// default task
//

gulp.task('default', ['build', 'connect']);
