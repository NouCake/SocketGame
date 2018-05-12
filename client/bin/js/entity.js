Entity = function(id, x, y, key){
    this.id = id;
    this.x = x;
    this.y = y;
    this.key = key;
}

Entity.prototype = Object.create(Object.prototype);
Entity.prototype.constructor = Entity;