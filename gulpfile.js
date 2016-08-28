// var gulp = require('gulp'),
//     gulpWatch = require('gulp-watch'),
//     del = require('del'),
//     runSequence = require('run-sequence'),
//     argv = process.argv,
//     tslint = require("gulp-tslint");



// /**
//  * Ionic hooks
//  * Add ':before' or ':after' to any Ionic project command name to run the specified
//  * tasks before or after the command.
//  */
// gulp.task('serve:before', ['default', 'watch']);
// gulp.task('emulate:before', ['build']);
// gulp.task('deploy:before', ['build']);
// gulp.task('build:before', ['build']);

// // we want to 'watch' when livereloading
// var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
// gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

// /**
//  * Ionic Gulp tasks, for more information on each see
//  * https://github.com/driftyco/ionic-gulp-tasks
//  *
//  * Using these will allow you to stay up to date if the default Ionic 2 build
//  * changes, but you are of course welcome (and encouraged) to customize your
//  * build however you see fit.
//  */
// var buildBrowserify = require('ionic-gulp-browserify-typescript');
// var buildSass = require('ionic-gulp-sass-build');
// var copyHTML = require('ionic-gulp-html-copy');
// var copyFonts = require('ionic-gulp-fonts-copy');
// var copyScripts = require('ionic-gulp-scripts-copy');

// var isRelease = argv.indexOf('--release') > -1;

// gulp.task('watch', ['clean'], function(done){
//   runSequence(
//     ['sass', 'html', 'fonts', 'scripts', 'img', 'tslint'],
//     function(){
//       gulpWatch('app/**/*.scss', function (){ gulp.start('sass'); });
//       gulpWatch('app/**/*.html', function (){ gulp.start('html'); });
//       gulpWatch('resources/img/**/*', function (){ gulp.start('img'); });
//       gulpWatch('app/**/*.ts', function (){ gulp.start('tslint'); });
//       buildBrowserify({ watch: true }).on('end', done);
//     }
//   );
// });

// gulp.task('build', ['clean'], function(done){
//   runSequence(
//     ['sass', 'html', 'fonts', 'scripts', 'img', 'tslint'],
//     function(){
//       buildBrowserify({
//         minify: isRelease,
//         browserifyOptions: {
//           debug: !isRelease
//         },
//         uglifyOptions: {
//           mangle: false
//         }
//       }).on('end', done);
//     }
//   );
// });

// gulp.task('img', function () {
//   return gulp.src(['./resources/img/**/*'])
//       .pipe(gulp.dest('www/build/img'));
// });

// gulp.task("tslint", function () {
//     return gulp.src('app/**/*.ts')
//         .pipe(tslint({configuration: 'tslint.json'}))
//         .pipe(tslint.report('verbose'));
// });

// gulp.task('sass', function () {
//   buildSass({src: [
//     'app/theme/app.+(ios|md|wp).scss',
//     'node_modules/animate.css/animate.min.css',
//     'node_modules/font-awesome/scss/font-awesome.scss'
//   ]});
// });
// gulp.task('html', copyHTML);
// gulp.task('fonts', function () {
//   copyFonts({
//     src: [
//       'node_modules/ionic-angular/fonts/**/*.+(ttf|woff|woff2)',
//       'node_modules/font-awesome/fonts/**/*.+(ttf|woff|woff2)'
//     ]
//   });
// });
// gulp.task('scripts', copyScripts);
// gulp.task('clean', function(){
//   return del('www/build');
// });


var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    tslint = require("gulp-tslint"),
    argv = process.argv;


/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts', 'img', 'tslint'],
    function(){
      gulpWatch('app/**/*.scss', function (){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function (){ gulp.start('html'); });
      gulpWatch('resources/img/**/*', function (){ gulp.start('img'); });
      gulpWatch('app/**/*.ts', function (){ gulp.start('tslint'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

gulp.task('build', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});

gulp.task('img', function () {
  return gulp.src(['./resources/img/**/*'])
      .pipe(gulp.dest('www/build/img'));
});

gulp.task("tslint", function () {
    return gulp.src('app/**/*.ts')
        .pipe(tslint({configuration: 'tslint.json'}))
        .pipe(tslint.report('verbose'));
});

gulp.task('sass', function () {
  buildSass({src: [
    'app/theme/app.+(ios|md|wp).scss',
    'node_modules/animate.css/animate.min.css',
    'node_modules/font-awesome/scss/font-awesome.scss'
  ]});
});
gulp.task('html', copyHTML);

gulp.task('fonts', function () {
  copyFonts({
    src: [
      'node_modules/ionic-angular/fonts/**/*.+(ttf|woff|woff2)',
      'node_modules/font-awesome/fonts/**/*.+(ttf|woff|woff2)'
    ]
  });
});
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  return del('www/build');
});
