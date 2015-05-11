var _ = require("lodash");
var func = require("./func");

var pipes = {};

var buildValve = function() {
	var isOpen = 0;

	var valve = func.fo(function() {
		if(isOpen) {
			arguments.callee.$out.apply(this, arguments);
		}
	});
	valve.open = function(open) {
			isOpen = open;
	};
	valve.type = "valve";
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

	result.type = "chain";
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

	var split = func.fo(function() {
		var splitArgs = arguments;
		_.each(outputs, function(output) {
			output.apply(this, splitArgs);
		});
	});
	split.out = function(input) {
		if(input == undefined)
			return outputs;
		else {
			if(typeof input != "object")
				input = [input];
			_.each(input, function(output) {
				outputs.push(output);
			});
		}
	};
	split.type = "split";
	return split;
}
pipes.buildSplit = buildSplit;

var split = function(node) {
	var split = buildSplit();
	return chain(node, split);
}
pipes.split = split;

var buildMerge = function(defaults, mergeFunc, asArray) {
	if(asArray == undefined)
		asArray = false;

	var merge = function() {
		var data = _.clone(defaults);
		var inputs = asArray ? [] : {};

		var target = func.fo(function(outMap) {
			if(arguments.length == 0)
				return inputs;
			else {
				autoPipe(outMap, arguments.callee);
				return arguments.callee;
			}
		});

		var push = function() {
			var value = mergeFunc.apply(this, data);
			target.$out(value);
		}
		var args = func.getArgs(mergeFunc);
		_.each(args, function(arg, index) {
			var key = asArray ? index : arg;
			inputs[key] = function(value) {
				data[index] = value;
				push();
			};
			//target[key] = inputs[key];
		});

		return target;
	};
	merge.type = "merge";
	return merge;
};
pipes.buildMerge = buildMerge;

var buildMergeArray = _.bind(buildMerge, this, _, _, true);
pipes.buildMergeArray = buildMergeArray;

var pump = function(input) {
	var result = func.fo(function() {
		var output = input();
		arguments.callee.$out(output);
	});
	result.type = "pump";
	return result;
};
pipes.pump = pump;

var plus = function(plusValue) {
	var result = func.fo(function(value) {
		var output = value + plusValue;
		arguments.callee.$out(output);
	});
	result.type = "plus";
	return result;
};
pipes.plus = plus;

var buildInvert = function() {
	var result = func.fo(function(value) {
		arguments.callee.$out(-value);
	});
	result.type = "invert";
	return result;
};
pipes.buildInvert = buildInvert;

var invert = function(node) {
	var invert = buildInvert();
	return chain(node, invert);
};
pipes.invert = invert;

var delta = function() {
	var lastValue = 0;
	var result = func.fo(function(value) {
		var deltaValue = value - lastValue;
		lastValue = value;
		arguments.callee.$out(deltaValue);
	});
	result.type = "delta";
	return result;
};
pipes.delta = delta;

var buildMultiply = function(magValue) {

	var mag = arguments.length == 0 ? 1 : magValue;

	var multiply = func.fo(function(value) {
		var output = value * mag;
		multiply.$out(output);
	});
	multiply.multiplier = function(value) {
		mag = value;
	};

	multiply.type = "multiply";
	return multiply;
};
pipes.buildMultiply = buildMultiply;

var multiply = function(node) {
	var multiply = buildMultiply();
	chain(node, multiply);
	return multiply.magnitude;
};
pipes.multiply = multiply;

var buildIncr = function(point) {
	var incr = function(value) {
		var result = point() + value;
		point(result);
	};
	incr.type = "incr";
	return incr;
};
pipes.buildIncr = buildIncr;

var autoPipe = function(output, input) {
	var inputNodes = input;
	if(typeof input == "function")
		inputNodes = input();

	_.each(output, function(value, key) {
		var inVal = inputNodes[key];
		if(inVal != undefined)
			value.out(inVal);
	});
	return input;
};
pipes.autoPipe = autoPipe;

var group = function(obj) {
	var result = function(outMap) {
		if(arguments.length == 0)
			return obj;
		else {
			return autoPipe(outMap, obj);
		}
	};
	result.out = function(inMap) {
		if(arguments.length == 0)
			return obj;
		else {
			return autoPipe(obj, inMap);
		}
	};
	result.sub = function(property) {
		return _.pluck(obj, property);
	}
	result.type = "group";
	return result;
};
pipes.group = group;

var buildCompare = buildMergeArray([0, 0], function(a, b) {
	if(a == b)
		return 0;
	else
		return a < b ? -1 : 1;
});
pipes.buildCompare = buildCompare;

var compare = function(a, b) {
	var compare = buildCompare();
	compare([a, b]);
	compare.type = "compare";
	return compare;
};
pipes.compare = compare;

var mapGroup = function(objs, func) {
	var mapFunc = _.isArray(objs) ? _.map : _.mapValues;
	var result = mapFunc(objs, func);
	result = group(result);
	return result;
};
pipes.mapGroup = mapGroup;

///////////
// Extra //
///////////

var buildXY2Point = buildMergeArray([0, 0], function(x, y) {
	return [x, y];
});
pipes.buildXY2Point = buildXY2Point;

// mapAndPipeGroup ???
var all = function(grp, nodeBuilder) {
	var result = _.mapValues(grp.out(), function(value, key) {
		var node = nodeBuilder();
		return chain(value, node);
	});
	result = group(result);
	result.type = "all";
	return result;
};

module.exports = pipes;
