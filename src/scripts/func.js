var exports = {};

var f = function(func, objs) {
	for(i in objs) {
		func[i] = objs[i];
	}
	return func;
}

var fo = function(func) {
	return f(func, { out: function() {} });
}

module.exports = { f: f, fo: fo };
