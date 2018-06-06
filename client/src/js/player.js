Player = function(id, x, y){
    Phaser.Sprite.call(this, game, x, y, 'fox');
    this.entity = new Entity.Player(id, x, y);   
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
    this.x = this.entity.x;
    this.y = this.entity.y;
}

Player.prototype.updateEntity = function(deltaTime){
    this.entity.update(deltaTime);
}