'use strict';

var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('cssnano'),
	browserSync = require('browser-sync').create();

gulp.task('jade', function() {
	var YOUR_LOCALS = {};

	gulp.src('./src/jade/*.jade')
	.pipe(jade({
		locals: YOUR_LOCALS
	}))
	.pipe(gulp.dest('./'))
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
    	browsers: ['>1%'],
    	cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('browser-sync', () => {
  browserSync.init({
	  	server: {
	  		baseDir: './',
	  		index: 'index.html'
	  	}
  	});
});

gulp.task('watch', function () {
	gulp.watch('./src/jade/*.jade', ['jade']).on('change', browserSync.reload);
	gulp.watch('./src/sass/**/*.scss', ['sass']).on('change', browserSync.reload);
});

