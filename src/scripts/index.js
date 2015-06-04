global.$ = require("jquery");
global._ = require("lodash");

var input = require("katana/input");
var buildKeys = require("katana/keys");
var system = require("katana/system");
var time = require("katana/time");
var utils = require("katana/utils");
var element = require("katana/element");
var p = require("katana/pipes");

system.out("Hello Hime!");
var keyboard = buildKeys(document);

// Time outputs
global.gameTime = p.split(time.buildGameTime());

var multiply = p.buildMultiply(0.3);
global.pxPerFrame = p.split(p.chain(gameTime, p.delta(), multiply));

// Keys
global.wasd = input.buildWASD(keyboard, input.UDLR);

var xCmp = p.split(p.compare(wasd.right, wasd.left));
var yCmp = p.split(p.compare(wasd.down, wasd.up));
global.axis = p.group([xCmp, yCmp]);

var xy2Point = p.buildXY2Point();
p.chain(axis, xy2Point, system.out);

global.speed = p.mapGroup([0, 0], p.buildMultiply);

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
