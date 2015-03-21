global.$ = require("jquery");

global._ = require("lodash");
var keys = require("./keys")(document);
global.system = require("./system");
var utils = require("./utils");

utils.loadGlobally(require("./element"));
utils.loadGlobally(require("./func"));
utils.loadGlobally(require("./pipes"));

system.out("Hello Hime!");

// Build Pipes
var now = system.time();
var pump = buildPump(system.time);
var gameOffset = buildOffset(now);
var x = chain(pump, gameOffset);
global.gameTime = split(x);

var frameTime = buildDelta();
var amp = split(buildAmp(0.3));
global.pxPerFrame = chain(frameTime, amp);

gameTime.out(pxPerFrame);

// Start Pump
setInterval(pump, 1000/30);

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

global.buildCompare = buildMerge([0, 0], function(a, b) {
	if(a == b)
		return 0;
	else
		return a < b ? -1 : 1;
});

var buildXY2Point = buildMerge([7, 13], function(x, y) {
	return [x, y];
});

var xCmp = buildCompare();
var yCmp = buildCompare();
var xy2Point = buildXY2Point();

xCmp({ a: wasd.right, b: wasd.left });
yCmp({ a: wasd.down, b: wasd.up });
xy2Point({ x: xCmp, y: yCmp }).out(system.out);

// Init
$(function() {
	var box = $(".box");
	global.boxPos = getPosPoint(box);

	var boxXIncr = buildIncr(boxPos.x);
	var boxYIncr = buildIncr(boxPos.y);

	var moveBox = {
		x: buildIncr(boxPos.x),
		y: buildIncr(boxPos.y)
	};

	wasd.up.out(valve(invert(pxPerFrame), moveBox.y));
	wasd.down.out(valve(pxPerFrame, moveBox.y));
	wasd.left.out(valve(invert(pxPerFrame), moveBox.x));
	wasd.right.out(valve(pxPerFrame, moveBox.x));
});
