global.$ = require("jquery");

global._ = require("lodash");
var input = require("./input");
var buildKeys = require("./keys");
global.system = require("./system");
var time = require("./time");
var utils = require("./utils");

utils.loadGlobally(require("./element"));
utils.loadGlobally(require("./pipes"));

system.out("Hello Hime!");
var keyboard = buildKeys(document);

// Time outputs
global.gameTime = split(time.buildGameTime());

var multiply = buildMultiply(0.3);
global.pxPerFrame = split(chain(gameTime, delta(), multiply));

// Keys
global.wasd = input.buildWASD(keyboard, input.UDLR);

var xCmp = split(compare(wasd.right, wasd.left));
var yCmp = split(compare(wasd.down, wasd.up));
global.axis = group([xCmp, yCmp]);

var xy2Point = buildXY2Point();
chain(axis, xy2Point, system.out);

global.speed = mapGroup([0, 0], buildMultiply);

// TODO: This mapping is a mess, clean up
axis.out(_.pluck(speed(), "multiplier"));
pxPerFrame.out(speed());

// Init
$(function() {
	var box = $(".box");
	global.boxMovePoint = getMovePoint(box);

	speed.out(boxMovePoint);

	// Start Pump
	setInterval(gameTime, 1000/60);
});
