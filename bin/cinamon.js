CinamonPhysics = {
    childs: [],
    gravity: true,
    gravityPower: 98.1,
    currentTime: Date.now(),
    timeSinceLastFrame: 1,
    solid: false,
    add: function(object){
        object.body = new CinamonPhysics.Body(object);
        this.childs.push(object);
    },
    update: function(){
        this.timeSinceLastFrame = Date.now() - this.currentTime;
        this.currentTime = Date.now();

        this.checkCollision();

        for(i in this.childs){
            this.childs[i].x += this.childs[i].body.speed.x * this.timeSinceLastFrame/1000;
            this.childs[i].y += this.childs[i].body.speed.y * this.timeSinceLastFrame/1000;

            if(!this.childs[i].body.solid && this.gravity){
                this.childs[i].body.speed.y += this.gravityPower * this.timeSinceLastFrame/1000;
            }
        }
    },
    checkCollision: function(){
        for(x = 0; x < this.childs.length-1; x++){
            for(y = x+1; y < this.childs.length; y++){
                if(this.collides(this.childs[x], this.childs[y])){
                    console.log("moin");
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
            console.log("yeah");
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
    this.speed = {
        x: 0,
        y: 0,
        set: function(x, y){
            this.x = x;
            this.y = y ? y : x;
        }
    }
}

CinamonPhysics.Body.prototype = Object.create(Object.prototype);
CinamonPhysics.Body.prototype.constructor = CinamonPhysics.Body;