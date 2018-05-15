Entity.Player = function(id, x, y){
    Entity.call(this, id, x, y, 'fox');
    CinamonPhysics.add(this);
    this.previousPosition = {x: x, y:y};
    this.input = {right: false, left: false, up: false, down: false, jump: false}
    this.jumpPower = 350;
    this.speed = 250;
    this.width = 50;
    this.height = 50;
    this.type = 'player';
    this.jumpTime = 0.25;
    this.jumpTimer = 0;

    this._lastFrameJumpKey = 0;
    this._isGrounded = false;
    this._canJump = true;
    this._canDash = true;
    this._direction = 1;
}

Entity.Player.prototype = Object.create(Entity.prototype);
Entity.Player.prototype.constructor = Entity.Player;

Entity.Player.prototype.onCollision = function(){

}

Entity.Player.prototype.update = function(time){
    //console.log(this.body.speed.y);
    this.updatePreviousPosition();
    this.betterJumpUpdate(time);
    this.solidGroundUpdate();
    this.movementUpdate(time);
}

Entity.Player.prototype.solidGroundUpdate = function(){
    if(this.y >= 590){
        this.y = 590;
        this.body.speed.y = 0;
        this.setGrounded(true);
    }
}

Entity.Player.prototype.betterJumpUpdate = function(time){
    if(this.body.speed.y > -200){
        this.body.speed.y += 1000 * time/1000;
    }
}

Entity.Player.prototype.updatePreviousPosition = function(){
    this.previousPosition.x = this.x;
    this.previousPosition.y = this.y;
}

Entity.Player.prototype.movementUpdate = function(time){
    if(this.input.right){
        this._direction = 1;
        if(this.body.speed.x < 0){
            this.body.speed.x += this.speed * time/1000;
        }
        this.body.speed.x = this.body.speed.x < this.speed ?
            this.body.speed.x + this.speed * time/1000 : this.body.speed.x - this.speed * time/1000;
    } else if(this.input.left){
        this._direction = -1;
        if(this.body.speed.x > 0){
            this.body.speed.x -= this.speed * time/1000;
        }
        this.body.speed.x = this.body.speed.x > -this.speed ?
            this.body.speed.x - this.speed * time/1000 : this.body.speed.x + this.speed * time/1000;
    } else {
        if(this.body.speed.x < 1 ) {
            this.body.speed.x += this.speed * 2 * time/1000;
            if(this.body.speed.x >= 1){
                this.body.speed.x = 0;
            }
        } else if(this.body.speed.x > 1){
            this.body.speed.x -= this.speed * 2 * time/1000;
            if(this.body.speed.x <= 1){
                this.body.speed.x = 0;
            }
        } else {
            this.body.speed.x = 0;
        }
    }
    if(this.input.jump){
        if(!this._lastFrameJumpKey){
            if(!this._isGrounded){
                this.dash();
            }
        }
        this.jump(time);
    } else if(this._lastFrameJumpKey){
        this.jumpTimer = 0; //makes player cant double jump
    } else {
        this._canJump = true;
        this._canDash = true;
    }

    this._lastFrameJumpKey = this.input.jump;
}

Entity.Player.prototype.updateInput = function(input){
    this.input.right = (input & 1) >= 1; 
    this.input.left = (input & 2) >= 1;
    this.input.up =  (input & 4) >= 1;
    this.input.down = (input & 8) >= 1;
    this.input.jump = (input & 16) >= 1;
}

Entity.Player.prototype.jump = function(time){
    if((this._isGrounded && this._canJump) || this.jumpTimer > 0){
        this.y -= 1;
        this.jumpTimer -= time/1000;
        this.body.speed.y = -this.jumpPower;
        this.setGrounded(false);
        this._canJump = false;
    }
}

Entity.Player.prototype.onCollision = function(other){
    this.groundCollision.call(this, other);
    this.platformCollision.call(this, other);
}

Entity.Player.prototype.setGrounded = function (grounded){
    if(!this._lastFrameJumpKey){
        this._isGrounded = grounded;
    }
    if(grounded && this._canJump){
        this.jumpTimer = this.jumpTime;
    }
}

Entity.Player.prototype.platformCollision = function(other){
    if(other.type == "platform"){
        if(this.body.speed.y > 0){
            overlap = this.y + this.height - other.y;
            if(overlap < 15 + this.body.speed.y / 50){
                this.y -= overlap;
                this.body.speed.y = 0;
                this.setGrounded(true);
            }
        }
    }
}

Entity.Player.prototype.dash = function(){
    if(this._canDash){
        this.body.speed.x = 600 * this._direction;
        this.body.speed.y = this.body.speed.y < 0 ? this.body.speed.y * 0.75 : this.body.speed.y;
        this._canDash = false;
    }
}

Entity.Player.prototype.groundCollision = function(other){
    if(other.type == "ground"){
        tmp = other.x + other.width - this.x;
        minTransX = this.x + this.width - other.x;
        minTransX = minTransX < tmp ? minTransX : -tmp;
        
        tmp = other.y + other.height - this.y;
        minTransY = this.y + this.height - other.y;
        minTransY = minTransY < tmp ? minTransY : -tmp;

        if(minTransY > 0){
            this.setGrounded(true);
        }

        if(minTransY * minTransY > minTransX * minTransX){
            this.x -= minTransX
            this.body.speed.x = 0;
        } else {
            this.y -= minTransY;
            this.body.speed.y = 0;
        }
    }
}