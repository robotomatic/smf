"use strict";

function ItemRendererTops() {
    
}

ItemRendererTops.prototype.render = function(ctx, color, item, window, x, y, titem, scale) {
    
    var top = titem.top;
    if (!top) return;
    
    var color = top.color.light;
    var ptops = item.polytops;
    var shadowoffset = 1.5;
    var shadow = top.color.dark;
    ctx.globalAlpha = .6;
    ctx.beginPath();
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, 0);
}

ItemRendererTops.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset) {
    var mbr = top.getMbr();
//    if (mbr.width < 15 || mbr.height < 5) return;
    var t = top.points.length;
    var pl = new Polygon();
    for (var i = 0; i < t; i++) {
        var p = new Point(x + (top.points[i].x * scale), y + (top.points[i].y * scale) + (offset * scale));
        pl.addPoint(p);
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    pl.draw(ctx, 20);
}            




