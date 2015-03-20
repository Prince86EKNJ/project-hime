var system = {};

system.out = function(value) {
	console.log(value);
};

system.labeledOut = function(label) {
	return function(value) {
		console.log(label+": "+value);
	};
}

system.time = function() {
	return new Date().getTime();
};

module.exports = system;
