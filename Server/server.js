const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();

const clientPath = __dirname + '/../';
console.log(clientPath);
const port = 12012;

app.use(express.static(clientPath));

const httpServer = http.createServer(app);
const ioserver = socketio(httpServer);


httpServer.on('error', () => {
    console.log('random error apeared');
});

httpServer.listen(port, () => {
    console.log('Server listens on port '+ port);
});


require('../bin/js/entity')
require('../bin/js/cinamon')
require('../bin/js/player')
require('../bin/js/block')
require('../bin/js/platform')
require('./src/js/game')
const server = require('./src/js/server')(ioserver);
const game = new Game(server);
server.setGame(game);

setInterval(game.update.bind(game), 1000/25);