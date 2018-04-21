var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');

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
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
  gulp.src('./app/js/*.js')
		.pipe(concat('app.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('static', function() {
	gulp.src('./app/index.html')
		.pipe(gulp.dest('./dist'));
});
