const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    scene: {
        preload: preload,
        create: create
    }
}

function preload(){
    this.load.image('fox','src/assets/fox.png');
    this.load.spritesheet('foxy', 'src/assets/fox.png', 50, 50);
}

function create(){
    game.data = {};
    game.data.fox = this.add.image(100, 50, 'fox');
}

const game = new Phaser.Game(config);