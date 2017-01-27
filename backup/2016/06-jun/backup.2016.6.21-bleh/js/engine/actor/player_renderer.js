"use strict";

function PlayerRenderer(player) {
    this.player = player;
    this.debug = false;
    this.outline = false;
}

PlayerRenderer.prototype.draw = function(now, ctx, x, y, width, height, scale, quality) {
    if (this.player.character) this.player.character.draw(now, ctx, this.player.color, x, y, width, height, this.outline, this.debug, quality);
    else {
        ctx.fillStyle = this.color;
        var rect = new Rectangle(x, y, width, height);
        rect.draw(ctx);
    }
    if (this.debug) this.drawDebug(now, ctx, x, y, width, height, scale);
}

PlayerRenderer.prototype.drawDebug = function(now, ctx, x, y, width, height, scale) {

    var lx = (this.player.collider.lastbox.x - this.player.controller.x) * scale;
    var ly = (this.player.collider.lastbox.y - this.player.controller.y) * scale;
    this.drawDebugRect(ctx, x + lx, y + ly, scale, this.player.collider.lastbox, "yellow");
    
    
    var hx = (this.player.collider.collisionbox.x - this.player.controller.x) * scale;
    var hy = (this.player.collider.collisionbox.y - this.player.controller.y) * scale;
    this.drawDebugRect(ctx, x + hx, y + hy, scale, this.player.collider.collisionbox, "magenta");

    var mx = (this.player.collider.movebox.x - this.player.controller.x) * scale;
    var my = (this.player.collider.movebox.y - this.player.controller.y) * scale;
    this.drawDebugRect(ctx, x + mx, y + my, scale, this.player.collider.movebox, "black");
    
    
    
    
    var cbx = (this.player.camera.camerabox.x - this.player.controller.x) * scale;
    var cby = (this.player.camera.camerabox.y - this.player.controller.y) * scale;
    this.drawDebugRect(ctx, x + cbx, y + cby, scale, this.player.camera.camerabox, "white");
    

    for (var i = 0; i < this.player.collider.levelcollisions.length; i++) {
        this.drawDebugItem(ctx, x, y, scale, this.player.collider.levelcollisions[i]);
    }

    var jpx = (this.player.controller.jumpstartx - this.player.controller.x) * scale;
    var jpy = (this.player.controller.jumpstarty - this.player.controller.y) * scale;
    var jr = new Rectangle(x + jpx - 5, y + jpy - 5, 10, 10);
    ctx.fillStyle = "red";
    ctx.beginPath();
    jr.draw(ctx);
    
    
    
    var gpx = (this.player.controller.groundpoint.x - this.player.controller.x) * scale;
    var gpy = (this.player.controller.groundpoint.y - this.player.controller.y) * scale;
    var gr = new Rectangle(x + gpx - 2, y + gpy - 4, 4, 8);
    ctx.fillStyle = "white";
    ctx.beginPath();
    gr.draw(ctx);
    
    this.drawDebugText(ctx, x, y, width, height, scale);
}

PlayerRenderer.prototype.drawDebugText = function(ctx, x, y, width, height, scale) {
    var pad = 5 * scale;
    var message = "x: " + this.player.controller.x + "\ny: " + this.player.controller.y;
    message += "\nvx: " + this.player.controller.velX + "\nvy: " + this.player.controller.velY;
    
    message += "\n\ngpx: " + this.player.controller.groundpoint.x + "\ngpy: " + this.player.controller.groundpoint.y;
    
    ctx.fillStyle = "red";
    var t = new Text(x + width + pad, y + pad, message);
    ctx.beginPath();
    t.draw(ctx);
}

PlayerRenderer.prototype.drawDebugRect = function(ctx, x, y, scale, rect, color) {
    var rect = new Rectangle(x, y, rect.width * scale, rect.height * scale);
    ctx.beginPath();
    rect.drawOutline(ctx, color, 2);
}

PlayerRenderer.prototype.drawDebugItem = function(ctx, x, y, scale, item) {
    var ix = (item.x - this.player.controller.x) * scale;
    var iy = (item.y - this.player.controller.y) * scale;
    var color = item.color;
    var rect = new Rectangle(x + ix, y + iy, item.width * scale, item.height * scale);
    ctx.beginPath();
    rect.drawOutline(ctx, color, 2);
}