/* eslint global-require: "off" */
/* eslint import/no-dynamic-require: "off" */
/*
 |--------------------------------------------------------------------------
 | Modules
 |--------------------------------------------------------------------------
 |
 */
const gulp = require('gulp-group')(require('gulp'));
const mod = {
    path: require('path'),
    babel: require('gulp-babel'),
    rename: require('gulp-rename'),
    sass: require('gulp-sass')
};

/*
 |--------------------------------------------------------------------------
 | Folders, used in project
 |--------------------------------------------------------------------------
 |
 */
const dir = {
    build: mod.path.join(__dirname, 'build'),
    src: mod.path.join(__dirname, 'src')
};

/*
 |--------------------------------------------------------------------------
 | Tasks
 |--------------------------------------------------------------------------
 |
 */

gulp.group('build', () => {
    gulp.task('js', () => {
        gulp.src(mod.path.join(dir.src, 'index.js'))
            .pipe(mod.babel())
            .pipe(mod.rename('marionette-responsive-avatar.js'))
            .pipe(gulp.dest(dir.build));
    });

    gulp.task('sass', () => {
        return gulp.src(mod.path.join(dir.src, 'styles.scss'))
            .pipe(mod.sass().on('error', mod.sass.logError))
            .pipe(mod.rename('marionette-responsive-avatar.css'))
            .pipe(gulp.dest(dir.build));
    });

    gulp.task('dev', ['./js', './sass'])
});
