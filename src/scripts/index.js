global.$ = require("jquery");
global._ = require("lodash");

global.P = require("bluebird");

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

// Init
$(function() {
	console.log("First!");
	P.resolve($.get("data/elements.json")).then(function() {
		console.log("Second!");
		// Render box
		var elBuild = element.buildElementBuilder();

		var box = $(".box");
		global.boxMovePoint = element.getMovePoint(box);

		speed.out(boxMovePoint);

		// Start Pump
		setInterval(gameTime, 1000/60);
	});
});

// WebSocket test
var socket = new WebSocket("ws://localhost:8081");

socket.onopen = function() {
	console.log("Connected!");
	socket.send("Hello Server");
};
socket.onmessage = function(e) {
	var data = e.data;
	console.log("Data: "+data);
};
