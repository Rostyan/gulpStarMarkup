`use strict`;

let gulp = require('gulp');
let clean = require('gulp-clean');
let sass = require('gulp-sass');
let gulpSequence = require('gulp-sequence');
let autoprefixer = require('gulp-autoprefixer');
let eslint = require('gulp-eslint');
let webserver = require('gulp-webserver');
let htmlmin = require('gulp-htmlmin');
let noop = require("gulp-noop");

let isProduction = process.env.NODE_ENV === "production";

//clean code
gulp.task('clean' , function () {
  return gulp.src('./dist/**/*', {read: false})
    .pipe(clean());
});

//html file
gulp.task('views' , function (){
  gulp.src('./src/*.html')
    .pipe(isProduction ? htmlmin({collapseWhitespace: true}) : noop())
    .pipe(gulp.dest('./dist/'));
});

//script file
gulp.task('scripts' , function (){
  gulp.src('./src/scripts/*.js')
    .pipe(gulp.dest('./dist/scripts/'));
});

//check style
gulp.task('scripts:lint' , function (){
  gulp.src('./src/scripts/*js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//style file
gulp.task('style' , function (){
  gulp.src('./src/style/*.sass')
    .pipe(sass({
       outputStyle: isProduction ? "compressed" : 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/style/'));
});

//build
gulp.task('build',function (done) {
    gulpSequence('clean', ['views', 'scripts', 'style'])(done)
});

//
gulp.task('watch', function () {
  gulp.watch('src/**/*', ['build']);
  gulp.watch('src/scripts/**/*.js', ['scripts:lint']);
});

//server for gulp
gulp.task('server', function () {
  gulp.src('dist')
    .pipe(webserver({
      port: 8051,
      livereload: isProduction ? true : false,
      directoryListing: false,
      open: false
    }));
});

//default
gulp.task('default', gulpSequence('scripts:lint', 'build', ['server ,''watch']));