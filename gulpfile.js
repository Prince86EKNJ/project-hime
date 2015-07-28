var _ = require("lodash");
var fs = require("fs");

var browserSync = require("browser-sync").create();

var gulp = require("gulp");
var browserify = require("gulp-browserify");
var rename = require("gulp-rename");
var files2Json = require("gulp-file-contents-to-json");

// Default task
gulp.task("default", ["start", "watch"]);

// Build tasks
gulp.task("build-scripts", function() {
	var stream = gulp.src("src/scripts/index.js")
		.pipe(browserify())
		.pipe(rename("main.js"))
		.pipe(gulp.dest("webapp/scripts"));

	browserSync.reload();

	return stream;
});

gulp.task("build-elements", function() {
	var stream =  gulp.src("src/elements/*")
		.pipe(files2Json("elements.json"))
		.pipe(gulp.dest("webapp/data"));

	browserSync.reload();

	return stream;
});

var buildTasks = _(gulp.tasks)
	.filter(function(task) {
		return _.startsWith(task.name, "build-");
	})
	.map(function(task) {
		return task.name;
	}).value();

// General tasks
gulp.task("start", buildTasks, function() {
	browserSync.init({
		server: {
			baseDir: "./webapp"
		}
	});
});

gulp.task("watch", function() {

	// Watch and build "src/*" directories
	var sourceDirNames = fs.readdirSync("src");
	_.each(sourceDirNames, function(dirName) {
		var globPath = "src/"+dirName+"/**/*";
		var taskName = "build-"+dirName;

		console.log("Watching \"src/"+dirName+"\" ...");
		var watcher = gulp.watch(globPath);
		watcher.on("change", function() {
			if(_.has(gulp.tasks, taskName)) {
				gulp.start(taskName);
			} else {
				console.log("Task \""+taskName+"\" has not been defined");
			}
		});
	});
});
