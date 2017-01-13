const gulp = require('gulp');
const sass = require('gulp-sass');

const sassSrcPath = 'dev/sass/*.sass';
const sassDestPath = 'public/stylesheets/';

gulp.task('sass', function() {
    return gulp.src(sassSrcPath)
        .pipe(sass())
        .pipe(gulp.dest(sassDestPath));
});

gulp.task('serve', function() {

    return gulp.watch('dev/sass/*.sass', gulp.series('sass'));

});

gulp.task('default', gulp.series('serve'));