"use strict";

function Player(id, name, color, x, y, z, width, height, speed, character, hp, listener) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.character = character;
    this.controller = new PlayerController(this, x, y, z, width, height, speed);
    this.info = new PlayerInfo(this, hp, listener);
    this.renderer = new PlayerRenderer(this);
    this.rendered = false;
    this.collider = new PlayerCollider(this);
    this.collided = false;
    this.camera = new PlayerCamera(this);
    
    this.rect = new Rectangle(0, 0, 0, 0);
    
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

Player.prototype.respawn = function(x, y, z) {
    this.controller.respawn(x, y, z);
    this.info.respawn();
    this.collider.respawn();
}

Player.prototype.reset = function() {
    this.info.reset();
    this.collider.reset();
}

Player.prototype.resetCollisions = function() {
    this.controller.reset();
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

Player.prototype.draw = function(now, window, ctx, x, y, width, height, scale, quality, debug) {
    
    
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
    
//    var z = this.controller.z;
//    
//    this.rect.x = x;
//    this.rect.y = y;
//    this.rect.width = width;
//    this.rect.height = height;
//    
//    var wc = window.getCenter();
//    var depth = z * scale;
//    this.rect = projectRectangle3D(this.rect, depth, scale, x, y, wc);
    
    
    this.renderer.draw(now, window, ctx, x, y, width, height, scale, quality, debug);
    
//    this.rect.drawOutline(ctx, "red", 2);
    
    
    updateDevPlayer(this.character.renderer.image);
}



Player.prototype.smooth = function(now, scale) {
    this.controller.smooth(now, scale);
}
