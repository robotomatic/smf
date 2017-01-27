"use strict";

function PlayerRenderer(player) {
    this.player = player;
    this.debug = false;
    this.outline = false;
}

PlayerRenderer.prototype.draw = function(now, ctx, x, y, width, height, quality) {
    if (this.player.character) this.player.character.draw(now, ctx, this.player.color, x, y, width, height, this.outline, this.debug, quality);
    else {
        ctx.fillStyle = this.color;
        var rect = new Rectangle(x, y, width, height);
        rect.draw(ctx);
    }
    if (this.debug) this.drawDebug(now, ctx, x, y, width, height);
}

PlayerRenderer.prototype.drawDebug = function(now, ctx, x, y, width, height) {

    var scale = width / this.player.controller.width;

    var cbx = (this.player.camera.camerabox.x - this.player.controller.x) * scale;
    var cby = (this.player.camera.camerabox.y - this.player.controller.y) * scale;
    this.drawDebugRect(ctx, x + cbx, y + cby, scale, this.player.camera.camerabox, "cyan");
    
    var hx = (this.player.collider.colliders["horizontal"].x - this.player.controller.x) * scale;
    var hy = (this.player.collider.colliders["horizontal"].y - this.player.controller.y) * scale;
    this.drawDebugRect(ctx, x + hx, y + hy, scale, this.player.collider.colliders["horizontal"], this.player.collider.colliders["horizontal"].color);
    
    var vx = (this.player.collider.colliders["vertical"].x - this.player.controller.x) * scale;
    var vy = (this.player.collider.colliders["vertical"].y - this.player.controller.y) * scale;
    this.drawDebugRect(ctx, x + vx, y + vy, scale, this.player.collider.colliders["vertical"], this.player.collider.colliders["vertical"].color);
    
    for (var i = 0; i < this.player.collider.levelcollisions.length; i++) {
        this.drawDebugItem(ctx, x, y, scale, this.player.collider.levelcollisions[i]);
    }
    
    var gpx = (this.player.controller.groundpoint.x - this.player.controller.x) * scale;
    var gpy = (this.player.controller.groundpoint.y - this.player.controller.y) * scale;
    var gr = new Rectangle(x + gpx - 2, y + gpy - 4, 4, 8);
    ctx.fillStyle = "white";
    gr.draw(ctx);
    this.drawDebugText(ctx, x, y, width, height, scale);
}

PlayerRenderer.prototype.drawDebugText = function(ctx, x, y, width, height, scale) {
    var pad = 5 * scale;
    var message = "x:" + this.player.controller.x + "\ny: " + this.player.controller.y;
    message += "\nvx:" + this.player.controller.velX + "\nvy: " + this.player.controller.velY;
    ctx.fillStyle - "red";
    var t = new Text(x + width + pad, y + pad, message);
    t.draw(ctx);
}

PlayerRenderer.prototype.drawDebugRect = function(ctx, x, y, scale, rect, color) {
    var rect = new Rectangle(x, y, rect.width * scale, rect.height * scale);
    rect.drawOutline(ctx, color, 2);
}

PlayerRenderer.prototype.drawDebugItem = function(ctx, x, y, scale, item) {
    var ix = (item.x - this.player.controller.x) * scale;
    var iy = (item.y - this.player.controller.y) * scale;
    var color = item.color;
    var rect = new Rectangle(x + ix, y + iy, item.width * scale, item.height * scale);
    rect.drawOutline(ctx, color, 2);
}