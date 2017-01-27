"use strict";

function PlayerDebugger(player) {
    this.player = player;
}

PlayerDebugger.prototype.drawDebug = function(now, window, ctx, x, y, z, playerbox, scale) {
    
    
    playerbox.drawOutline(ctx, "red", 2);
    
    
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
    
//    var cbx = (this.player.camera.camerabox.x - px) * scale;
//    var cby = (this.player.camera.camerabox.y - py) * scale;
//    this.drawDebugRect(window, ctx, x + cbx, y + cby, scale, this.player.camera.camerabox, "white");
    

//    for (var i = 0; i < this.player.collider.levelcollisions.length; i++) {
//        this.drawDebugItem(window, ctx, x, y, scale, this.player.collider.levelcollisions[i]);
//    }

//    var jpx = (this.player.controller.jumpstartx - this.player.controller.x) * scale;
//    var jpy = (this.player.controller.jumpstarty - this.player.controller.y) * scale;
//    var jr = new Rectangle(x + jpx - 5, y + jpy - 5, 10, 10);
//    ctx.fillStyle = "red";
//    ctx.beginPath();
//    jr.draw(ctx);
    
    
//    var gpx = (this.player.controller.groundpoint.x - px) * scale;
//    var gpy = (this.player.controller.groundpoint.y - py) * scale;
//    var gr = new Rectangle(x + gpx - 2, y + gpy - 4, 4, 8);
//    ctx.fillStyle = "white";
//    ctx.beginPath();
//    gr.draw(ctx);
//    
//    this.drawDebugText(ctx, x, y, width, height, scale);
}

PlayerDebugger.prototype.drawDebugText = function(ctx, x, y, width, height, scale) {
    var pad = 5 * scale;
    var message = "x: " + this.player.controller.x + "\ny: " + this.player.controller.y + "\nz: " + this.player.controller.z;
    message += "\nvx: " + this.player.controller.velX + "\nvy: " + this.player.controller.velY + "\nvz: " + this.player.controller.velZ;
    
    message += "\n\ngpx: " + this.player.controller.groundpoint.x + "\ngpy: " + this.player.controller.groundpoint.y + "\ngpz: " + this.player.controller.groundpoint.z;
    
    ctx.fillStyle = "white";
    
    var tx = round(x + width + pad);
    var ty = round(y + pad);
    
    var t = new Text(tx, ty, message);
    ctx.beginPath();
    t.draw(ctx);
}

PlayerDebugger.prototype.drawDebugRect = function(window, ctx, x, y, scale, rect, color) {
    var r = new Rectangle(x, y, rect.width * scale, rect.height * scale);
    
    
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
    var rect = new Rectangle(x + ix, y + iy, item.width * scale, item.height * scale);

    ctx.beginPath();
    rect.drawOutline(ctx, color, 2);
}