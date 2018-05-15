CinamonPhysics = {
    childs: [],
    gravity: true,
    gravityPower: 750,
    solid: false,
    add: function(object){
        object.body = new CinamonPhysics.Body(object);
        this.childs.push(object);
    },
    update: function(time){
        for(i in this.childs){
            this.updatePosition(this.childs[i], time);
        }

        this.checkCollision();
    },
    updatePosition: function(entity, time){
        if(!entity.body.enable)
            return;
        if(!entity.body.solid){
            entity.body.speed.y += this.gravityPower * time/1000;
        }

        entity.x += entity.body.speed.x * time/1000;
        entity.y += entity.body.speed.y * time/1000;
    },
    checkCollision: function(){
        for(x = 0; x < this.childs.length-1; x++){
            for(y = x+1; y < this.childs.length; y++){
                if(this.collides(this.childs[x], this.childs[y])){
                    if(this.childs[x].onCollision)
                        this.childs[x].onCollision(this.childs[y]);
                    if(this.childs[y].onCollision)
                        this.childs[y].onCollision(this.childs[x]);
                }
            }
        }
    },
    collides: function(a, b){
        if(a.x < b.x + b.body.width &&
            a.x + a.body.width > b.x){
            if(a.y < b.y + b.body.height &&
                a.y + a.body.height > b.y)
                return true;
        }
        return a.x > b.x + b.body.width &&
        a.x + a.body.width < b.x &&
        a.y < b.y + b.body.height &&
        a.y + a.body.height > b.y;
    }
}

CinamonPhysics.Body = function(parent){
    this.parent = parent;
    this.width = parent.width ? parent.width : 50;
    this.height = parent.height ? parent.height : 50;
    this.enable = true;
    this.speed = {
        x: 0,
        y: 0,
    }
}

CinamonPhysics.Body.prototype = Object.create(Object.prototype);
CinamonPhysics.Body.prototype.constructor = CinamonPhysics.Body;