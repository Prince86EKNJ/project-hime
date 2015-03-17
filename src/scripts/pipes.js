var _ = require("lodash");
var func = require("./func");

var pipes = {};

/*
pipes.pipe = function(input, output) {
	input.out(output);
};
*/

pipes.valve = function(input, output) {
	var valve = buildValve();
	input.pipe(valve);
	valve.pipe(output);
	return valve.open;
};

pipes.buildSplit = function() {

	var outputs = [];

	var split = fo(function() {
		var splitArgs = arguments;
		_.each(outputs, function(output) {
			output.apply(this, splitArgs);
		});
	});
	split.outputs = outputs;

	split.pipe = function() {
		_.each(arguments, function(output) {
			outputs.push(output);
		});
	};
	return split;
}

pipes.buildPump = function(input, output) {
	return func.f(function() {
		output(input());
	}, { in: input, out: output });
};

pipes.buildValve = function()
{
	var isOpen = false;

	var valve = fo(function() {
		if(isOpen) {
			valve.out.apply(this, arguments);
		}
	}, {
		open: function(open) {
			isOpen = open;
		},
	});

	return valve;
};

pipes.buildOffset = function(origin) {
	return fo(function(value) {
		var result = value - origin;
		arguments.callee.out(result);
	});
};

pipes.buildInvert = function() {
	return fo(function(value) {
		arguments.callee.out(-value);
	});
}

pipes.buildDelta = function() {

	var lastValue = 0;

	var delta = fo(function(value) {
		var deltaValue = value - lastValue;
		lastValue = value;
		delta.out(deltaValue);
	});

	return delta;
};

pipes.buildAmp = function(magValue) {

	var mag = arguments.length == 0 ? 1 : magValue;

	var amp = fo(function(value) {
		var output = value * mag;
		amp.out(output);
	}, {
		magnitude: function(value) {
			mag = value;
		},
	});

	return amp;
};

pipes.buildIncr = function(point) {
	var inc = function(value) {
		var result = point() + value;
		point(result);
	};
	return inc;
};

module.exports = pipes;
