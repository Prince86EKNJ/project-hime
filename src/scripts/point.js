var point = {};

var buildPoint = function(val) {
	var value = val;
	var result = function(val) {
		if(arguments.length != 0)
			value = val;
		return value;
	};
	return result;
};
point.buildPoint = buildPoint;

var buildGroup = function(val) {
	var value = val;
	var result = function(key, val) {
		var argLen = arguments.length;
		if(argLen == 0)
			return value;
		if(argLen == 2)
			value[key] = val;
		return value[key];

	};
	return result;
};
point.buildGroup = buildGroup;

module.exports = point;

/*
val() 		- get
val.get()
val(x) 		- set
val.set()

group() 	- get all
group.get()
group(key) 	- get
group.child(key)
group(key, x)	- set

func() 		- set/get input
func.in()
func.in.get()
func.out() 	- set/get output
func.out.get()

keyboard.out().a(nextFunc)
keyboard.out("a". nextFunc)
*/
