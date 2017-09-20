'use strict';

var gulp 	= require('gulp'),
	concat 	= require('gulp-concat'),
	uglify	= require('gulp-uglify'),
	uglifycss = require('gulp-uglifycss'),
	rename	= require('gulp-rename'),
	del 	= require('del'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnext = require('postcss-cssnext'),
	shortcase = require('postcss-short'),
	spritesmith = require('gulp.spritesmith');


//IMG

gulp.task('sprite', function() {
	var spriteData = gulp.src('img/avatars/*.jpg')
	.pipe(spritesmith({
		imgName: 'thumbs.png',
		cssName: 'thumbs.css'
	}));
	return spriteData.pipe(gulp.dest('./img/sprite/'));
});


//JS
gulp.task("concatScripts", function() {
	return gulp.src([
			"js/jquery.js",
			"js/fastclick.js",
			"js/foundation.js",
			"js/foundation.equalizer.js",
			"js/foundation.reveal.js"
			])

	.pipe(concat("app.js"))
	.pipe(gulp.dest("js"));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
	return gulp.src("js/app.js")
	.pipe(uglify())
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest("js"));
});

//CSS
gulp.task("processCSS", function() {
	var plugins = [
		shortcase,
		cssnext,
		autoprefixer ({
			browsers:['last 3 versions'], cascade: false})
	];
	return gulp.src('css/*')
	.pipe(postcss(plugins))
	.pipe(gulp.dest('css'))
});

gulp.task("concatCSS", function() {
	return gulp.src([
			"css/basics.css",
			"css/footer.css",
			"css/foundation.min.css",
			"css/hero.css",
			"css/menu.css",
			"css/modals.css",
			"css/normalize.css",
			"css/photo-grid.css",
			"css/avatars.css"
		])

	.pipe(concat("application.css"))
	.pipe(gulp.dest("css"));
});

gulp.task("minifyCSS", ["concatCSS"], function() {
	return gulp.src("css/application.css")
	.pipe(uglifycss())
	.pipe(rename('application.min.css'))
	.pipe(gulp.dest("css"));
});

gulp.task("clean", function() {
	del(['dist', 'js/app.js', 'css/application.css', 'js/app.min.js', 'css/application.min.css'])
});

gulp.task("build", ["minifyScripts", "minifyCSS"], function() {
	return gulp.src([
			"css/application.min.css",
			"js/app.min.js",
			"index.html",
			"img/**/*",
		], {base: './'})
	.pipe(gulp.dest('dist'));
});

gulp.task("default", ['clean'], function() {
	gulp.start('build');
});