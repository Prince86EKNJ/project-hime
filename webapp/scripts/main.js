console.log("Hello Hime!");

var buildPump = function(input, output) {
	return function() {
		output(input());
	}
}

var pipe = function(input, output) {
	input.out = output;
}

var systemTime = function() {
	return new Date().getTime();
}

var buildRelativeValue = function(origin) {
	return function(value) {
		var result = value - origin;
		arguments.callee.out(result);
	}
}

console.out = function(value) {
	console.log(value);
}

var now = systemTime();
var relativeTime = buildRelativeValue(now);

var pump = buildPump(systemTime, relativeTime);
pipe(relativeTime, console.out);

pump();
