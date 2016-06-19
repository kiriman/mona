var gulp 		    = require('gulp'),
    wiredep 	  = require('wiredep').stream,
    watch 		  = require('gulp-watch'),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    useref      = require('gulp-useref'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    minifyCss   = require('gulp-minify-css'),
    sourcemaps  = require('gulp-sourcemaps'),
    lazypipe    = require('lazypipe');

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

gulp.task('clean', function() {
  return del('build');
});

// Static server
gulp.task('serve', function() {
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

gulp.task('default', gulp.series('wiredep','serve'));//gulp.parallel();

gulp.task('build', gulp.series('clean','wiredep','useref'));
// .on('data', function(file){
// 	console.log('copy: '+file);
// })