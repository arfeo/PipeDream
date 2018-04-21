const gulp = require('gulp');
const sass = require('gulp-sass');
const minify = require('gulp-babel-minify');
const cssmin = require('gulp-cssmin');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');
const jsImport = require('gulp-js-import');
const eslint = require('gulp-eslint');

gulp.task('build', function(done) {
	return runSequence(
		'static',
		'js',
		'sass',
		function () { done(); }
	);
});

gulp.task('watch', function() {
	gulp.watch('./app/js/**/*', ['js']);
	gulp.watch('./app/scss/**/*', ['sass']);
});

gulp.task('sass', function() {
	return gulp.src('./app/scss/app.scss')
		.pipe(sass())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist'));
});

gulp.task('eslint', function () {
  return gulp.src([
		'**/*.js',
		'!app/js/app.js',
		'!node_modules/**',
		'!dist/**',
	])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('js', ['eslint'], function() {
	gulp.src('./app/js/app.js')
		.pipe(jsImport({ hideConsole: true }))
		.pipe(minify({
			mangle: {
				keepClassName: true
			}
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('static', function() {
	gulp.src('./app/index.html')
		.pipe(gulp.dest('./dist'));
});
