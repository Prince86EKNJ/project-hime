var system = {};

system.out = function(value) {
	console.log(value);
};

system.time = function() {
	return new Date().getTime();
};

module.exports = system;
