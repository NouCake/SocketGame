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
    sendInput: function(input){
        this.socket.emit('input', input);
    },
    sendValidationPackage: function(data){
        this.socket.emit('validate', data);
    }
}