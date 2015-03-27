global.$ = require("jquery");

global._ = require("lodash");
var buildKeys = require("./keys");
global.system = require("./system");
var utils = require("./utils");

utils.loadGlobally(require("./element"));
utils.loadGlobally(require("./func"));
utils.loadGlobally(require("./pipes"));

system.out("Hello Hime!");
var keys = buildKeys(document);

// Build Pipes
var now = system.time();
var pump = buildPump(system.time);
var gameOffset = buildOffset(now);
global.gameTime = split(chain(pump, gameOffset));

var frameTime = buildDelta();
var multiply = buildMultiply(0.3);
global.pxPerFrame = split(chain(frameTime, multiply));

gameTime.out(pxPerFrame);

// Start Pump
setInterval(pump, 1000/60);

// Keys
global.wasd = _.mapValues({
		up: "up",
		down: "down",
		left: "left",
		right: "right"
	}, function(value) {
		var key = keys.getKey(value);
		key.preventDefault = true;
		return split(key);
	}
);

var buildXY2Point = buildMergeArray([0, 0], function(x, y) {
	return [x, y];
});

// TODO: Move this to "chain"?
// Map and Group
var all = function(grp, nodeBuilder) {
	var result = _.mapValues(grp.out(), function(value, key) {
		var node = nodeBuilder();
		return chain(value, node);
	});
	result = group(result);
	return result;
};

var xCmp = compare(wasd.right, wasd.left);
var yCmp = compare(wasd.down, wasd.up);
global.axis = group([xCmp, yCmp]);

global.speed = group(_.map([0, 0], buildMultiply));

// TODO: These two mappings are a mess, clean up
axis.out([speed()[0].multiplier, speed()[1].multiplier]);
pxPerFrame.out(speed());

global.xy2Point = buildXY2Point();

// Init
$(function() {
	var box = $(".box");
	global.boxPos = getPosPoint(box);

	global.moveBox = group(_.map(boxPos, function(value) {
		return buildIncr(value);
	}));

	speed.out(moveBox);
});
