var _ = require("lodash");

var fs = require("fs");
var gulp = require("gulp");

gulp.task("build-scripts", function() {
	console.log("Build scripts!!");
});

gulp.task("build-elements", function() {
	console.log("Build elements!");
});

gulp.task("default", function() {

	// Watch and build "src/*" directories
	var sourceDirNames = fs.readdirSync("src");
	_.each(sourceDirNames, function(dirName) {
		var globPath = "src/"+dirName+"/**/*";
		var taskName = "build-"+dirName;

		// Create blank task
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
