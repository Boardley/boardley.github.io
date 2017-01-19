// Packages need to be required here
var gulp = require('gulp'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload,
		sass = require('gulp-sass'),
		bourbon = require('bourbon'),
		neat = require('node-neat'),
		cleanCSS = require('gulp-clean-css'),
		sourcemaps = require('gulp-sourcemaps'),
		jshint = require('gulp-jshint'),
		concat = require('gulp-concat'),
		imagemin = require('gulp-imagemin'),
		plumber = require('gulp-plumber'),
		notify = require('gulp-notify'),
		child = require('child_process'),
		gutil = require('gulp-util'),
		prettify = require('gulp-jsbeautifier'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		siteRoot = '_site',
		cssFiles = 'scss/**/*.?(s)css';



var plumberErrorHandler = {
		errorHandler: notify.onError({

				title: 'Gulp',
				message: 'Error: <%= error.message %>'
		})
};

gulp.task('browser-sync', function() {
		//watch files
		var files = [
				siteRoot+'/css/*.css',
				siteRoot+'/js/*.js',
				siteRoot+'/**/*.html'
		];

		//initialize browsersync
		browserSync.init({
				//browsersync with a php server
				// You need to change the proxy to whatever your URL for your local install is.
				//proxy: "http://localhost/websitegoeshere/",
				files: [siteRoot + '/**'],
				server: {
						baseDir: siteRoot
				},
				notify: false
		});
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {

		// Copy Javascript
		gulp.src(['node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'])
				.pipe(gulp.dest('js/vendor'))

		gulp.src(['node_modules/jquery/dist/jquery.min.js'])
				.pipe(gulp.dest('js/vendor'))

		// Copy Fonts
		gulp.src([
						'node_modules/font-awesome/fonts/**/*.{ttf,woff,woff2,eof,svg}'
				])
				.pipe(gulp.dest('fonts/font-awesome'))

		gulp.src('node_modules/bootstrap-sass/assets/fonts/**/*.{ttf,woff,woff2,eof,svg}')
				.pipe(gulp.dest('fonts'))
})

gulp.task('jekyll', () => {
		var jekyll = child.spawn('jekyll', ['build',
				'--watch',
				'--incremental',
				'--drafts'
		]);

		var jekyllLogger = (buffer) => {
				buffer.toString()
						.split(/\n/)
						.forEach((message) => gutil.log('Jekyll: ' + message));
		};

		jekyll.stdout.on('data', jekyllLogger);
		jekyll.stderr.on('data', jekyllLogger);
});


// Shows debug messages.
gulp.task('prettify', function() {

		gulp.src(["scss/**/*.scss"])
				.pipe(prettify({
						debug: true,
						indent_level: 1,
				}))
				.pipe(gulp.dest('./scss'));

		gulp.src(['./*.html'])
				.pipe(prettify({
						debug: true,
						indent_level: 1,
				}))
				.pipe(gulp.dest('./'));

		gulp.src(['js/*.js', '!js/vendor/*.js'])
				.pipe(prettify({
						debug: true,
						indent_level: 1,
				}))
				.pipe(gulp.dest('./js'))
				.pipe(concat('site.js'))
				.pipe(gulp.dest('./js'))
				.pipe(rename('site.min.js'))
				.pipe(uglify())
				.pipe(gulp.dest('./js'));
});


// Sass task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function() {
		return gulp.src('scss/*.scss')
				.pipe(plumber(plumberErrorHandler))
				.pipe(sourcemaps.init())
				.pipe(sass({
						includePaths: [].concat(bourbon.includePaths, neat.includePaths),
				}))
				.pipe(cleanCSS())
				.pipe(sourcemaps.write())
				.pipe(gulp.dest("css"))
				.pipe(reload({
						stream: true
				}));
});

// Image Optimization
gulp.task('img', function() {

		gulp.src('img/src/*.{png,jpg,gif}')

				.pipe(imagemin({
						optimizationLevel: 7,
						progressive: true
				}))
				.pipe(gulp.dest('img'))
});

// Default task to be run with `gulp`
gulp.task('default', ['browser-sync', 'copy', 'sass', 'jekyll',], function() {
		gulp.watch("scss/**/*.scss", ['sass', 'prettify']);
		gulp.watch('_site/*.html', browserSync.reload);
		gulp.watch('js/**/*.js', browserSync.reload);
});