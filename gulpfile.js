const gulp = require("gulp");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

const clean = () => del(["./public"]);

const minifyHTML = () => {
    return gulp
        .src("./client/*.html")
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest("./public"));
};

const processCSS = () => {
    return gulp
        .src("./client/css/*.css")
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest("./public/css"));
};

const imageOptimize = () => {
    return gulp
        .src("./client/images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("./public/images"));
};

const uglifyJS = () => {
    return gulp
        .src("./client/js/*.js")
        .pipe(
            babel({
                presets: ["@babel/env"],
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest("./public/js"));
};

exports.clean = clean;

exports.build = gulp.parallel(minifyHTML, processCSS, uglifyJS, imageOptimize);
