Client = {
    socket: null,
    id: '',
    connected: false,
    ingame: false,
    connect: function(){
        socket = io();
        id = socket.id;

        socket.on('message', console.log);
        socket.on('connectionSuccess', this.validateConnection.bind(this));
        socket.on('entity', (data) => {
            game.state.states['game'].syncEntities(data);
        });
        
    },
    validateConnection: function(data){
        if(this.connected){
            socket.emit('error', 'Client already connected | ' + id);
        } else {
            game.state.getCurrentState().connected();
            this.connected = true;
        }
    },
    sendReady: function(){
        console.log('sending ready');
        this.ingame = true;
        socket.emit('clientReady', true);
    },
    sendInput: function(input){
        socket.emit('input', input);
    }
}