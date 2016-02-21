var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var uglify      = require('gulp-uglify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');
var filter      = require('gulp-filter');
var nodemon     = require('gulp-nodemon');
var browserSync = require('browser-sync').create();

gulp.task('browserify', function() {
  browserify('./src/index.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['browserify'])
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
      proxy: 'http://localhost:3000',
      port: 8000,
      files: ["dist/**/*.*"],
      browser: "google chrome",
      reloadDelay: 1000
  });
  gulp.watch(["public/**", "dist/**"], function() {
    browserSync.reload();
  });
});

gulp.task('nodemon', function() {
  return nodemon({
    script: 'server.js'
  }).on('restart', function() {
      browserSync.reload();
  });
});

gulp.task('default', ['browserify', 'watch', 'browser-sync']);
