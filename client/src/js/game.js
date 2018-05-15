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

gameState = new GameState();

game.state.add('loading', loadingState);
game.state.add('game', gameState);

game.state.start('loading');