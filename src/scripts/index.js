global.$ = require("jquery");

var _ = require("lodash");
var keys = require("./keys")(document);
var system = require("./system");
var utils = require("./utils");

utils.loadGlobally(require("./element"));
utils.loadGlobally(require("./func"));
utils.loadGlobally(require("./pipes"));

system.out("Hello Hime!");

var now = system.time();
var gameTime = buildOffset(now);
var frameTime = buildDelta();

var pump = buildPump(system.time, gameTime);
gameTime.pipe(frameTime);

setInterval(pump, 1000/30);

// Keys
var rightKey = keys.getKey("right");
var leftKey = keys.getKey("left");

	//_.map(["w", "s", "a", "d"], function(keyCode) {
_.map(["up", "down", "left", "right"], function(keyCode) {
	var key = keys.getKey(keyCode);
	key.preventDefault = true;
	key.out = function(isDown) {
		system.out(keyCode+" "+isDown);
	};
});

// Init
$(function() {
	var box = $(".box");
	global.boxPos = getPosPoint(box);

	var pxPerSec = buildAmp(0.1);
	frameTime.pipe(pxPerSec);

	var pxPerSecSplit = buildSplit();
	pxPerSec.pipe(pxPerSecSplit);

	// Right
	var boxXIncr = buildIncr(boxPos.x);
	var rightKeyValve = buildValve();
	pxPerSecSplit.pipe(rightKeyValve);
	rightKey.pipe(rightKeyValve.open);
	rightKeyValve.pipe(boxXIncr);

	// Left
	var negX = buildInvert();
	var boxXDecr = buildIncr(boxPos.x);
	leftKey.pipe(valve(pxPerSecSplit, negX));
	negX.pipe(boxXDecr);
});
