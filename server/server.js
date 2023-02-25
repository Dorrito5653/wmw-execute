"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({ port: 5555 });
wss.on('connection', function (ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        console.log('recieved: %s', data);
    });
});
