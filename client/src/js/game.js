const game = new Phaser.Game(800, 640, Phaser.AUTO, 'game', null, false, true);

loadingState = {
    preload: function(){
        game.load.spritesheet('fox', 'src/assets/fox.png', 50, 50);
    },
    create: function(){
        game.stage.backgroundColor = 0xf2c65e

        fox = game.add.sprite(550, 280, 'fox');
        fox.animations.add('idle', [0, 1, 2, 3, 4, 5, 6]);
        fox.play('idle', 12, true);

        this.text = game.add.text(400, 320, "NO TEXT", {font: 'Aine', fontSize: '32px', fill: 'WHITE'})
        
        this._displayText("CONNECTING");
        Client.connect();
    },
    connected: function(){
        this._displayText("CONNECTED");
        game.state.start('game');
    },
    _displayText: function(text){
        this.text.text = text;
        this.text.x = 400 - this.text.width * .5;
        this.text.y = 320 - this.text.height * .5;
    }
}

gameState = {
    preload: function(){
        game.load.spritesheet('fox', 'src/assets/fox.png', 50, 50);
        game.load.image('block', 'src/assets/block.png');
    },
    create: function(){
        game.renderer.renderSession.roundPixels = true
        game.camera.roundPx = true;

        this.entities = [];
        Client.sendReady();
    },
    syncEntities: function(newEntities){
        entitiesToRemove = []; //listing all entitys, so that i can delete all entities that dont receive an update
        for(i in this.entities){
            entitiesToRemove[i] = true;
        }
        for(i in newEntities){
            entity = newEntities[i];
            if(this.entities[entity.id]){
                this.entities[entity.id].x = entity.x;
                this.entities[entity.id].y = entity.y;
            } else {
                console.log("create");
                console.log(entity.key);
                this.entities[entity.id] = new Phaser.Sprite(game, entity.x, entity.y, entity.key);
                game.world.add(this.entities[entity.id]);
            }
            delete entitiesToRemove[entity.id];
        }

        for(i in entitiesToRemove){
            this.entities[i].destroy();
            console.log("destoyed");
        }
    },
    inputs: [Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN],
    sendPlayerInput: function(){
        input = 0;
        for(i = 0; i < this.inputs.length; i++){
            input += game.input.keyboard.isDown(this.inputs[i]) * Math.pow(2, i)
        }
        Client.sendInput(input);
    },
    update: function(){
        this.sendPlayerInput();
    }
}

game.state.add('loading', loadingState);
game.state.add('game', gameState);

game.state.start('loading');