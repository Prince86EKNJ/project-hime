global.$ = require("jquery");
global._ = require("lodash");

var input = require("katana/input");
var buildKeys = require("katana/keys");
var system = require("katana/system");
var time = require("katana/time");
var utils = require("katana/utils");
var element = require("katana/element");
var pipes = require("katana/pipes");

system.out("Hello Hime!");
var keyboard = buildKeys(document);

// Time outputs
global.gameTime = pipes.split(time.buildGameTime());

var multiply = pipes.buildMultiply(0.3);
global.pxPerFrame = pipes.split(pipes.chain(gameTime, pipes.delta(), multiply));

// Keys
global.wasd = input.buildWASD(keyboard, input.UDLR);

var xCmp = pipes.split(pipes.compare(wasd.right, wasd.left));
var yCmp = pipes.split(pipes.compare(wasd.down, wasd.up));
global.axis = pipes.group([xCmp, yCmp]);

var xy2Point = pipes.buildXY2Point();
pipes.chain(axis, xy2Point, system.out);

global.speed = pipes.mapGroup([0, 0], pipes.buildMultiply);

axis.out(speed.sub("multiplier"));
pxPerFrame.out(speed());

// Render functions
var buildHeader = function(level) {
	var result = "";
	while(level--)
		result += " ";
	return result + ">";
};

var renderNodeTree = function(node, level) {
	level = (level == undefined) ? 0 : level;
	var header = buildHeader(level);
	console.log(header+" "+node.type);

	var out = node.out;
	if(out == undefined) {
		return;
	}

	var outVal = out();
	outVal = (typeof outVal == "object") ? outVal : [outVal];
	_.each(outVal, function(node) {
		renderNodeTree(node, level+1);
	});
};

// Init
$(function() {
	var box = $(".box");
	global.boxMovePoint = element.getMovePoint(box);

	speed.out(boxMovePoint);

	// Start Pump
	setInterval(gameTime, 1000/60);

	renderNodeTree(gameTime);
	renderNodeTree(wasd.left);
});
