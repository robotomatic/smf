"use strict";

function Player(id, name, color, x, y, width, height, speed, character, hp, listener) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.character = character;
    this.controller = new PlayerController(this, x, y, width, height, speed);
    this.info = new PlayerInfo(this, hp, listener);
    this.renderer = new PlayerRenderer(this);
    this.rendered = false;
    this.collider = new PlayerCollider(this);
    this.collided = false;
    this.camera = new PlayerCamera(this);
    
    
    // todo: remove this
    this.lastppx = 0;
    this.lastpx = 0;
    this.lastx = 0;
}


Player.prototype.loadJson = function(json) { 
    for (var key in json) this[key]= json[key]; 
    return this;
};

Player.prototype.getLocation = function() { 
    return this.controller.getLocation();
}
    
Player.prototype.setCharacter = function(character) { 
    this.character = character; 
}

Player.prototype.respawn = function(x, y) {
    this.controller.respawn(x, y);
    this.info.respawn();
    this.collider.respawn();
}

Player.prototype.reset = function() {
    this.info.reset();
    this.collider.reset();
}

Player.prototype.resetLevelCollisions = function() {
//    this.controller.reset();
    this.collider.levelcollisions.length = 0;
    this.collided = false;
}

Player.prototype.collideWith = function(collider, result, debug) {
    this.collider.collideWith(collider, result, debug);
    if (result.collided()) this.collided = true;
    return result;
};

Player.prototype.updateLevelCollisions = function() {

    this.camera.updateCameraBox(this);
    this.collider.updateCollisionBox(this);
    
    if (this.collided) return;
    
    this.controller.canMoveDown = true;    
    this.controller.canMoveUp = true;    
    this.controller.canMoveLeft = true;    
    this.controller.canMoveRight = true;    

    this.controller.dx = 0;
    this.controller.dy = 0;

    this.controller.falling = true;
}

Player.prototype.update = function(now, delta, physics) {
    
    this.controller.update(now, delta, physics);
    
    var dir = this.controller.getDirection(now);
    var state = this.controller.getState(now, dir);
    if (state == "idle") this.controller.idle(now);
    this.character.update(now, dir, state);
    
    this.camera.updateCameraBox(this);
    this.collider.updateCollisionBox(this);
}

Player.prototype.translate = function(dx, dy) {
//    if (this.character) {
//        this.character.translate(dx, dy, this.controller.lastX - this.controller.x, this.controller.lastY - this.controller.y);    
//    }
}

Player.prototype.draw = function(now, ctx, x, y, width, height, scale, quality) {
    
    
    var ppx = round(this.controller.x - x);

    var mx = this.controller.velX || this.controller.dx || false;
    if (mx) {
//        console.log(this.lastpx + " - " + this.lastx + " == " + this.lastppx);
//        console.log(this.controller.x + " - " + x + " == " + ppx);
//        console.log("-----------------------------------------");
//        var dx = round(((ppx - this.lastppx) * scale) / 2);
//        console.log(dx);
//        x -= dx;
    }
    this.lastppx = ppx;
    this.lastpx = this.controller.x;
    this.lastx = x;
    
    
    
    this.renderer.draw(now, ctx, x, y, width, height, scale, quality);
}



Player.prototype.smooth = function(now, scale) {
    this.controller.smooth(now, scale);
}
