import _ from "lodash";

import input from "katana/input";
import buildKeys from "katana/keys";
import { log } from "katana/system";
import { buildGameTime } from "katana/time";
import * as element from "katana/element";
import * as pipes from "katana/pipes";
import * as not$ from "katana/not-jquery";

log("Hello Hime!");
var keyboard = buildKeys(document);

// Time outputs
var gameTime = pipes.split(buildGameTime());

var multiply = pipes.buildMultiply(0.3);
var pxPerFrame = pipes.split(pipes.chain(gameTime, pipes.delta(), multiply));

// Keys
var wasd = input.buildWASD(keyboard, input.UDLR);

var xCmp = pipes.split(pipes.compare(wasd.right, wasd.left));
var yCmp = pipes.split(pipes.compare(wasd.down, wasd.up));
var axis = pipes.group([xCmp, yCmp]);

var xy2Point = pipes.buildXY2Point();
// pipes.chain(axis, xy2Point, log);

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
