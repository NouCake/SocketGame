function Game() {
    this.entities = [];
    this.server = Server;

    this.box = new Entity(Math.random(), 100, 500, 'block');
    this.box.width = 150;
    this.box.height = 100;
    CinamonPhysics.add(this.box);
    this.box.body.solid =
    this.entities.push(this.box);
}

Game.prototype = Object.create(Object.prototype);
Game.prototype.constructor = Game;

Game.prototype.update = function(){
    CinamonPhysics.update();

    package = [];
    this.server. sendPackage('entity', 
        this.entities.map(entity => {
            return {id: entity.id, x: entity.x, y: entity.y, key: entity.key};
        }));
}

Game.prototype.addNewPlayer = function(id){
    player = new Entity(id, Math.random() * 800, Math.random() * 640, 'fox');
    CinamonPhysics.add(player);
    
    player.onCollision = function(other){
        player.body.speed.set(0);
        console.log("hellp");
    }

    this.entities.push(player);
}

Game.prototype.removePlayer = function(id){
    this.entities = this.entities.filter(entity => entity.id != id)
    CinamonPhysics.childs = CinamonPhysics.childs.filter(child => child.id != id);
}

Game.prototype.updatePlayer = function(id, input){
    player = this.getPlayer(id);
    for(i = 0; i < 4; i++){
        player.x += (input & 1) >= 1;
        player.x -= (input & 2) >= 1;
        player.y -= (input & 4) >= 1;
        player.y += (input & 8) >= 1;
    }
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