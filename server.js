#!/usr/bin/env node
var func = require("katana/func");
var pipes = require("katana/pipes");
var WebSocketServer = require("ws").Server;

var buildWebSocketPipe = function(socket) {
	var dataPipe = func.fo(function(data) {
		socket.send(data);
	});
	socket.on("message", function(data) {
		dataPipe.out()(data);
	});
	return dataPipe;
};

var buildWebSocketServerPipe = function(opts) {
	var socketPipe = pipes.pipe();

	var server = new WebSocketServer(opts);
	server.on("connection", function(socket) {
		var dataPipe = buildWebSocketPipe(socket);
		socketPipe(dataPipe);
	});

	return socketPipe;
};

var systemOut = function(data) {
	console.log("Data: "+data);
};

var handleSocket = function(socket) {
	console.log("Connect!");
	socket.out(systemOut);

	socket("Hello Client!");
};

var server = buildWebSocketServerPipe({ port: 8081 });
server.out(handleSocket);
