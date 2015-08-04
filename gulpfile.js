var _ = require("lodash");

var babelify = require("babelify");
var browserSync = require("browser-sync").create();
var browserify = require("browserify");
var exorcist = require("exorcist");
var files2Json = require("gulp-file-contents-to-json");
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jshintStylish = require("jshint-stylish");
var kitsune = require("kitsune");
var source = require("vinyl-source-stream");
var watchify = require("watchify");

// Variables
watchify.args.debug = true;
var bundler = watchify(browserify("src/scripts/index.js", watchify.args));

// Babel transform
bundler.transform(babelify.configure({
	sourceMapRelative: "webapp/scripts"
}));

// Default task
gulp.task("default", ["start", "watch"]);

// Build tasks
var buildScripts = function() {
	return bundler.bundle()
		.pipe(exorcist("webapp/scripts/main.js.map"))
		.pipe(source("main.js"))
		.pipe(gulp.dest("webapp/scripts"))
		.pipe(browserSync.stream({ once: true }));
};
gulp.task("build-scripts", ["lint"], buildScripts);

gulp.task("build-elements", function() {
	var stream =  gulp.src("src/elements/*")
		.pipe(files2Json("elements.json"))
		.pipe(gulp.dest("webapp/data"));

	browserSync.reload();

	return stream;
});

var getTaskList = function(groupName) {
	var tasks = _(gulp.tasks)
		.filter(function(task) {
			return _.startsWith(task.name, groupName+"-");
		})
		.map(function(task) {
			return task.name;
		}).value();
	return tasks;
}

// Watch tasks
gulp.task("watch-elements", ["build-elements"]);

// General tasks
gulp.task("start", ["start-server"], function() {
	gulp.start("start-webapp");
});

gulp.task("start-server", function() {
	gulp.start("server");
});


gulp.task("start-webapp", ["build"], function() {
	gulp.start("browserSync");
});

var buildTasks = getTaskList("build");
gulp.task("build", buildTasks);

gulp.task("browserSync", function(done) {

	// TODO: Move this
	bundler.on("update", buildScripts);

	browserSync.init({
		files: ["webapp/styles/main.css"],
		reloadOnRestart: true,
		open: false,
		server: {
			baseDir: "./webapp"
		}
	}, done);
});

gulp.task("watch", function() {

	var watchTasks = getTaskList("watch");
	_.each(watchTasks, function(taskName) {
		var dirName = taskName.substring(6);
		console.log("Watching \"src/"+dirName+"\" ...");

		var watcher = gulp.watch(globPath);
		watcher.on("change", function() {
			gulp.start(taskName);
		});
		var globPath = "src/"+dirName+"/**/*";
	});
});

gulp.task("server", function() {
	kitsune.start();
});

gulp.task("lint", function() {
	return gulp.src("src/scripts/**/*.js")
		.pipe(jshint({ esnext: true }))
		.pipe(jshint.reporter(jshintStylish));
});
