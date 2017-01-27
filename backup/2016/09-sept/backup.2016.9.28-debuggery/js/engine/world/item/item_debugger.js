"use strict";

function ItemDebugger() {
    this.polygon = new Polygon();
    this.rect = new Rectangle();
    this.text = new Text();
    this.textsize = 5;
}

ItemDebugger.prototype.debugItems = function(items, now, ctx, window, x, y, width, height, scale) {
    var t = items.length;
    for (var i = 0; i < t; i++) this.debugItem(items[i], now, ctx, window, x, y, width, height, scale);
}

ItemDebugger.prototype.debugItem = function(item, now, ctx, window, x, y, width, height, scale) {
    this.debugItemBlock(item, now, ctx, window, x, y, width, height, scale); 
    if (item.parts) this.debugItemParts(item, now, ctx, window, x, y, width, height, scale);
    this.drawDebugText(item, now, ctx, window, x, y, width, height, scale);
}

ItemDebugger.prototype.debugItemBlock = function(item, now, ctx, window, x, y, width, height, scale) {
    var color = "red";
    ctx.fillStyle = color;
    var mbr = item.box;
    this.rect.x = mbr.x;
    this.rect.y = mbr.y;
    this.rect.width = mbr.width;
    this.rect.height = mbr.height;
    ctx.beginPath();
    this.rect.drawOutline(ctx, color, 1);
}

ItemDebugger.prototype.debugItemParts = function(item, now, ctx, window, x, y, width, height, scale) {

    var color = "black";
    ctx.fillStyle = color;
    var mbr = item.box;
    this.rect.x = mbr.x;
    this.rect.y = mbr.y;
    this.rect.width = mbr.width;
    this.rect.height = mbr.height;
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
    
    ctx.fillStyle = "red";
    var points = this.polygon.points;
    var pt = points.length;
    for (var pi = 0; pi < pt; pi++) {
        var point = points[pi];
        var rs = 5 * scale;
        var rx = point.x - (rs / 2);
        var ry = point.y - (rs / 2);
        var r = new Rectangle(rx, ry, rs, rs);
        ctx.beginPath();
        r.draw(ctx);
    }

    color = "white";
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
        
        var tx = this.rect.x + pad;
        var ty = this.rect.y + pad;
        var message = "x: " + round(item.x + part.x) + "\ny: " + round(item.y + part.y);
        ctx.beginPath();
        var size = this.textsize * scale;
        this.text.x = tx;
        this.text.y = ty;
        this.text.message = message;
        this.text.draw(ctx, size);
    }
}

ItemDebugger.prototype.drawDebugText = function(debugitem, now, ctx, window, x, y, width, height, scale) {

    var item = debugitem.parts ? debugitem.getMbr() : debugitem;
    
    var pad = 5 * scale;
    var message = "x: " + item.x + "\ny: " + item.y;
    if (item.action) message += "\nvx: " + item.velX + "\nvy: " + item.velY;
    
    var dx = (item.x + item.width - x) * scale;
    var dy = (item.y - y) * scale;

    var tx = dx + pad;
    var ty = dy + pad;

    if (debugitem.parallax) {
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
    
    ctx.beginPath();
    var size = this.textsize * scale;
    this.text.x = tx;
    this.text.y = ty;
    this.text.message = message;
    this.text.draw(ctx, size);
}
