GameState = function(){

}

GameState.prototype = Object.create(Object.prototype);
GameState.prototype.constructor = GameState;

GameState.prototype.preload = function(){
    game.load.spritesheet('fox', 'src/assets/fox.png', 50, 50);
    game.load.image('block', 'src/assets/block.png');
    game.load.image('platform', 'src/assets/platform.png');
}

GameState.prototype.create = function(){
    game.renderer.renderSession.roundPixels = true
    game.camera.roundPx = true;

    this.startTime = -1;
    this.lastUpdate = -1;
    this.deltaTime = 0;
    this.entities = [];
    Client.ingame = true;
    console.log(Client.ingame);
    Client.sendReady();
}

GameState.prototype.update = function(){
    this.sendInput();
    this.deltaTime = Date.now() - this.lastUpdate;
    CinamonPhysics.update(this.deltaTime);
    this.lastUpdate = Date.now();
}

GameState.prototype.welcome = function(data){
    console.log(Date.now() - data.time);
    this.startTime = this.lastUpdate = data.time;
    this.player = new Player(Client.socket.id, data.player.x, data.player.y);
    this.entities[data.player.id] = this.player;
    game.world.add(this.player);
    if(data.player.id != Client.socket.id){
        console.log("ERROR");
    }
}

GameState.prototype.syncEntities = function(newEntities){
    //console.log(newEntities);
    entitiesToRemove = []; //listing all entitys, so that i can delete all entities that dont receive an update
    for(i in this.entities){
        entitiesToRemove[i] = true;
    }

    for(i in newEntities){
        entity = newEntities[i];
        if(this.entities[entity.id]){
            this.updateEntity(entity);
        } else {
            this.createEntity(entity);
        }
        delete entitiesToRemove[entity.id];
    }

    for(i in entitiesToRemove){
        this.entities[i].destroy();
    }
}

GameState.prototype.inputs = [Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN,
    Phaser.Keyboard.SPACEBAR];

GameState.prototype.sendInput = function(){
    input = 0;
    for(i = 0; i < this.inputs.length; i++){
        input += game.input.keyboard.isDown(this.inputs[i]) * Math.pow(2, i)
    }
    Client.sendInput(input);
    if(this.player) this.player.entity.updateInput(input);
}

GameState.prototype.createEntity = function(entity){
    if(entity.type == 'player'){
        player = new Player(entity.id, entity.x, entity.y);
        if(entity.id == Client.socket.id){
            console.log("ERROR");
        } else {
            player.entity.body.enable = false;
        }
        this.entities[entity.id] = player;
        game.world.add(this.entities[entity.id]);
    } else if(entity.type == 'ground'){
        this.entities[entity.id] = new Block(entity.id, entity.x, entity.y);
        game.world.add(this.entities[entity.id]);
    }  else if(entity.type == 'platform'){
        this.entities[entity.id] = new Platform(entity.id, entity.x, entity.y);
        game.world.add(this.entities[entity.id]);
    } else {
        console.log("unknown type " + entity.type);
    }
}

GameState.prototype.updateEntity = function(entity){
    if(entity.id != Client.socket.id){
        this.entities[entity.id].entity.x = entity.x;
        this.entities[entity.id].entity.y = entity.y;
    }
}


/**
 * 
 * 
    inputs: ,
    sendPlayerInput: function(){
    },
    update: function(){
        this.sendPlayerInput();
        for(i in this.entities){
            if(this.entities[i].speedX * this.entities[i].speedX > 0 &&
                this.entities[i].speedX * this.entities[i].speedX < 50){
                this.entities[i].x += this.entities[i].speedX * game.time.elapsedMS/1000 * 0.5;
            }
            if(this.entities[i].speedY * this.entities[i].speedY > 0 && 
                this.entities[i].speedY * this.entities[i].speedY < 50){
                this.entities[i].y += this.entities[i].speedY * game.time.elapsedMS/1000  * 0.5;
            }
        }
    }
 */