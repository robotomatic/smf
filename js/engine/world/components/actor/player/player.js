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

    this.isNPC = true;
    
    this.getscamera = false;
    this.hidef = false;
    this.hidefsize = 5;
    
    this.projectedlocation = new Point(0, 0);   
    this.gamecanvas = new GameCanvas();
    
    this.image = new Image(null, 0, 0, 0, 0);

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





Player.prototype.isVisible = function(w, pad = 0) {
    
    
    var mbr = this.box;
    
    var wx = w.x;
    if (mbr.x > (wx + w.width + pad)) return false;
    if ((mbr.x + mbr.width) < wx - pad) return false;
    
    var wy = w.y;
    if (mbr.y > (wy + w.height + pad)) return false;
    if ((mbr.y + mbr.height) < wy - pad) return false;
    
    var wz = w.z;
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
    this.collider.reset();
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
        this.collider.collideWith(collider, result, debug);
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
    this.smooth();
    var dir = this.controller.getDirection(now);
    var state = this.controller.getState(now, dir);
    if (state == "idle") this.controller.idle(now);
    this.character.update(now, this, dir, state);
    this.collider.updateCollisionBox(this);
    this.camera.updateCameraBox();
    updateDevPlayer(this);
}










Player.prototype.smooth = function(now, scale) {
    this.controller.smooth(now, scale);
}











Player.prototype.translate = function(window) {
    
    var x = window.x;
    var y = window.y;
    var z = window.z;
    
    var width = window.width;
    var height = window.height;
    
    var scale = window.scale;
    
    this.box.x = (this.controller.x - x) * scale;
    this.box.y = (this.controller.y - y) * scale;
    this.box.z = (this.controller.z - z) * scale;
    
    this.box.width = this.controller.width * scale;
    this.box.height = this.controller.height * scale;
    this.box.depth = this.controller.depth * scale;
    
    var bw = this.box.width;
    var wc = window.getCenter();
    
    this.box = projectRectangle3D(this.box, this.box.z, scale, x, y, wc);
    
    this.scalefactor = bw / this.box.width;
    this.scale = this.box.width / this.controller.width;
    
    this.box.depth *= this.scalefactor;
    this.box.scale = this.scale;
    
    this.controller.gp.x = round(this.box.x + (this.box.width / 2));
    this.controller.gp.z = round(this.box.z);

    var gpy = (this.controller.groundpoint.y - y) * scale;
    var d = (wc.y - y) * scale;
    var npy = projectPoint3DCoord(gpy, this.box.z, d);
    this.controller.gp.y = npy;
    
    this.character.translate(this.box);
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
    
    var scale = this.scale;
    if (scale > 3)  scale = 3;
    if (this.hidef) scale = this.hidefsize;
    
    this.renderStart(now, scale);
    this.renderRender(now, scale, this.debugtemp, paused);
    this.renderEnd(now);
    this.drawImage(ctx);
    if (debug) this.playerdebugger.drawDebug(now, ctx, debug);
}

Player.prototype.renderStart = function(now, scale) {
    var sip = this.character.pad * scale;
    var doublepad = sip * 2;
    var bw = this.controller.width * scale;
    var bh = this.controller.height * scale;
    this.gamecanvas.setSize(bw + doublepad, bh + doublepad);
}

Player.prototype.renderRender = function(now, scale, debug, paused) {
    var c = this.gamecanvas;
    var ip = this.character.pad;
    var px = 0;
    var py = 0;
    this.character.draw(now, c, this, px, py, ip, scale, debug, paused);
}

Player.prototype.renderEnd = function(when) {
    this.image.x = 0;
    this.image.y = 0;
    this.image.width = this.gamecanvas.width;
    this.image.height = this.gamecanvas.height;
    this.image.data = this.gamecanvas;
    updateDevPlayerImage(this);
}

Player.prototype.drawImage = function(gamecanvas) {
    var px = this.box.x;
    var py = this.box.y;
    var is = this.character.pad * this.box.scale;
    var ts = is * 2;
    var cw = this.box.width;
    var ch = this.box.height;
    this.image.draw(gamecanvas, px - is, py - is, cw + ts, ch + ts);
}