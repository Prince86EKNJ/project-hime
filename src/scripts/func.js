var func = {};

var f = function(func, objs) {
	for(i in objs) {
		func[i] = objs[i];
	}
	return func;
};
func.f = f;

var fo = function(func, objs) {
	var result = f(func, objs);

	result.out = function() {};
	result.pipe = function(input) {
		result.out = input;
	}
	return result;
};
func.fo = fo;

module.exports = func;
