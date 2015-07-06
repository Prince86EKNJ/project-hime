#!/usr/bin/env node

var WebSocketServer = require("ws").Server;

var server = new WebSocketServer({ port: 8081 });

console.log("Start!");
server.on("connection", function(socket) {
	console.log("Connect!");

	socket.on("message", function(data) {
		console.log("Data: "+data);
	});

	socket.send("Hello Client!");
});
