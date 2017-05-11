"use strict";

function PlayerDebugger(player) {
    this.player = player;
    this.rect = new Rectangle(0, 0, 0, 0);
}

PlayerDebugger.prototype.drawDebug = function(now, gamecanvas, debug) {
    
    if (!debug.player) return;

    var x = this.player.projectedlocation.x;
    var y = this.player.projectedlocation.y;
    
    gamecanvas.beginPath();
    this.player.box.drawOutline(gamecanvas, "blue", 2);
    gamecanvas.commit();
    

    var gp = this.player.controller.gp;
    gamecanvas.beginPath();
    gamecanvas.setFillStyle("red");
    gp.draw(gamecanvas, 5);
    gamecanvas.commit();


    var scale = this.player.box.scale;
    var cb = this.player.camera.camerabox;

    var cbw = cb.width * scale;
    var cbh = cb.height * scale;

    var cbx = gp.x - (cbw / 2);
    var cby = max(y + this.player.box.height, gp.y) - cbh;

    this.rect.x = cbx;
    this.rect.y = cby;
    this.rect.width = cbw;
    this.rect.height = cbh;

    gamecanvas.beginPath();
    this.rect.drawOutline(gamecanvas, "yellow", 2);
    gamecanvas.commit();

    
    
    
    
    
//    this.drawDebugText(gamecanvas, x, y, 1);
}



PlayerDebugger.prototype.drawDebugText = function(gamecanvas, x, y, scale) {

    var pad = 5 * scale;
    var message = "x: " + this.player.controller.x + "\ny: " + this.player.controller.y + "\nz: " + this.player.controller.z;
    message += "\nvx: " + this.player.controller.velX + "\nvy: " + this.player.controller.velY + "\nvz: " + this.player.controller.velZ;
    
    message += "\n\ngpx: " + this.player.controller.groundpoint.x + "\ngpy: " + this.player.controller.groundpoint.y + "\ngpz: " + this.player.controller.groundpoint.z;
    
    gamecanvas.setFillStyle("black");
    
    var tx = round(this.player.box.x + this.player.box.width + pad);
    var ty = round(this.player.box.y - (pad * 4));
    
    var t = geometryfactory.getText(tx, ty, message);
    gamecanvas.beginPath();
    t.draw(gamecanvas);
}








PlayerDebugger.prototype.drawDebugRect = function(window, gamecanvas, x, y, scale, rect, color) {
    var r = geometryfactory.getRectangle(x, y, rect.width * scale, rect.height * scale);
    
    
    gamecanvas.beginPath();
    r.drawOutline(gamecanvas, color, 2);
}

PlayerDebugger.prototype.drawDebugItem = function(window, gamecanvas, x, y, scale, item) {
    
    var pp = this.player.getLocation();
    var px = pp.x;
    var py = pp.y;
    
    var ix = (item.x - px) * scale;
    var iy = (item.y - py) * scale;
    var color = item.color;
    var rect = geometryfactory.getRectangle(x + ix, y + iy, item.width * scale, item.height * scale);

    gamecanvas.beginPath();
    rect.drawOutline(gamecanvas, color, 2);
}