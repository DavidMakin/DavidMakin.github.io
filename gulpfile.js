const gulp = require('gulp');
const { src, dest, series, parallel } = require('gulp');

const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const cp = require('child_process');
const browserSync = require('browser-sync');
const webp = require('gulp-webp');
const cwebp = require('gulp-cwebp');
const imageminWebp = require('imagemin-webp');
const rename = require('gulp-rename');

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

// Rebuild Jekyll and page reload
gulp.task('jekyll-rebuild', function () {
    browserSync.reload();
});

// Compile files
gulp.task('sass', function () {
    return gulp.src('assets/css/scss/main.scss')
        .pipe(sass({
            outputStyle: 'expanded',
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

// Compress images and convert to webp
const ASSETS_DIR = 'assets';
const EXCLUDE_SRC_GLOB = `!(favicon*|*-256|*-512|*-1024)`;
function convert(from, to, extension = 'webp') {
    const SRC = `${ASSETS_DIR}/${from}/**/${EXCLUDE_SRC_GLOB}*.{jpg,png}`;
    const DEST = `${ASSETS_DIR}/${from}/`;

    return function convertWebp() {
        return src(SRC)
            .pipe(imagemin([imageminWebp({ quality: 80 })]))
            .pipe(
                rename({
                    extname: `.${extension}`,
                })
            )
            .pipe(dest(DEST));
    };
}
gulp.task('to-webp', convert('img'))

// Compression images
gulp.task('img-min', function() {
    return gulp.src('assets/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('_site/assets/img'))
        .pipe(browserSync.reload({stream:true}));
});

// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', gulp.series('sass', 'to-webp', 'img-min', 'jekyll-build'), function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
    });
});

// Watch scss, html, img files
gulp.task('watch', function () {
    gulp.watch('assets/css/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('assets/js/**/*.js', gulp.series('jekyll-rebuild'));
    gulp.watch('assets/img/**/*', gulp.series('img'));
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_pages/*.html', '_posts/*'], gulp.series('jekyll-rebuild'));
});

//  Default task
gulp.task('default', gulp.series('sass', 'to-webp', 'img-min'));
