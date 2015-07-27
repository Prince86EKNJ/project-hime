var _ = require("lodash");
var fs = require("fs");

var gulp = require("gulp");
var browserify = require("gulp-browserify");
var files2Json = require("gulp-file-contents-to-json");

gulp.task("build-scripts", function() {
	return gulp.src("src/scripts/index.js")
		.pipe(browserify())
		.pipe(gulp.dest("webapp/scripts"));
});

gulp.task("build-elements", function() {
	return gulp.src("src/elements/*")
		.pipe(files2Json("elements.json"))
		.pipe(gulp.dest("webapp/data"));
});

// var buildAll = function() {
// 	var tasks = _.filter(gulp.tasks, function(task) {
// 		return _.startsWith(task.name, "build-");
// 	})
// 	_.each(tasks, function(task) {
// 		gulp.start(task.name);
// 	});
// }

gulp.task("default", ["build-scripts", "build-elements"], function() {

//	buildAll();

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
