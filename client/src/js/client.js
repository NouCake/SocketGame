Client = {
    socket: null,
    connected: false,
    ingame: false,
    connect: function(){
        this.socket = io();
        console.log("my id is " + this.socket);

        this.socket.on('message', console.log);
        this.socket.on('connectionSuccess', this.validateConnection.bind(this));
        this.socket.on('entityData', this.receiveEntityData);
        this.socket.on('welcome', this.receiveWelcome);
        this.socket.on('syncPlayer', this.syncPlayer)
        
    },
    receiveEntityData: function(data){
        if(!Client.ingame){
            console.log("ERROR");
        }
        game.state.states['game'].syncEntities(data);
    },
    receiveWelcome: function(data){
        game.state.states['game'].welcome(data);
    },
    validateConnection: function(data){
        if(this.connected){
            this.socket.emit('error', 'Client already connected | ' + this.socket.id);
        } else {
            game.state.getCurrentState().connected();
            this.connected = true;
        }
    },
    sendReady: function(){
        console.log('sending ready');
        this.ingame = true;
        this.socket.emit('clientReady', true);
    },
    sendPlayerInformation: function(player, input, time){
        data = {};
        data.id = this.socket.id;
        data.pos = {x: player.x, y: player.y}
        data.input = input;
        data.timeStamp = time;
        if(time == undefined){
            console.log("ERROR");
        }
        this.socket.emit('playerInf', data);
    },
    sendValidationPackage: function(data){
        this.socket.emit('validate', data);
    },
    syncPlayer: function(player){
        if(Client.ingame){
            game.state.getCurrentState().syncPlayer(player);
        } else {
            console.log("ERROR");
        }
    }
}