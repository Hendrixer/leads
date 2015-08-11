var gulp = require('gulp');
var sync = require('run-sequence');
var webpack = require('webpack-stream');
var serve = require('browser-sync');
var nodemon = require('gulp-nodemon');
var webpackConf = require('./webpack.config');
var path = require('path');
var rename = require('gulp-rename');
var template = require('gulp-template');
var yargs = require('yargs').argv;

var reload = function() {
  serve.reload();
};

var capString = function(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

var serverStarted = false;

var paths = {
  client: {
    entry: './client/app/app.js',
    js: './client/app/**/*.js',
    app: './client/app/**/*{.js,.styl,.html}',
    output: './dist',
    toCopy: ['./client/index.html']
  },
  server: {},
  templates: {
    base: './build/templates',
    rest: './server/api',
    component: './client/app/components'
  }
};

/**
 * start the server with nodemon
 */
gulp.task('server', function(done) {
  return nodemon({
    script: 'server/index.js',
    ignore: ['node_modules/**/*.**', 'client/**/*.**', 'dist/**/*.**']
  })
  .on('start', function() {
    if (!serverStarted) {
      done();
      serverStarted = true;
    }
  });
});

gulp.task('serve', function() {
  var port = process.env.PORT || 3500;
  serve({
    port: 9000,
    open: false,
    proxy: 'http://localhost:' + port
  });
});

gulp.task('copy', function() {
  return gulp.src(paths.client.toCopy, {base: 'client'})
    .pipe(gulp.dest(paths.client.output));
});

gulp.task('bundle', function() {
  return gulp.src(paths.client.entry)
    .pipe(webpack(webpackConf))
    .pipe(gulp.dest(paths.client.output));
});

gulp.task('watch', function() {
  var watchedPaths = [].concat(
    paths.client.app
  );

  gulp.watch(watchedPaths, ['bundle', reload]);
  gulp.watch(paths.toCopy, ['copy', reload]);
});

gulp.task('generate', function(){
  var type = yargs.type;
  var name = yargs.name;
  var destPath = path.join(paths.templates[type], name);
  var tempFiles = path.join(paths.templates.base, type, '/**/*.js');

  return gulp.src(tempFiles)
    .pipe(template({
      name: name,
      upcaseName: capString(name)
    }))
    .pipe(rename(function(filePath){
      filePath.basename = filePath.basename.replace(type, name);
    }))
    .pipe(gulp.dest(destPath));

});

gulp.task('default', function(done) {
  sync('bundle', 'copy', 'server', 'serve', 'watch', done);
});

