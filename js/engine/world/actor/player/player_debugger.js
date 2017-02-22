"use strict";

function PlayerDebugger(player) {
    this.player = player;
    this.debug = false;
    this.rect = new Rectangle(0, 0, 0, 0);
}

PlayerDebugger.prototype.drawDebug = function(now, ctx) {
    
    if (!this.debug) return;

    var x = this.player.projectedlocation.x;
    var y = this.player.projectedlocation.y;
    
    ctx.beginPath();
    this.player.box.drawOutline(ctx, "blue", 2);
    
//    ctx.beginPath();
//    this.player.camera.camerabox.drawOutline(ctx, "blue", 2);
    
//    var cb = this.player.camera.camerabox;
//    this.rect.x = (cb.x - x) * scale;
//    this.rect.y = (cb.y - y) * scale;
//    this.rect.width = cb.width * scale;
//    this.rect.height = cb.height * scale;
//    ctx.beginPath();
//    this.rect.drawOutline(ctx, "white", 2);
    
    var gp = this.player.controller.gp;
    ctx.beginPath();
    ctx.fillStyle = "red";
    gp.draw(ctx, 5);
    
    
    
//    var cb = this.player.camera.camerabox;
//    this.rect.x = (cb.x - x) * scale;
//    this.rect.y = (cb.y - y) * scale;
//    this.rect.width = cb.width * scale;
//    this.rect.height = cb.height * scale;
//    this.rect.drawOutline(ctx, "white", 2);
    
    
//    var pp = this.player.getLocation();
//    var px = pp.x;
//    var py = pp.y;
    
//    var lx = (this.player.collider.lastbox.x - px) * scale;
//    var ly = (this.player.collider.lastbox.y - py) * scale;
//    this.drawDebugRect(window, ctx, x + lx, y + ly, scale, this.player.collider.lastbox, "yellow");
//    
//    var mx = (this.player.collider.movebox.x - px) * scale;
//    var my = (this.player.collider.movebox.y - py) * scale;
//    this.drawDebugRect(window, ctx, x + mx, y + my, scale, this.player.collider.movebox, "black");

//    var hx = (this.player.collider.collisionbox.x - px) * scale;
//    var hy = (this.player.collider.collisionbox.y - py) * scale;
//    this.drawDebugRect(window, ctx, x + hx, y + hy, scale, this.player.collider.collisionbox, "red");
    
    

//    for (var i = 0; i < this.player.collider.levelcollisions.length; i++) {
//        this.drawDebugItem(window, ctx, x, y, scale, this.player.collider.levelcollisions[i]);
//    }

//    var jpx = (this.player.controller.jumpstartx - this.player.controller.x) * scale;
//    var jpy = (this.player.controller.jumpstarty - this.player.controller.y) * scale;
//    var jr = geometryfactory.getRectangle(x + jpx - 5, y + jpy - 5, 10, 10);
//    ctx.fillStyle = "red";
//    ctx.beginPath();
//    jr.draw(ctx);
    
    
//    var gpx = (this.player.controller.groundpoint.x - px) * scale;
//    var gpy = (this.player.controller.groundpoint.y - py) * scale;
//    var gr = geometryfactory.getRectangle(x + gpx - 2, y + gpy - 4, 4, 8);
//    ctx.fillStyle = "white";
//    ctx.beginPath();
//    gr.draw(ctx);
//    
    
    this.drawDebugText(ctx, x, y, 1);
}



PlayerDebugger.prototype.drawDebugText = function(ctx, x, y, scale) {

    var pad = 5 * scale;
    var message = "x: " + this.player.controller.x + "\ny: " + this.player.controller.y + "\nz: " + this.player.controller.z;
    message += "\nvx: " + this.player.controller.velX + "\nvy: " + this.player.controller.velY + "\nvz: " + this.player.controller.velZ;
    
    message += "\n\ngpx: " + this.player.controller.groundpoint.x + "\ngpy: " + this.player.controller.groundpoint.y + "\ngpz: " + this.player.controller.groundpoint.z;
    
    ctx.fillStyle = "black";
    
    var tx = round(this.player.box.x + this.player.box.width + pad);
    var ty = round(this.player.box.y - (pad * 4));
    
    var t = geometryfactory.getText(tx, ty, message);
    ctx.beginPath();
    t.draw(ctx);
}








PlayerDebugger.prototype.drawDebugRect = function(window, ctx, x, y, scale, rect, color) {
    var r = geometryfactory.getRectangle(x, y, rect.width * scale, rect.height * scale);
    
    
    ctx.beginPath();
    r.drawOutline(ctx, color, 2);
}

PlayerDebugger.prototype.drawDebugItem = function(window, ctx, x, y, scale, item) {
    
    var pp = this.player.getLocation();
    var px = pp.x;
    var py = pp.y;
    
    var ix = (item.x - px) * scale;
    var iy = (item.y - py) * scale;
    var color = item.color;
    var rect = geometryfactory.getRectangle(x + ix, y + iy, item.width * scale, item.height * scale);

    ctx.beginPath();
    rect.drawOutline(ctx, color, 2);
}