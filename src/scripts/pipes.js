var func = require("./func");

var pipe = function(input, output) {
	input.out = output;
}

var buildPump = function(input, output) {
	return func.f(function() {
		output(input());
	}, { in: input, out: output });
}

module.exports = { pipe: pipe, buildPump: buildPump };
