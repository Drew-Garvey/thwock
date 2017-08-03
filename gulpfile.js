// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var util = require('gulp-util');
var fs = require('fs');
//var jade = require('gulp-jade');

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/css'))
    .pipe(reload({stream:true}));
});
/*
// Compile Our HTML
gulp.task('jade', function() {
  gulp.src('src/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./src/html/'))
});
*/
// BrowserSync
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "thwock.dev",
        host: "thwock.dev",
        port: "3000",
        open: "external",
        logPrefix: "Gulp Interactive Sample Tool"
    });
});

gulp.task('watch-js', function() {
  gulp.src('./app/js/*.js')
      .pipe(browserSync.reload({
        stream: true,
        once: true
      }));
});

gulp.task('watch-php', function() {
  gulp.src('./app/*.php')
      .pipe(browserSync.reload({
        stream: true,
        once: true
      }));
});

// Watch Files For Changes
gulp.task('watch', function() {
    //gulp.watch('src/jade/*.jade', ['jade']);
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/js/*.js', ['watch-js']);
    gulp.watch('app/*.php', ['watch-php']);

    //gulp.watch('src/css/*.css', ['build']);
});

// Default Task
gulp.task('default', ['sass', 'browser-sync', 'watch']);