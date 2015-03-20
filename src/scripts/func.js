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

module.exports = func;
