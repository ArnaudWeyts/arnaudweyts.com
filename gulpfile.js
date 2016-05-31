'use strict';

var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
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
  return gulp.src('./src/sass/**/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
    	browsers: ['>1%'],
    	cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync.init({
	  	server: {
	  		baseDir: './',
	  		index: 'index.html'
	  	},
	  	notify: false
  	});
});

gulp.task('copy', function () {
	gulp.src('./node_modules/font-awesome/fonts/*')
		.pipe(gulp.dest('./assets/fonts'));
	gulp.src('./src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./assets/img'));
});

gulp.task('watch', function () {
	gulp.watch('./src/jade/*.jade', ['jade']).on('change', browserSync.reload);
	gulp.watch('./src/sass/**/*.scss', ['sass']).on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'jade', 'copy', 'sass', 'browser-sync']);

