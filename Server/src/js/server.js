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
    
            socket.emit('message', "You are connected");
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
            Server.sockets[socket.id].ready = true;
            Server.game.addNewPlayer(socket.id);
            Server.sendWelcomePackage(socket);

            socket.on('playerInf', Server.receivePlayerInformation(socket));
            socket.on('getPos', () => console.log(Server.game.getPlayer(socket.id)));
        }
    },
    sendWelcomePackage: function(socket){
        package = {};
        package.time = Game.startTime;
        package.player = this.generatePlayerPacakge(socket.id);
        console.log(package);
        socket.emit('welcome', package);
        console.log("SENDING WELCOME");

        if(Game.startTime == -1){
            console.log("ERROR");
        }
    },
    generatePlayerPacakge: function(id){
        player = Server.game.getPlayer(id);
        return {id: player.id, x: player.x, y: player.y};
    },
    receivePlayerInformation: function(socket){
        return function(data){
            Server.game.updateStack.push(data);
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
    sendMessage: function(id, text){
        this.sockets[id].emit("message", text)
    },
    setGame: function(game){
        this.game = game;
    },
    syncPlayer: function(player){
        if(this.sockets[player.id]){
            this.sockets[player.id].emit("syncPlayer", {x: player.x, y: player.y})
        } else {
            console.log("ERROR");
        }
    }
}

module.exports = Server.create;