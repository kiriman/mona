var gulp 		= require('gulp'),
    wiredep 	= require('wiredep').stream,
    watch 		= require('gulp-watch'),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    useref      = require('gulp-useref'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    minifyCss   = require('gulp-minify-css'),
    sourcemaps  = require('gulp-sourcemaps'),
    lazypipe    = require('lazypipe'),
    connectPHP  = require('gulp-connect-php'),
    babel       = require('gulp-babel');

// Include refs bower_components
gulp.task('wiredep', function () {
  return gulp.src('src/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('src/'));
});

// Create sourceMap, uglify, css-min from refs in index.html
// and copy to build/ direcroty.
gulp.task('useref', function () {
  return gulp.src('src/index.html')
        .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(gulpif('*.js', babel({presets: ['es2015']}) ))
        .pipe(gulpif('*.js', uglify() ))//.on('error', function(e){console.log(e);}) ))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

// Copy static files
gulp.task('copyApi', function () {
  return gulp.src(['src/api/*.*'], {dot: true})
    .pipe(gulp.dest('build/api/'));
});
gulp.task('copyFonts', function () {
  return gulp.src('bower_components/bootstrap/fonts/*.*')
    .pipe(gulp.dest('build/fonts/'));
});
gulp.task('copy', gulp.parallel('copyApi','copyFonts'));

// Clean buld/ directory
gulp.task('clean', function() {
  return del('build');
});

// Static server Browser-Sync
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ["src/"],
		    routes: {
		        "/bower_components": "./bower_components"
		    }
        },
        host: "93.88.210.4"
    });
    gulp.watch("src/**/*.*").on('change', browserSync.reload);
});

//PHP server
gulp.task('php', function(){
  connectPHP.server({ base: 'src/', keepalive:true, hostname: '93.88.210.4', port:8080, open: true});
});

// gulp.task('default', function() {});
gulp.task('serve', gulp.series('wiredep',gulp.parallel('browserSync','php')));
gulp.task('build', gulp.series('clean',gulp.parallel('copy','wiredep'),'useref'));
// .on('data', function(file){
// 	console.log('copy: '+file);
// })