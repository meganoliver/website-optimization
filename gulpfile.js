'use strict';

var gulp = require('gulp'),
 concat = require('gulp-concat'),
 uglify = require('gulp-uglify'),
 rename = require('gulp-rename'),
 cleanCSS = require('gulp-clean-css'),
 del = require('del'),
 postcss = require('gulp-postcss'),
 autoprefixer = require('autoprefixer'),
 postcssZindex = require('postcss-zindex'),
 inlinesource = require('gulp-inline-source'),
 wait = require('gulp-wait');


gulp.task("concatScripts", function() {
	return gulp.src([	
					"js/jquery.js",
					"js/foundation.js",
					"js/foundation.equalizer.js",
					"js/foundation.reveal.js",
					"js/fastclick.js"
					])
	.pipe(concat("app.js"))
	.pipe(gulp.dest("js"));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
	return gulp.src('js/app.js')
	.pipe(uglify())
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('js'));
});

gulp.task("concatCSS", function() {
	return gulp.src(['css/*.css'])
	.pipe(concat("application.css"))
	.pipe(gulp.dest("css"));
});

gulp.task('processCSS', function() {
	var plugins = [
	autoprefixer({
		browsers: ['last 3 versions']
	}),
	postcssZindex({startIndex: 1})
	];
	return gulp.src('css/*.css')
	.pipe(postcss(plugins))
	.pipe(gulp.dest('./dist'));
});

gulp.task("minifyCSS", ["concatCSS"], function() {
	return gulp.src('css/application.css')
	.pipe(cleanCSS())
	.pipe(rename('application.min.css'))
	.pipe(gulp.dest("css"));
});

gulp.task('inlinesource', function() {
	return gulp.src('*.html')
	.pipe(wait(7000))
	.pipe(inlinesource())
	.pipe(gulp.dest('./dist'))
});


gulp.task('clean', function() {
	del(['dist', 'css/application.css', 'css/application.min.css', 'js/app.js', 'js/app.min.js']);
});

gulp.task('watchFiles',function() {
	gulp.watch(['css/*.css'], ['concatCSS'])
	gulp.watch(['js/*.js'], ['concatScripts']);
});

gulp.task('serve', ['watchFiles']);

gulp.task("build", ['minifyCSS', 'minifyScripts', 'processCSS', 'inlinesource'], function() {
	return gulp.src([
			'index.html',
			'css/application.min.css',
			'js/app.min.js',
			'img/**/*.*',
			'css/**/*.ttf'
		], {base:'./'})
	.pipe(gulp.dest('dist'));
});

gulp.task("default", ["clean"], function() {
	gulp.start('build');
});





