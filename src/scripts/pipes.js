var _ = require("lodash");
var func = require("./func");

var pipes = {};

var buildValve = function() {
	var isOpen = false;

	var valve = fo(function() {
		if(isOpen) {
			arguments.callee.$out.apply(this, arguments);
		}
	});
	valve.open = function(open) {
			isOpen = open;
	};
	return valve;
};
pipes.buildValve = buildValve;

var valve = function(input, output) {
	var valve = buildValve();
	input.out(valve);
	valve.out(output);
	return valve.open;
};
pipes.valve = valve;

var chain = function() {
	if(arguments.length < 2)
		throw new Error("Must have more than two nodes to wrap");

	var firstNode = _(arguments).shift();
	var result = function() {
		firstNode.apply(this, arguments);
	};

	var prevNode = firstNode;
	_.each(arguments, function(node) {
		prevNode.out(node);
		prevNode = node;
	});
	result.out = prevNode.out;

	return result;
}
pipes.chain = chain;

var buildSplit = function() {

	var outputs = [];
	outputs.remove = function() {
		_.each(arguments, function(node) {
			var index = outputs.indexOf(node);
			if(index == -1)
				throw new Error("Can't remove node, not found");

			outputs.splice(index, 1);
		});
	}

	var split = fo(function() {
		var splitArgs = arguments;
		_.each(outputs, function(output) {
			output.apply(this, splitArgs);
		});
	});
	split.out = function() {
		// Getter
		if(arguments.length == 0)
			return outputs;
		// Setter
		else {
			_.each(arguments, function(output) {
				outputs.push(output);
			});
		}
	};
	return split;
}
pipes.buildSplit = buildSplit;

var split = function(node) {
	var split = buildSplit();
	return chain(node, split);
}
pipes.split = split;

var buildMerge = function(inputs, func) {
	var merge = function() {
		var data = _.clone(inputs);

		var target = fo(function(outMap) {
			if(arguments.length == 0)
				// Filter
				return arguments.callee;
			else {
				autoPipe(outMap, arguments.callee);
				return arguments.callee;
			}
		});

		var push = function() {
			var value = func.apply(this, _.values(data));
			target.$out(value);
		}
		_.each(data, function(value, key) {
			target[key] = function(value) {
				data[key] = value;
				push();
			};
		});

		return target;
	};
	return merge;
};
pipes.buildMerge = buildMerge;

var buildPump = function(input) {
	return fo(function() {
		var output = input();
		arguments.callee.$out(output);
	});
};
pipes.buildPump = buildPump;

var buildOffset = function(origin) {
	return fo(function(value) {
		var output = value - origin;
		arguments.callee.$out(output);
	});
};
pipes.buildOffset = buildOffset;

var buildInvert = function() {
	return fo(function(value) {
		arguments.callee.$out(-value);
	});
};
pipes.buildInvert = buildInvert;

var invert = function(node) {
	var invert = buildInvert();
	return chain(node, invert);
};
pipes.invert = invert;

var buildDelta = function() {
	var lastValue = 0;
	var delta = fo(function(value) {
		var deltaValue = value - lastValue;
		lastValue = value;
		arguments.callee.$out(deltaValue);
	});
	return delta;
};
pipes.buildDelta = buildDelta;

var buildAmp = function(magValue) {

	var mag = arguments.length == 0 ? 1 : magValue;

	var amp = fo(function(value) {
		var output = value * mag;
		amp.$out(output);
	}, {
		magnitude: function(value) {
			mag = value;
		},
	});

	return amp;
};
pipes.buildAmp = buildAmp;

var buildIncr = function(point) {
	var inc = function(value) {
		var result = point() + value;
		point(result);
	};
	return inc;
};
pipes.buildIncr = buildIncr;

var autoPipe = function(output, input) {
	_.each(output, function(value, key) {
		var inVal = input[key];
		if(inVal != undefined)
			value.out(inVal);
	});
}
pipes.autoPipe = autoPipe;

var group = function(obj) {
	var result = function(outMap) {
		if(arguments.length == 0)
			return obj;
		else {
			autoPipe(outMap, obj);
		}
	};
	result.out = function(inMap) {
		if(arguments.length == 0)
			return obj;
		else {
			autoPipe(obj, inMap);
		}
	};
	return result;
};
pipes.group = group;

module.exports = pipes;
