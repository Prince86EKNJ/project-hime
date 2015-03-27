var time = {};

// TODO: Fix this so that the offset is set to "system.time"
// at the first invocation of the pump (use sum instead of plus?)
var buildGameTime = function() {
	var now = system.time();

	var timePump = pump(system.time);
	var timePlus = plus(-now);

	var result = chain(timePump, timePlus)
	return result;
};
time.buildGameTime = buildGameTime;

module.exports = time;
