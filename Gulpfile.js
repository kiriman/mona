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
    connectPHP  = require('gulp-connect-php');

gulp.task('wiredep', function () {
  return gulp.src('src/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('src/'));
});

gulp.task('useref', function () {
  return gulp.src('src/index.html')
        .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

gulp.task('copy', function () {
  return gulp.src('src/api/*.*')
    .pipe(gulp.dest('build/api/'));
});

gulp.task('clean', function() {
  return del('!build/fonts', 'build');
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

//PHP сервер
gulp.task('php', function(){
  connectPHP.server({ base: 'src/', keepalive:true, hostname: '93.88.210.4', port:8080, open: false});
});

gulp.task('default', function() {});
gulp.task('serve', gulp.series('wiredep',gulp.parallel('browserSync','php')));
gulp.task('build', gulp.series('clean','copy','wiredep','useref'));
// .on('data', function(file){
// 	console.log('copy: '+file);
// })