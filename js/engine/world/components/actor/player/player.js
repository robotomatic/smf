"use strict";

function Player(id, name, color, x, y, z, width, height, speed, character, hp, listener) {
    this.id = id;
    this.name = name;
    this.uid = name;
    this.color = color;
    this.character = character;
    this.controller = new PlayerController(this, x, y, z, width, height, speed);
    this.info = new PlayerInfo(this, hp, listener);
    this.collider = new PlayerCollider(this);
    this.collided = false;
    this.camera = new PlayerCamera(this);
    this.box = new Rectangle(0, 0, 0, 0);
    this.scalefactor = 0;

    this.getscamera = false;
    
    this.projectedlocation = new Point(0, 0);
    this.gamecanvas = new GameCanvas();
    this.image = new Image(null, 0, 0, 0, 0);
    this.imagepad = 100;

    this.showing = false;
    
    this.debug = {
        player : false,
        character : false,
        guts : false
    };
    this.debugtemp = {
        player : false,
        character : false,
        guts : false
    };
    
    this.playerdebugger = new PlayerDebugger(this);
}


Player.prototype.setCharacter = function(character) { 
    delete(this.character);
    this.character = character;
    this.controller.width = character.width;
    this.controller.height = character.height;
    this.controller.depth = 10;
}


Player.prototype.delete = function() { 
    logDev("Removing Player: " + this.id);
    this.controller = null;
    this.info = null;
    this.collider = null;
    this.camera = null;
    this.box = null;
    this.gamecanvas = null;
    this.image = null;
}



Player.prototype.pause = function(when) { 
    this.controller.pause(when);
    this.character.pause(when);
}

Player.prototype.resume = function(when) { 
    this.controller.resume(when);
    this.character.resume(when);
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





Player.prototype.isVisible = function(w, wmbr, pad = 0) {
    var mbr = this.box;
    var wx = w.x + w.offset.x;
    if (mbr.x > (wx + w.width + pad)) return false;
    if ((mbr.x + mbr.width) < wx - pad) return false;
    var wy = w.y;
    if (mbr.y > (wy + w.height + pad)) return false;
    if ((mbr.y + mbr.height) < wy - pad) return false;
    var wz = w.z + w.offset.z;
    if (mbr.z + mbr.depth < wz - pad) return false;
    return true;
}






Player.prototype.respawn = function(x, y, z) {
    this.controller.respawn(x, y, z);
    this.info.respawn();
    this.collider.respawn();
}

Player.prototype.reset = function() {
    this.info.reset();
    this.collider.reset();
    this.camera.reset();
}

Player.prototype.resetCollisions = function() {
    this.controller.reset();
    this.collider.levelcollisions.length = 0;
    this.collided = false;
    this.controller.canMoveDown = true;    
    this.controller.canMoveUp = true;    
    this.controller.canMoveLeft = true;    
    this.controller.canMoveRight = true;    
    this.controller.falling = true;
    this.controller.grounded = false;
}

Player.prototype.collideWith = function(collider, result, debug) {
    this.collider.collideWith(collider, result, debug);
    if (result.collided()) {
        this.collided = true;
        this.controller.groundfriction = result.friction;
        this.controller.airfriction = result.airfriction;
    }
    return result;
};

Player.prototype.updateLevelCollisions = function() {
    this.collider.updateCollisionBox();
}





















Player.prototype.update = function(now, delta, physics) {
    this.controller.update(now, delta, physics);
    var dir = this.controller.getDirection(now);
    var state = this.controller.getState(now, dir);
    if (state == "idle") this.controller.idle(now);
    this.character.update(now, this, dir, state);
    this.collider.updateCollisionBox(this);
    updateDevPlayer(this);
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
    this.scale = this.box.width / this.controller.width;
    
    this.box.depth *= this.scalefactor;
    
    if (this.controller.grounded) {
        this.controller.gp.x = round(this.box.x + (this.box.width / 2));
        this.controller.gp.y = round(this.box.y + this.box.height);
        this.controller.gp.z = round(this.box.z);
    }
    this.camera.updateCameraBox(window, width, height);
}







Player.prototype.render = function(now, width, height, ctx, scale, debug, paused) {
    this.debugtemp.player = false;
    this.debugtemp.character = false;
    this.debugtemp.guts = false;
    if (debug) {
        this.debugtemp.player = this.debug.player ? true : debug.player;
        this.debugtemp.character = this.debug.character ? true : debug.character;
        this.debugtemp.guts = this.debug.guts ? true : debug.guts;
    }
    debug = debug ? debug : this.debug;
    if (!ctx) this.renderStart(now, width, height, scale);
    this.renderRender(now, ctx, scale, this.debugtemp, paused);
    if (!ctx) this.renderEnd(now);
}

Player.prototype.renderStart = function(now, width, height, scale) {

    var sip = this.imagepad;
    var doublepad = sip * 2;
    
    var bx = this.box.x * scale;
    var by = this.box.y * scale;
    
    this.projectedlocation.x = bx - sip;
    this.projectedlocation.y = by - sip;

    var bw = this.box.width * scale;
    var bh = this.box.height * scale;
    this.gamecanvas.setSize(bw + doublepad, bh + doublepad);
}

Player.prototype.renderRender = function(now, gamecanvas = null, scale, debug, paused) {
    var c = this.gamecanvas;
    var ip = this.imagepad;
    var px = 0;
    var py = 0;
    if (gamecanvas) {
        c = gamecanvas;
        ip = 0;
        px = this.box.x;
        py = this.box.y;
    }
    this.character.draw(now, c, this, px, py, scale, ip, debug, paused);
    if (debug) this.playerdebugger.drawDebug(now, c, debug);
}

Player.prototype.renderEnd = function(when) {
    this.image.x = 0;
    this.image.y = 0;
    this.image.width = this.gamecanvas.width;
    this.image.height = this.gamecanvas.height;
    this.image.data = this.gamecanvas;
    updateDevPlayer(this.image);
}

Player.prototype.drawImage = function(gamecanvas, scale = 1, offset = 0) {
    
    var px = this.projectedlocation.x * scale;
    var py = this.projectedlocation.y * scale;
    
    var cw = this.gamecanvas.width * scale;
    var ch = this.gamecanvas.height * scale;
    
    this.image.draw(gamecanvas, px + offset, py + offset, cw - (offset * 2), ch - (offset * 2));
}