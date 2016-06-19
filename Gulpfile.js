var gulp 		    = require('gulp'),
    wiredep 	  = require('wiredep').stream,
    watch 		  = require('gulp-watch'),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    concat 		  = require('gulp-concat'),
    useref      = require('gulp-useref');

gulp.task('wiredep', function () {
  return gulp.src('src/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('src/'));
});

gulp.task('useref', function () {
  return gulp.src('src/index.html')
        .pipe(useref())
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

gulp.task('default', gulp.series('serve'));
// gulp.task('build', gulp.series('clean', gulp.parallel('wiredep')));
gulp.task('build', gulp.series('clean','useref'));
// gulp.task('build', []);
// .on('data', function(file){
// 	console.log('copy: '+file);
// })
// gulp.task('default', function() {
//   // place code for your default task here
// });