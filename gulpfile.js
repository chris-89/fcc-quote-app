const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const defineMod = require('gulp-define-module');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const rollup = require('rollup-stream');
const sourcemaps = require('gulp-sourcemaps');

//paths
const jsEntry = './src/js/app.js';
const jsBundle = 'app.bundle.js';
const jsSrc = './src/js/*.js';
const sassSrc = './src/styles/*.scss';
const allSass = ['./src/styles/reset.scss', './src/styles/main.scss', './src/styles/user-tile.scss'];
const htmlSrc = './src/index.html';
const hbSrc = './src/templates/raw/*.hbs';
const hbDest = './src/templates/compiled';
const dist = './dist';

//error handler
const handleErr = function(err) {
    notify.onError({
        title: 'Gulp error in ' + err.plugin,
        message: err.toString()
    })(err);
    gutil.beep();
}

//TASKS ---------------------------------------------

//SERVER
gulp.task('serve', function() {
    browserSync.init({
        server: dist,
    })
})

//HTML
//copies html to dist folder
gulp.task('copyHtml', function() {
    console.log('copying html')
    gulp.src(htmlSrc)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
})

//JS
//transpiles to es5 bundles copies to dist updates browser
gulp.task('scripts', function() {
    console.log('compiling scripts');
    gulp.src(jsEntry)
    .pipe(sourcemaps.init())
    .pipe(rollup({
        input: jsEntry,
        format: 'es',
        plugins: [
            babel({
                presets: [
                    ["env"]
                ]
            })
        ]
    })
    .on('error', handleErr)
    .pipe(source(jsEntry))
    .pipe(rename(jsBundle))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${dist}/js`))
    .pipe(browserSync.stream()))
    console.log('finished compiling scripts');
})

//CSS| SASS
//compiles to css copies to dist updates browser
gulp.task('styles', function() {
    console.log('compiling styles')
    gulp.src(allSass)
    .pipe(plumber({errorHandler: handleErr}))
    .pipe(concat('main.scss'))
    .pipe(sass())
    .pipe(rename('styles.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${dist}/styles`))
    .pipe(browserSync.stream());;
    console.log('finished compiling styles');
})

//HANDLEBARS
// precompiles handlebars templates wraps as es6 module
gulp.task('templates', function() {
    return gulp.src(hbSrc)
    .pipe(handlebars({
        handlebars: require('handlebars')
    }))
    .pipe(rename({extName: '.js'}))
    .pipe(defineMod('es6'))
    .pipe(gulp.dest(hbDest));
})

//WATCH
gulp.task('watch', function() {
    gulp.watch(htmlSrc, ['copyHtml']);
    gulp.watch(jsSrc, ['scripts']);
    gulp.watch(sassSrc, ['styles']);
    gulp.watch(hbSrc, ['templates']);
})


//DEFAULT RUN
gulp.task('default', ['copyHtml', 'scripts', 'styles', 'templates', 'serve', 'watch'])
