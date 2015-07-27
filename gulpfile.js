var gulp = require("gulp");

gulp.task("default", function() {
	gulp.watch("src/**/*.js", ["js-watch"]);
});

gulp.task("js-watch", function() {
	console.log("Update!!");
});
