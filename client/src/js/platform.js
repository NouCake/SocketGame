Platform = function(id, x, y){
    Phaser.Sprite.call(this, game, x, y, 'platform');
    this.entity = new Entity.Platform(id, x, y);   
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Block;

Platform.prototype.update = function(){

}