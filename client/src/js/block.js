Block = function(id, x, y){
    Phaser.Sprite.call(this, game, x, y, 'block');
    this.entity = new Entity.Block(id, x, y);   
}

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

Block.prototype.update = function(){

}