var time = {};

var pipes = require("./pipes");

// TODO: Fix this so that the offset is set to "system.time"
// at the first invocation of the pump (use sum instead of plus?)
var buildGameTime = function() {
	var now = system.time();

	var timePump = pipes.pump(system.time);
	var timePlus = pipes.plus(-now);

	var result = pipes.chain(timePump, timePlus)
	return result;
};
time.buildGameTime = buildGameTime;

module.exports = time;
