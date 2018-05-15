Entity.Block = function(id, x, y){
    Entity.call(this, id, x, y, 'block');
    this.width = 150;
    this.height = 100;
    this.type = "ground";

    CinamonPhysics.add(this);
    this.body.solid = true;
}

Entity.Block.prototype = Object.create(Entity.prototype);
Entity.Block.prototype.constructor = Entity.Block;