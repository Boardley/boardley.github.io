// Packages need to be required here
let bourbon 		= require('bourbon'),
		browserSync = require('browser-sync'),
		cleanCSS 		= require('gulp-clean-css'),
		concat 			= require('gulp-concat'),
		gulp        = require('gulp'),
		gutil 			= require('gulp-util'),
		imagemin 		= require('gulp-imagemin'),
		jshint 			= require('gulp-jshint'),
		notify 			= require('gulp-notify');
		plumber 		= require('gulp-plumber'),
		prettify 		= require('gulp-jsbeautifier'),
		reload      = browserSync.reload,
		rename 			= require('gulp-rename'),
		sass        = require('gulp-sass'),
		sourcemaps 	= require('gulp-sourcemaps'),
		streamqueue = require('streamqueue'),
		uglify 			= require('gulp-uglify');

let plumberErrorHandler = { errorHandler: notify.onError({
    
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};

// gulp.task('copySlick', function() {
//    gulp.src('./node_modules/slick-carousel/slick/fonts/**/*.{ttf,woff,woff2,eof,svg}')
//    .pipe(gulp.dest('./fonts'));
//    gulp.src('./node_modules/slick-carousel/slick/ajax-loader.gif')
//    .pipe(gulp.dest('./images'));
//    gulp.src('./node_modules/slick-carousel/slick/slick.js')
//    .pipe(gulp.dest('./js'));
//    gulp.src('./node_modules/slick-carousel/slick/slick.scss')
//    .pipe(rename('_slick.scss'))
//    .pipe(gulp.dest('./sass/modules'));
//    gulp.src('./node_modules/slick-carousel/slick/slick-theme.scss')
//    .pipe(rename('_slick-theme.scss'))
//    .pipe(gulp.dest('./sass/modules'));
// });

gulp.task('browser-sync', function() {
    //watch files
	let files = [
	'./css/*.css',
	'./js/*.js',
	'./**/*.html',
	'./**/*.php'
	];

	//initialize browsersync
  browserSync.init(files, {
 		//browsersync with a php server
 		// You need to change the proxy to whatever your URL for your local install is.
   	server: true,
    //proxy: "http://localhost/~boardley/sterling/",
    notify: false
  });
});

// Sass task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('build:css', function () {
	return gulp.src('./sass/*.scss')
	.pipe(plumber(plumberErrorHandler))
  .pipe(sourcemaps.init())
  .pipe(sass({
      includePaths: [].concat(bourbon.includePaths),
  }))
  .pipe(cleanCSS({
  	level: 2
	}))
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('./css'))
  .pipe(reload({stream:true}));
});

gulp.task('final:css', function () {
  return gulp.src('./sass/*.scss')
  .pipe(plumber(plumberErrorHandler))
  .pipe(sass({
      includePaths: [].concat(bourbon.includePaths),
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(gulp.dest('./css'));
});


// Build Scripts
gulp.task('build:scripts', function() {
  let jsfiles = [
  	'./js/slick.js',
  	'./js/custom.js'
  ];

  return streamqueue({ objectMode: true }, gulp.src(jsfiles))
    .pipe(concat('theme.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
    .on('error', gutil.log);
});

let servedep = [
	'browser-sync',
  'build:scripts',
  'build:css'
];
gulp.task('serve', servedep, function() {

  // Watch app .scss files, changes are piped to browserSync
  gulp.watch('./sass/**/*.scss', ['build:css']);

  // Watch app .js files
  gulp.watch('./js/**/*.js', ['build:scripts']);

});


// Default - Initial Build

let defaultTasks = [
  'build:css',
	'build:scripts'
]

gulp.task('default', defaultTasks);