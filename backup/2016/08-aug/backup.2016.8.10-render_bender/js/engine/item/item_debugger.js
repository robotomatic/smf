"use strict";

function ItemDebugger() {
    this.polygon = new Polygon();
    this.rect = new Rectangle();
}

ItemDebugger.prototype.debugItems = function(items, now, ctx, window, x, y, width, height, scale, parallax) {
    var t = items.length;
    for (var i = 0; i < t; i++) this.debugItem(items[i], now, ctx, window, x, y, width, height, scale, parallax);
}

ItemDebugger.prototype.debugItem = function(item, now, ctx, window, x, y, width, height, scale, parallax) {
    if (item.parts) this.debugItemParts(item, now, ctx, window, x, y, width, height, scale, parallax);
    else this.debugItemBlock(item, now, ctx, window, x, y, width, height, scale, parallax);    
    this.drawDebugText(item, now, ctx, window, x, y, width, height, scale, parallax);
}

ItemDebugger.prototype.debugItemBlock = function(item, now, ctx, window, x, y, width, height, scale, parallax) {
    
    var color = "gray";
    ctx.fillStyle = color;
    var w = (item.collide == false) ? 1 : 3;
    
    var box = item.box;
    ctx.beginPath();
    box.drawOutline(ctx, color, w);
}

ItemDebugger.prototype.debugItemParts = function(item, now, ctx, window, x, y, width, height, scale, parallax) {

    var color = "black";
    ctx.fillStyle = color;
    var mbr = item.getMbr();
    this.rect.x = round((mbr.x - x) * scale);
    this.rect.y = round((mbr.y - y) * scale);
    this.rect.width = round(mbr.width * scale);
    this.rect.height = round(mbr.height * scale);
    ctx.beginPath();
    this.rect.drawOutline(ctx, color, 1);
    
    var ip = item.getPolygon();
    this.polygon.setPoints(ip.getPoints());
    
    var dx = (item.x - x) * scale;
    var dy = (item.y - y) * scale;
    this.polygon.translate(dx, dy, scale);

    var w = (item.collide == false) ? 1 : 3;
    
    ctx.beginPath();
    this.polygon.drawOutline(ctx, color, w);

    color = "darkgray";
    ctx.fillStyle = color;
    var pad = 5 * scale;
    
    var parts = item.parts;
    var t = parts.length;
    for (var i = 0; i < t; i++) {
        var part = item.parts[item.keys[i]];

        this.rect.x = (item.x + part.x - x) * scale;
        this.rect.y = (item.y + part.y - y) * scale;
        this.rect.width = part.width * scale;
        this.rect.height = part.height * scale;
        
        ctx.beginPath();
        this.rect.drawOutline(ctx, color, 1);
        
        var tx = this.rect.x + (2 * pad);
        var ty = this.rect.y + pad;
        var message = "x: " + round(item.x + part.x) + "\ny: " + round(item.y + part.y);
        var txt = new Text(tx, ty, message);
        ctx.beginPath();
        txt.draw(ctx);
    }
}

ItemDebugger.prototype.drawDebugText = function(debugitem, now, ctx, window, x, y, width, height, scale, parallax) {

    var item = debugitem.parts ? debugitem.getMbr() : debugitem;
    
    var pad = 5 * scale;
    var message = "x: " + item.x + "\ny: " + item.y;
    if (item.action) message += "\nvx: " + item.velX + "\nvy: " + item.velY;
    
    var dx = (item.x + item.width - x) * scale;
    var dy = (item.y - y) * scale;

    var tx = dx + pad;
    var ty = dy + pad;

    if (parallax) {
        var rc = window.getCenter();
        
        var lcx = width / 2;
        var dcx = (lcx - rc.x) * scale;
        tx += dcx * parallax;
        
        var lcy = height / 2;
        var dcy = (lcy - rc.y) * scale;
        ty += dcy * parallax;
    }
    
    tx = round(tx);
    ty = round(ty);
    
    var t = new Text(tx, ty, message);
    
    ctx.beginPath();
    t.draw(ctx);
}
