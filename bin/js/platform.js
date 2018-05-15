Entity.Platform = function(id, x, y){
    Entity.call(this, id, x, y, 'platform');
    this.width = 150;
    this.height = 10;
    this.type = "platform";

    CinamonPhysics.add(this);
    this.body.solid = true;
}

Entity.Platform.prototype = Object.create(Entity.prototype);
Entity.Platform.prototype.constructor = Entity.Platform;