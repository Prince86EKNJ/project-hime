var _ = require("lodash");

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
var gameTime = pipes.split(time.buildGameTime());

var multiply = pipes.buildMultiply(0.3);
var pxPerFrame = pipes.split(pipes.chain(gameTime, pipes.delta(), multiply));

// Keys
var wasd = input.buildWASD(keyboard, input.UDLR);

var xCmp = pipes.split(pipes.compare(wasd.right, wasd.left));
var yCmp = pipes.split(pipes.compare(wasd.down, wasd.up));
var axis = pipes.group([xCmp, yCmp]);

var xy2Point = pipes.buildXY2Point();
// pipes.chain(axis, xy2Point, system.out);

var speed = pipes.mapGroup([0, 0], pipes.buildMultiply);

axis.out(speed.sub("multiplier"));
pxPerFrame.out(speed());

// Init
var ready = not$.ready();
var loadElements = not$.ajaxGetJson("data/elements.json");

Promise.all([ready, loadElements]).then(function(results) {

	var [, elements] = results;

	// Render box
	var elBuild = element.buildElementBuilder(elements);

	var box = elBuild("box");
	var body = not$.find("body")[0];
	body.appendChild(box);
	var boxMovePoint = element.getMovePoint(box);

	speed.out(boxMovePoint);

	// Start Pump
	setInterval(gameTime, 1000/60);
});

// WebSocket test
var getDomain = function(url) {
	return url.match("\\w+://(.*?)(:\\d+)?/.*")[1];
};

var domain = getDomain(location.href);
var socket = new WebSocket("ws://"+domain+":8081");

socket.onopen = function() {
	console.log("Connected!");
	socket.send(JSON.stringify({ command: "version" }));
};
socket.onmessage = function(e) {
	var data = e.data;
	console.log("Data: "+data);
};
