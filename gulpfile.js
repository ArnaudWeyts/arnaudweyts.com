'use strict';

const gulp = require('gulp'),
rename = require('gulp-rename'),
browserify = require('browserify'),
source = require('vinyl-source-stream'),
buffer = require('vinyl-buffer'),
sourcemaps = require('gulp-sourcemaps'),
gutil = require('gulp-util'),
htmlmin = require('gulp-htmlmin'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
browserSync = require('browser-sync').create();

const SRC = './src';
const DEST = './build';

gulp.task('html', () => {
    return gulp.src(SRC + '/html/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(DEST));
});

gulp.task('sass', () => {
    return gulp.src(SRC + '/sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['>1%'],
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(DEST + '/assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: SRC + '/js/scripts.js',
        debug: true
    });

    return b.bundle()
    .pipe(source('main.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST + '/assets/js/'));
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: DEST,
            index: 'index.html'
        },
        notify: false,
        open: false
    });
});

gulp.task('copy', () => {
    gulp.src(SRC + '/fonts/*')
    .pipe(gulp.dest(DEST + '/assets/fonts'));
    gulp.src(SRC + '/html/google*.html')
    .pipe(gulp.dest(DEST));
    gulp.src(SRC + '/favicons/*')
    .pipe(gulp.dest(DEST + '/assets/favicons'));
});

gulp.task('img', () => {
    gulp.src(SRC + '/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(DEST + '/assets/img'));
});

gulp.task('watch', () => {
    gulp.watch(SRC + '/html/**/*.html', ['html']).on('change', browserSync.reload);
    gulp.watch(SRC + '/sass/**/*.scss', ['sass']);
    gulp.watch(SRC + '/js/**/*.js', ['scripts']).on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'img', 'copy', 'html', 'scripts', 'sass', 'browser-sync']);
gulp.task('compile', ['img', 'copy', 'html', 'scripts', 'sass']);
