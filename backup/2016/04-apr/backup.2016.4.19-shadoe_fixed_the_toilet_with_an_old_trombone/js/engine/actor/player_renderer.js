"use strict";

function PlayerRenderer(player) {
    this.player = player;
    this.debug = false;
    this.outline = true;
}

PlayerRenderer.prototype.draw = function(now, ctx, x, y, width, height, quality) {
    if (this.player.character) this.player.character.draw(now, ctx, this.player.color, x, y, width, height, this.outline, this.debug, quality);
    else {
        ctx.fillStyle = this.color;
        drawShape(ctx, x, y, width, height);
    }
    if (this.debug) this.drawDebug(now, ctx, x, y, width, height);
}

PlayerRenderer.prototype.drawDebug = function(now, ctx, x, y, width, height) {
    var scale = width / this.player.width;
//    var cx = (this.collisionbox.x - this.x) * scale;
//    var cy = (this.collisionbox.y - this.y) * scale;
//    this.drawDebugRect(ctx, x + cx, y + cy, scale, this.collisionbox, "yellow");
//    
    var hx = (this.player.colliders["horizontal"].x - this.player.x) * scale;
    var hy = (this.player.colliders["horizontal"].y - this.player.y) * scale;
    this.drawDebugRect(ctx, x + hx, y + hy, scale, this.player.colliders["horizontal"], this.player.colliders["horizontal"].color);
    
    var vx = (this.player.colliders["vertical"].x - this.player.x) * scale;
    var vy = (this.player.colliders["vertical"].y - this.player.y) * scale;
    this.drawDebugRect(ctx, x + vx, y + vy, scale, this.player.colliders["vertical"], this.player.colliders["vertical"].color);
    
    var cbx = (this.player.camerabox.x - this.player.x) * scale;
    var cby = (this.player.camerabox.y - this.player.y) * scale;
    this.drawDebugRect(ctx, x + cbx, y + cby, scale, this.player.camerabox, "cyan");
    
//    for (var i = 0; i < this.player.levelcollisions.length; i++) this.drawDebugItem(ctx, x, y, scale, this.player.levelcollisions[i]);
    
    var gpx = (this.player.groundpoint.x - this.player.x) * scale;
    var gpy = (this.player.groundpoint.y - this.player.y) * scale;
    var gr = new Rectangle(x + gpx - 2, y + gpy - 4, 4, 8);
    ctx.fillStyle = "white";
    gr.draw(ctx);
    this.drawDebugText(ctx, x, y, width, height, scale);
}

PlayerRenderer.prototype.drawDebugText = function(ctx, x, y, width, height, scale) {
    var pad = 5 * scale;
    var message = "x:" + this.player.x + "\ny: " + this.player.y;
    message += "\nvx:" + this.player.velX + "\nvy: " + this.player.velY;
    drawText(ctx, message, "red", x + width + pad, y + pad);
}

PlayerRenderer.prototype.drawDebugRect = function(ctx, x, y, scale, rect, color) {
    drawShapeOutline(ctx, color, rect, x, y, rect.width * scale, rect.height * scale, 1, 1, scale);
}

PlayerRenderer.prototype.drawDebugItem = function(ctx, x, y, scale, item) {
    var ix = (item.x - this.x) * scale;
    var iy = (item.y - this.y) * scale;
    var color = item.color;
    drawShapeOutline(ctx, color, item, x + ix, y + iy, item.width * scale, item.height * scale, 1, 1, scale);
}