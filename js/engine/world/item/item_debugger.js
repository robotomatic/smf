"use strict";

function ItemDebugger() {
    this.polygon = geometryfactory.getPolygon();
    this.rect = geometryfactory.getRectangle();
    this.text = geometryfactory.getText();
    this.textsize = 10;
}

ItemDebugger.prototype.debugItems = function(items, now, ctx, window, x, y, width, height, scale) {
    var t = items.length;
    for (var i = 0; i < t; i++) this.debugItem(items[i], now, ctx, window, x, y, width, height, scale);
}

ItemDebugger.prototype.debugItem = function(item, now, ctx, window, x, y, width, height, scale) {
    if (item.width == "100%") return;
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
//    ctx.fillStyle = color;
//    var mbr = item.box;
//    this.rect.x = mbr.x;
//    this.rect.y = mbr.y;
//    this.rect.width = mbr.width;
//    this.rect.height = mbr.height;
//    ctx.beginPath();
//    this.rect.drawOutline(ctx, color, 1);
    
    var box = item.box;
    var bx = box.x;
    var by = box.y;
    var bs = item.scalefactor;
    
    this.polygon.points.length = 0;
    var ip = item.getPolygon();
    this.polygon.setPoints(ip.getPoints());
    this.polygon.translate(bx, by, scale * bs);

    var w = (item.collide == false) ? 1 : 3;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    this.polygon.drawOutline(ctx, color, w);

    ctx.fillStyle = "red";
    var points = this.polygon.points;
    var pt = points.length;
    for (var pi = 0; pi < pt; pi++) {
        var point = points[pi];
        ctx.beginPath();
        point.draw(ctx, 5);
    }


//    color = "white";
//    ctx.fillStyle = color;
//    var pad = 5 * scale;
//    var spad = pad * item.scalefactor;
//    
//    var parts = item.parts;
//    var t = parts.length;
//    for (var i = 0; i < t; i++) {
//        var part = item.parts[item.keys[i]];
//
//        this.rect.x = (item.x + part.x - x) * scale;
//        this.rect.y = (item.y + part.y - y) * scale;
//        this.rect.width = part.width * scale;
//        this.rect.height = part.height * scale;
//        
//        this.rect = projectRectangle3D(this.rect, depth, scale, x, y, wc);
//        
//        ctx.beginPath();
//        this.rect.drawOutline(ctx, color, 1);
//        
//        var tx = this.rect.x + spad;
//        var ty = this.rect.y + spad;
//        var message = "x: " + round(item.x + part.x) + "\ny: " + round(item.y + part.y);
//        var size = this.textsize * scale;
//        this.text.x = tx;
//        this.text.y = ty;
//        this.text.message = message;
//        ctx.beginPath();
//        this.text.draw(ctx, size);
//    }
}

ItemDebugger.prototype.drawDebugText = function(debugitem, now, ctx, window, x, y, width, height, scale) {

    var item = debugitem;
    
    var pad = 5 * scale * item.scalefactor;
    
    var message = "x: " + item.x + "\ny: " + item.y + "\nz: " + item.z;
    if (item.action) message += "\nvx: " + item.velX + "\nvy: " + item.velY;
    
    var dx = item.box.x;
    var dy = item.box.y;

    var tx = dx + pad;
    var ty = dy + pad;

    tx = round(tx);
    ty = round(ty);

    ctx.fillStyle = "black";
    ctx.beginPath();
    var size = this.textsize;
    this.text.x = tx;
    this.text.y = ty;
    this.text.message = message;
    this.text.draw(ctx, size);
}
