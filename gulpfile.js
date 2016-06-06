'use strict';

var gulp = require('gulp'),
browserify = require('browserify'),
source = require('vinyl-source-stream'),
buffer = require('vinyl-buffer'),
sourcemaps = require('gulp-sourcemaps'),
gutil = require('gulp-util'),
jade = require('gulp-jade'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
cssnano = require('gulp-cssnano'),
imagemin = require('gulp-imagemin'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
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
    .pipe(browserSync.stream())
});

gulp.task('scripts', function() {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: './src/js/scripts.js',
        debug: true
    });

    return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('images', function() {
    return gulp.src('./src/img/**/*', {base: './src/img'})
    .pipe(imagemin())
    .pipe(gulp.dest('./assets/img/'))
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
    .pipe(gulp.dest('./assets/fonts'))
});

gulp.task('watch', function () {
    gulp.watch('./src/jade/**/*.jade', ['jade']).on('change', browserSync.reload)
    gulp.watch('./src/sass/**/*.scss', ['sass']).on('change', browserSync.reload)
    gulp.watch('./src/js/**/*.js', ['scripts']).on('change', browserSync.reload)
});

gulp.task('default', ['watch', 'jade', 'copy', 'sass', 'scripts', 'browser-sync']);

