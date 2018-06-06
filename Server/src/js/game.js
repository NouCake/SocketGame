Game = function() {
    this.entities = [];
    this.server = Server;

    this.entities.push(new Entity.Block(Math.random(), 100, 600));
    this.entities.push(new Entity.Block(Math.random(), 400, 600));
    this.entities.push(new Entity.Platform(Math.random(), 250, 500));

    this._lastFrame = Date.now();
    Game.startTime = Date.now();
    Game.currentTime = Date.now();
    Game.nextUpdate = Date.now();
    this.updateStack = [];
}

Game.deltaTime = 0;
Game.startTime = -1;
Game.currentTime = -1;
Game.nextUpdate = -1;

Game.prototype = Object.create(Object.prototype);
Game.prototype.constructor = Game;

Game.prototype.update = function(){
    Game.deltaTime = Date.now() - this._lastFrame;
    Game.nextUpdate += Game.deltaTime;

    this._lastFrame = Date.now();

    for(i in this.updateStack){
        curData = this.updateStack[i];
        if(curData.timeStamp > Game.currentTime){
            //packet rechtzeitig
            if(curData.timeStamp <= Game.nextUpdate){
                //packet nicht zu früh
                deltaTime = curData.timeStamp - Game.currentTime;

                this.updateEntitys(deltaTime);
                CinamonPhysics.update(deltaTime);
                Game.currentTime += deltaTime;
                
                player = this.getPlayer(curData.id);
                if(player){
                    player.updateInput(curData.input);
                    if((curData.pos.x - player.x) * (curData.pos.x - player.x) > 25){
                        Server.syncPlayer(player);
                    }
                }

                delete this.updateStack[i];
            }
        } else {
            delete this.updateStack[i];
        }
    }

    pendingUpdates = 0;
    if(this.updateStack) this.updateStack.forEach(element => {
        if(element != null) pendingUpdates++;
    });
    //console.log("pending updates: " + pendingUpdates);

    this.sendEntitys();
}

Game.prototype.updateEntitys = function(deltaTime){
    for(i in this.entities){ 
        this.entities[i].update(deltaTime);
    }
}

Game.prototype.sendEntitys = function(){
    package = this.entities.map(entity => {
        return {id: entity.id, x: entity.x, y: entity.y, key: entity.key, type: entity.type};
    });
    Server.sendPackage('entityData', package);
}

Game.prototype.addNewPlayer = function(id){
    player = new Entity.Player(id, Math.random() * 800, Math.random() * 640);
    //player.body.speed.x = 5;
    this.entities.push(player);
}

Game.prototype.removePlayer = function(id){
    this.entities = this.entities.filter(entity => entity.id != id)
    CinamonPhysics.childs = CinamonPhysics.childs.filter(child => child.id != id);
}

Game.prototype.getPlayer = function(id){
    for(i in this.entities){
        if(this.entities[i].id == id){
            return this.entities[i];
        }
    }
    console.log("no player found " + id);
}

module.exports = Game;