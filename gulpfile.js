console.log("Loading...");

var babel = require("gulp-babel");
var browserSync = require("browser-sync").create();
var del = require("del");
var exorcist = require("exorcist");
var files2Json = require("gulp-file-contents-to-json");
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jshintStylish = require("jshint-stylish");
var mocha = require("gulp-mocha");
var plumber = require("gulp-plumber");
var source = require("vinyl-source-stream");
var symlink = require("gulp-symlink");

console.log("Loaded!");

// Default task
gulp.task("default", ["start", "watch"]);

// Pre-build
gulp.task("clean", function(done) {
	del("webapp/scripts/**", done);
});

gulp.task("lint", function() {
	return gulp.src(["src/scripts/**/*.js", "test/**/*.js"])
		.pipe(jshint({ esnext: true }))
		.pipe(jshint.reporter(jshintStylish));
});

gulp.task("test", ["lint", "link-libraries"], function() {
	return gulp.src("test/**/*.spec.js")
		.pipe(plumber())
		// .pipe(mocha({ reporter: "dot" }));
		.pipe(mocha({ reporter: "spec" }));
});

// Build
gulp.task("link-libraries", ["clean"], function() {
	return gulp.src([
			"bower_components/lodash/lodash.js",
			"bower_components/vue/dist/vue.js"
		])
		.pipe(symlink([
			"webapp/scripts/lodash.js",
			"webapp/scripts/vue.js"
		]));
});

gulp.task("build-scripts", ["test"], function() {
	return gulp.src("src/scripts/**/*.js")
//		.pipe(exorcist("webapp/scripts/main.js.map"))
		.pipe(babel({
			modules: "amd"
		}))
//		.pipe(source("main.js"))
		.pipe(gulp.dest("webapp/scripts"))
		.pipe(browserSync.stream({ once: true }));
});

gulp.task("build-elements", function() {
	return gulp.src("src/elements/*")
		.pipe(files2Json("elements.json"))
		.pipe(gulp.dest("webapp/data"))
		.pipe(browserSync.stream({ once: true }));
});

// Watch
gulp.task("watch", function() {
	gulp.watch("test/**/*.js", ["test"]);
	gulp.watch("src/scripts/**/*.js", ["build-scripts"]);
	gulp.watch("src/elements/**/*", ["build-elements"]);
});

// General tasks
gulp.task("start", ["browserSync"]);

gulp.task("build", ["build-scripts", "build-elements"]);

gulp.task("browserSync", ["build", "link-libraries"], function(done) {

	browserSync.init({
		files: ["webapp/styles/main.css"],
		reloadOnRestart: true,
		open: false,
		server: {
			baseDir: "./webapp"
		}
	}, done);
});
