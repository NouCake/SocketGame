const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = __dirname+'/../client';
console.log(clientPath);
const port = 12012;

app.use(express.static(clientPath));

const server = http.createServer(app);
const ioserver = socketio(server);

ioserver.on('connection', socket => {
    console.log('client connected    | ' + socket.id);
    socket.emit('message', "You're connected");
    socket.on('disconnect', () => {
        console.log('client disconnected | ' + socket.id);
    });
});


server.on('error', () => {
    console.log('random error appeared');
});

server.listen(port, () => {
    console.log('Server listens on port '+ port);
});