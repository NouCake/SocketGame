const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();

const clientPath = __dirname + '/../client/';
console.log(clientPath);
const port = 12012;

app.use(express.static(clientPath));

const httpServer = http.createServer(app);
const ioserver = socketio(httpServer);


httpServer.on('error', () => {
    console.log('random error appeared');
});

httpServer.listen(port, () => {
    console.log('Server listens on port '+ port);
});


require('../bin/entity')
require('../bin/cinamon')
const server = require('./src/js/server')(ioserver);
const game = new (require('./src/js/game'))(server);
server.setGame(game);

setInterval(game.update.bind(game), 1000/25);