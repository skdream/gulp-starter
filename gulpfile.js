'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var shrink = require('gulp-cssshrink');
var minifyHTML = require('gulp-minify-html');
var Imagemin = require('imagemin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
// var livereload = require('gulp-livereload');




var webpack = require('gulp-webpack');


// MD5
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var runSequence = require('run-sequence');

var config = require('./webpack.config');

// todo
var browserSync = require('browser-sync');
var reload = browserSync.reload;


// watch files for changes and reload
gulp.task('serve', function() {

  browserSync({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(['**/*.html', 'css/**/*.css', 'js/**/*.js','js/**/*.css'], {cwd: './dist'}, reload);
});


// trans sass to css
gulp.task('sass',function(){
  return gulp.src(['scss/**/*.scss'])
          .pipe(sourcemaps.init())
          .pipe(sass().on( 'error', sass.logError ))
          .pipe(sourcemaps.write('./maps'))
          .pipe(gulp.dest('css'))
})


gulp.task('sass:watch',function(){
  gulp.watch('scss/**/*.scss',['sass','cssmin'])
})


gulp.task('cssmin',function(){
  return gulp.src('css/**/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

// ftp·¢²¼

var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
 
gulp.task( 'deploy', function () {
 
    var conn = ftp.create( {
        host:     'mywebsite.tld',
        user:     'me',
        password: 'mypass',
        parallel: 10,
        log:      gutil.log
    } );
 
    var globs = [
        'src/**',
        'css/**',
        'js/**',
        'fonts/**',
        'index.html'
    ];
 
    // using base = '.' will transfer everything to /public_html correctly 
    // turn off buffering in gulp.src for best performance 
 
    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/public_html' ) ) // only upload newer files 
        .pipe( conn.dest( '/public_html' ) );
 
} );



gulp.task('js', function () {
  return gulp.src(['./js/*.js'])
    //.pipe(concat('app.js'))
    .pipe(webpack(config))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./dist/js/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev/js'));
});



gulp.task('scripts', function() {
  return gulp.src('./js/*.js')
    .pipe(concat('all.js'))
    .pipe(rev())
    .pipe(gulp.dest('./dist/js/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev/js'));
});

gulp.task('html', function () {
  return gulp.src([ './index.html']) //'./dist/rev/**/*.json',
    .pipe( minifyHTML({
                empty:true,
                spare:true
            }) )
    .pipe(revCollector({
      dirReplacements: {
        'css':'css',
        'js':'js',
        'build/': ''
      }
    }))
    .pipe(gulp.dest('./dist/'));
});




gulp.task('jsDev', function () {
  return gulp.src(['./js/*.js'])
    //.pipe(concat('app.js'))
    .pipe(webpack(config))


   // .pipe(rev())
    .pipe(gulp.dest('./dist/js/'))
    //.pipe(rev.manifest())
   // .pipe(gulp.dest('./dist/rev/js'));


});




gulp.task('image', function () {
  new Imagemin()
      .src('images/*.{gif,jpg,png,svg}')
      .dest('dist/images')
      .use(Imagemin.jpegtran({progressive: true}))
      .use(Imagemin.optipng({optimizationLevel: 3}))
      .run(function (err, files) {
         // console.log(files[0]);
         
      });
});




gulp.task('css', function () {
  return gulp.src(['css/**/*.css'])
    .pipe(autoprefixer({
      browsers:['last 2 versions'],
      cascade:false
    }))
    .pipe(shrink())
    .pipe(rev())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev/css'));
});



gulp.task('watch', function () {
  gulp.watch('css/*.css', ['cssmin']);
  // gulp.watch('sass/*.scss', ['sass']);
  gulp.watch('js/**/*.css',['jsDev','html']);
  gulp.watch('js/*.js', ['jsDev']);
  gulp.watch('*.html',['html']);
});








gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});


gulp.task('html', function () {
  return gulp.src([ './index.html']) //'./dist/rev/**/*.json',
    .pipe( minifyHTML({
                empty:true,
                spare:true
            }) )
    .pipe(revCollector({
      dirReplacements: {
        'css':'css',
        'js':'js',
        'build/': ''
      }
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('publish', function (callback) {
  runSequence(
    ['css', 'js','image'],
    'html',
    callback);
});

gulp.task('dev', function (callback) {
  runSequence(
    'clean',['jsDev','watch'],'sass:watch','cssmin' ,'html','serve',
    callback);
});
