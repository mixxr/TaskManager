var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    minifyHTML = require('gulp-htmlmin'),
    foreach = require('gulp-foreach'),
    del = require('del');

gulp.task('jshint', function() {
  return gulp.src('app/js/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
    //gulp.start('usemin', 'imagemin','copyfonts');
    gulp.start('useminmultiple','copyfonts');
});

gulp.task('usemin',['jshint'], function () {
  return gulp.src('app/index.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        html: [minifyHTML({empty: true})],
        js: [uglify(),rev()]
      }))
      .pipe(gulp.dest('dist/'));
});

gulp.task('useminmultiple',['jshint'],  function () {
  return gulp.src('app/*.html')
    .pipe(foreach(function (stream, file) {
      return stream
        .pipe(usemin({
            css:[minifycss(),rev()],
            html: [minifyHTML({empty: true})],
            js: [uglify(),rev()]
        }))
        // BE CAREFUL!!!
        // This now has the CSS/JS files added to the stream
        // Not just the HTML files you sourced
        .pipe(gulp.dest('dist/'));
    }))
});


// Images
gulp.task('imagemin', function() {
  return del(['dist/images']), gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

// Watch
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{app/js/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
      // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
   var files = [
      'app/**/*.html',
      'app/styles/**/*.css',
      'app/images/**/*.png',
      'app/js/**/*.js',
      'dist/**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "menu.html"
      }
   });
        
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
});

