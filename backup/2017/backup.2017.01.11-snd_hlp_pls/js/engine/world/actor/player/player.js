"use strict";

function Player(id, name, color, x, y, z, width, height, speed, character, hp, listener) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.character = character;
    this.controller = new PlayerController(this, x, y, z, width, height, speed);
    this.info = new PlayerInfo(this, hp, listener);
    this.collider = new PlayerCollider(this);
    this.collided = false;
    this.camera = new PlayerCamera(this);
    this.box = new Rectangle(0, 0, 0, 0);
    this.scalefactor = 0;

    this.projectedlocation = new Point(0, 0);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d")
    this.image = new Image(null, 0, 0, 0, 0);
    this.imagepad = 20;
    
    this.playerdebugger = new PlayerDebugger(this.player);
}


Player.prototype.loadJson = function(json) { 
    for (var key in json) this[key]= json[key]; 
    return this;
};

Player.prototype.getMbr = function() { 
    return this.camera.camerabox;
}

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
    if (result.collided()) {
        this.collided = true;
    }
    return result;
};

Player.prototype.updateLevelCollisions = function() {
    this.collider.updateCollisionBox(this);
    if (this.collided) return;
    this.controller.canMoveDown = true;    
    this.controller.canMoveUp = true;    
    this.controller.canMoveLeft = true;    
    this.controller.canMoveRight = true;    
    this.controller.falling = true;
    this.controller.grounded = false;
}





















Player.prototype.update = function(now, delta, physics) {
    this.controller.update(now, delta, physics);
    var dir = this.controller.getDirection(now);
    var state = this.controller.getState(now, dir);
    if (state == "idle") this.controller.idle(now);
    this.character.update(now, dir, state);
    this.collider.updateCollisionBox(this);
}










Player.prototype.smooth = function(now, scale) {
    this.controller.smooth(now, scale);
}

Player.prototype.translate = function(window, width, height) {
    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale;
    this.box.x = round((this.controller.lastX - x) * scale);
    this.box.y = round((this.controller.lastY - y) * scale);
    this.box.z = round((this.controller.lastZ - z) * scale);
    this.box.width = round(this.controller.width * scale);
    this.box.height = round(this.controller.height * scale);
    this.box.depth = round(this.controller.depth * scale);
    var bw = this.box.width;
    var wc = window.getCenter();
    this.box = projectRectangle3D(this.box, this.box.z, scale, x, y, wc);
    this.scalefactor = bw / this.box.width;
    if (this.controller.grounded) {
        this.controller.gp.x = round(this.box.x + (this.box.width / 2));
        this.controller.gp.y = round(this.box.y + this.box.height);
        this.controller.gp.z = round(this.box.z);
    }
    this.camera.updateCameraBox(window, width, height);
}






Player.prototype.render = function(now, quality, width, height) {
    this.renderStart(now, width, height);
    this.renderRender(now, quality);
    this.renderEnd(now);
}

Player.prototype.renderStart = function(now, width, height) {
    clearRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);
    this.projectedlocation.x = this.box.x - this.imagepad;
    this.projectedlocation.y = this.box.y - this.imagepad;
    var doublepad = this.imagepad * 2;
    this.canvas.width = this.box.width + doublepad;
    this.canvas.height = this.box.height + doublepad;
}

Player.prototype.renderRender = function(now, quality) {
    this.character.draw(now, this.ctx, this, this.imagepad);
    this.playerdebugger.drawDebug(now, this.ctx);
}

Player.prototype.renderEnd = function(when) {
    this.image.x = 0;
    this.image.y = 0;
    this.image.width = this.canvas.width;
    this.image.height = this.canvas.height;
    this.image.data = this.canvas;
    updateDevPlayer(this.image);
}

Player.prototype.drawImage = function(ctx) {
    this.image.draw(ctx, this.projectedlocation.x, this.projectedlocation.y, this.canvas.width, this.canvas.height);
}