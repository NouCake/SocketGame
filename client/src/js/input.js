
Input = function(game, ui, keyUp, keyDown, keyLeft, keyRight, keyEnter, keySpace){
	this.keys = [game.input.keyboard.addKey(keyLeft),
	game.input.keyboard.addKey(keyRight),
	game.input.keyboard.addKey(keyUp),
	game.input.keyboard.addKey(keyDown),
	game.input.keyboard.addKey(keyEnter),
	game.input.keyboard.addKey(keySpace)];
	
	this.mobile = !game.device.desktop;
	if(this.mobile){
		this._createMobileButtons(ui);
	}
}

Input.prototype.constructor = Input;

Input.prototype.addButton = function(i, func){
	if(this.mobile){
		if(i == 4) this.dpad.dialog.events.onInputDown.add(func);
		if(i == 5) this.dpad.action.events.onInputDown.add(func);
	} else {
		this.keys[i].onDown.add(func);
	}
}

Input.prototype._createMobileButtons = function(ui){

	this.dpad = {};

	this.dpad.up = ui.create(0, 0, "dpad", 0);
	this.dpad.up.frameUp = 0;
	this.dpad.up.frameDown = 1;

	this.dpad.down = ui.create(0, 0, "dpad", 0);
	this.dpad.down.frameUp = 0;
	this.dpad.down.frameDown = 1;

	this.dpad.left = ui.create(0, 0, "dpad", 0);
	this.dpad.left.frameUp = 0;
	this.dpad.left.frameDown = 1;

	this.dpad.right = ui.create(0, 0, "dpad", 0);
	this.dpad.right.frameUp = 0;
	this.dpad.right.frameDown = 1;

	this.dpad.action = ui.create(0, 0, "dpad", 2);
	this.dpad.action.frameUp = 2;
	this.dpad.action.frameDown = 3;

	this.dpad.dialog = ui.create(0, 0, "dpad", 4);
	this.dpad.dialog.frameUp = 4;
	this.dpad.dialog.frameDown = 5;

	this.dpad.up.x = this.dpad.up.height - 8;
	this.dpad.up.y = game.height - this.dpad.up.height*2;

	this.dpad.down.x = this.dpad.down.height - 8;
	this.dpad.down.y = game.height - this.dpad.down.height;
	this.dpad.down.scale.y = -1;
	this.dpad.down.anchor.y = 1;

	this.dpad.left.x = 6;
	this.dpad.left.y = game.height - this.dpad.left.height - 16;
	this.dpad.left.angle = 270;
	this.dpad.left.anchor.x = 1;

	this.dpad.right.x = 10 + this.dpad.right.height;
	this.dpad.right.y = game.height - this.dpad.right.height - 16;
	this.dpad.right.angle = 90;
	this.dpad.right.anchor.x = 0;
	this.dpad.right.anchor.y = 1;

	this.dpad.up.inputEnabled = true;
	this.dpad.down.inputEnabled = true;
	this.dpad.left.inputEnabled = true;
	this.dpad.right.inputEnabled = true;
	this.dpad.action.inputEnabled = true;
	this.dpad.dialog.inputEnabled = true;

	this.dpad.action.x = game.width - this.dpad.action.width - 8;
	this.dpad.action.y = game.height - this.dpad.action.height - 32;

	this.dpad.dialog.x = game.width - this.dpad.action.width - 32;
	this.dpad.dialog.y = game.height - this.dpad.action.height - 16;

	this.dpad.buttonWidth = 16;
	this.dpad.buttonHeight = 28;

}

Input.prototype.update = function(){
	if(!this.mobile){
		this.desktopUpdate();
	} else {
		this.mobileUpdate();
	}
}

Input.prototype.desktopUpdate = function(){
	this.left = this.keys[0].isDown;
	this.right = this.keys[1].isDown;
	this.up = this.keys[2].isDown;
	this.down = this.keys[3].isDown;
	this.space = this.keys[4].isDown;
	this.action = this.keys[5].isDown;
}

Input.prototype.mobileUpdate = function(){
	this.left = this._collidesWith(this.dpad.left);
	this.dpad.left.frame = this.left ? this.dpad.left.frameDown : this.dpad.left.frameUp;

	this.right = this._collidesWith(this.dpad.right);
	this.dpad.right.frame = this.right ? this.dpad.right.frameDown : this.dpad.right.frameUp;

	this.up = this._collidesWith(this.dpad.up);
	this.dpad.up.frame = this.up ? this.dpad.up.frameDown : this.dpad.up.frameUp;

	this.down = this._collidesWith(this.dpad.down);
	this.dpad.down.frame = this.down ? this.dpad.down.frameDown : this.dpad.down.frameUp;

	this.action = this._collidesWith(this.dpad.action);
	this.dpad.action.frame = this.action ? this.dpad.action.frameDown : this.dpad.action.frameUp;

	this.space = this._collidesWith(this.dpad.dialog);
	this.dpad.dialog.frame = this.space ? this.dpad.dialog.frameDown : this.dpad.dialog.frameUp;

}

Input.prototype._collidesWith = function(button){
	if(!game.input.activePointer.isDown) return false;

	if(button == this.dpad.up || button == this.dpad.down){
		if(game.input.x > 8+button.x && game.input.x < 8+button.x + this.dpad.buttonWidth &&
					game.input.y > button.y && game.input.y < button.y + this.dpad.buttonHeight){
			return true;
		}
	}
	if(button == this.dpad.right || button == this.dpad.left){
		if(game.input.x > button.x+4 && game.input.x < button.x+4 + this.dpad.buttonHeight &&
					game.input.y > 8+button.y && game.input.y < 8+button.y + this.dpad.buttonWidth){
			return true;
		}
	}
	if(button == this.dpad.dialog || button == this.dpad.action){
		if(game.input.x > button.x && game.input.x < button.x + 22 &&
					game.input.y > 8+button.y && game.input.y < 8+button.y + 22){
			return true;
		}
	}

	return false;
}


	
