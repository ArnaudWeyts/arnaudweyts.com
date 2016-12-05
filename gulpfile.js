"use strict";

var gulp = require("gulp"),
rename = require("gulp-rename"),
browserify = require("browserify"),
source = require("vinyl-source-stream"),
buffer = require("vinyl-buffer"),
sourcemaps = require("gulp-sourcemaps"),
gutil = require("gulp-util"),
jade = require("gulp-jade"),
sass = require("gulp-sass"),
autoprefixer = require("gulp-autoprefixer"),
purify = require("gulp-purifycss"),
cssnano = require("gulp-cssnano"),
imagemin = require("gulp-imagemin"),
favicons = require("gulp-favicons"),
concat = require("gulp-concat"),
uglify = require("gulp-uglify"),
browserSync = require("browser-sync").create();

var SRC = "./src";
var DEST = "./_site";

gulp.task("jade", function() {
    var YOUR_LOCALS = {};

    gulp.src(SRC + "/jade/*.jade")
    .pipe(jade({
        locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest(DEST))
});

gulp.task("sass", function () {
    return gulp.src(SRC + "/sass/**/styles.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
        browsers: [">1%"],
        cascade: false
    }))
    .pipe(purify([DEST + "/assets/js/**/*.js", DEST + "/*.html"]))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(DEST + "/assets/css/"))
    .pipe(browserSync.stream())
});

gulp.task("scripts", function() {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: SRC + "/js/scripts.js",
        debug: true
    });

    return b.bundle()
    .pipe(source("main.js"))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on("error", gutil.log)
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(DEST + "/assets/js/"));
});

gulp.task("favicons", function () {
    gulp.src(SRC + "/img/logo.png").pipe(favicons({
        appName: "Arnaud Weyts",
        appDescription: "This is my personal website",
        developerName: "Arnaud Weyts",
        developerURL: "http://weyts.xyz/",
        background: "#020307",
        path: DEST + "/favicons/",
        url: "http://weyts.xyz/",
        display: "standalone",
        orientation: "portrait",
        version: 1.0,
        logging: false,
        online: false,
        html: DEST + "index.html",
        pipeHTML: true,
        replace: true
    })).pipe(gulp.dest("./"));
});

gulp.task("images", function() {
    return gulp.src(SRC + "/img/**/*", {base: SRC + "/img"})
    .pipe(imagemin())
    .pipe(gulp.dest(DEST + "/assets/img/"))
});

gulp.task("browser-sync", () => {
    browserSync.init({
        server: {
            baseDir: DEST,
            index: "index.html"
        },
        notify: false
    });
});

gulp.task("copy", function () {
    gulp.src(SRC + "/fonts/*")
    .pipe(gulp.dest(DEST + "/assets/fonts"))
    gulp.src(SRC + "google*.html")
    .pipe(gulp.dest(DEST))
    gulp.src(SRC + "/favicons/*")
    .pipe(gulp.dest(DEST + "/assets/favicons"))
});

gulp.task("watch", function () {
    gulp.watch(SRC + "/jade/**/*.jade", ["jade"]).on("change", browserSync.reload);
    gulp.watch(SRC + "/sass/**/*.scss", ["sass"]).on("change", browserSync.reload);
    gulp.watch(SRC + "/js/**/*.js", ["scripts"]).on("change", browserSync.reload);
});

gulp.task("default", ["watch", "jade", "copy", "scripts", "sass", "browser-sync"]);
gulp.task("compile", ["jade", "copy", "scripts", "sass", "images"]);

