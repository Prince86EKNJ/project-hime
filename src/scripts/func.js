var _ = require("lodash");

var func = {};

var noop = function() {};
func.noop = noop;

var fo = function(func) {
	_.merge(func, {
		$out: noop,
		out: function(input) {
			if(arguments.length != 0) {
				func.$out = input;
				return input;
			} else
				return func.$out;
		}
	});
	return func;
};
func.fo = fo;

var getArgs = function(func) {
	var funcStr = func.toString();
	var openParenIdx = funcStr.indexOf("(");
	var closeParanIdx = funcStr.indexOf(")");
	var argStr = funcStr.substring(openParenIdx+1, closeParanIdx);
	return _.remove(argStr.split(/[\s,]+/));
};
func.getArgs = getArgs;

module.exports = func;
