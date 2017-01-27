"use strict";

function Player(id, name, color, x, y, width, height, speed, character, hp, listener) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.character = character;
    this.controller = new PlayerController(this, x, y, width, height, speed);
    this.info = new PlayerInfo(this, hp, listener);
    this.renderer = new PlayerRenderer(this);
    this.collider = new PlayerCollider(this);
    this.camera = new PlayerCamera(this);
}


Player.prototype.loadJson = function(json) { 
    for (var key in json) this[key]= json[key]; 
    return this;
};

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
    this.controller.reset();
    this.collider.levelcollisions.length = 0;
}

Player.prototype.collideWith = function(collider, result) {
    this.collider.collideWith(this, collider, result);
    return result;
};

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
    this.renderer.draw(now, ctx, x, y, width, height, scale, quality);
}
