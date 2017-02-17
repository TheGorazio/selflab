const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const sassSrcPath = 'dev/sass/*.sass';
const sassDestPath = 'public/stylesheets/';

const jsSrcPath = 'dev/scripts/*.js';
const jsDestPath = 'public/scripts/';

gulp.task('sass', function() {
    return gulp.src(sassSrcPath)
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(sassDestPath));
});

gulp.task('js', function() {
    return gulp.src(jsSrcPath)
        .pipe(babel({
            presets: ['es2015']
        })) 
        .pipe(uglify())
        .pipe(gulp.dest(jsDestPath));
});

gulp.task('watch-sass', function() {
    return gulp.watch(sassSrcPath, gulp.series('sass'));
});

gulp.task('watch-js', function() {
    return gulp.watch(jsSrcPath, gulp.series('js'));
});

gulp.task('default', gulp.parallel(['watch-sass', 'watch-js']));