console.log("Hello Hime!");

var utils = require("./utils");

utils.loadGlobally(require("./func"));
utils.loadGlobally(require("./pipes"));

var systemTime = function() {
	return new Date().getTime();
}

var buildRelativeValue = function(origin) {
	return fo(function(value) {
		var result = value - origin;
		arguments.callee.out(result);
	});
}

console.out = function(value) {
	console.log(value);
}

var now = systemTime();
var relativeTime = buildRelativeValue(now);

global.pump = buildPump(systemTime, relativeTime);
pipe(relativeTime, console.out);

pump();
