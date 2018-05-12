Server = {
    name: 'best server euw',
    sockets: [],
    ioserver: null,
    create: function(ioserver){
        this.ioserver = ioserver;

        ioserver.on('connection', socket => {
            Server.sockets[socket.id] = socket;
            console.log('client connected    | ' + socket.id);
    
            socket.on('error', console.log);
            socket.on('disconnect', Server.clientDisconnected(socket));
            socket.on('clientReady', Server.clientReady(socket));
    
            socket.emit('message', "You're connected");
            socket.emit('connectionSuccess', true);
        });

        return Server;
    },
    clientDisconnected: function(socket){
        return function(){
            console.log('client disconnected | ' + socket.id);
            Server.game.removePlayer(socket.id);
            delete Server.sockets[socket.id];
        }
    },
    clientReady: function(socket){
        return function(){
            console.log('client is ready');
            Server.sockets[socket.id].ready = true;
            Server.game.addNewPlayer(socket.id);

            socket.on('input', Server.updatePlayer(socket));
        }
    },
    updatePlayer: function(socket){
        return function(data){
            Server.game.updatePlayer(socket.id, data);
        }
    },
    sendPackage: function(key, data){
        for(i in this.sockets){
            socket = this.sockets[i];
            if(socket.ready){
                socket.emit(key, data);
            }
        }
    },
    setGame: function(game){
        this.game = game;
    }
}

module.exports = Server.create;