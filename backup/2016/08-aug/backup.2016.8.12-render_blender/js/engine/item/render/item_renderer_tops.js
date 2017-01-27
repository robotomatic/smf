"use strict";

function ItemRendererTops() {
    
}

ItemRendererTops.prototype.render = function(ctx, color, item, window, x, y, width, height, titem, scale) {
    
    var top = titem.top;
    if (!top) return;
    
    var color = top.color.light;
    var ptops = item.polytops;
    var offset = 5;
    var shadowoffset = offset * 1.5;
    var shadow = top.color.dark;
    ctx.globalAlpha = .8;
    ctx.beginPath();
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true);
}

ItemRendererTops.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset, details) {
    var mbr = top.getMbr();
    if (mbr.width < 15 || mbr.height < 5) return;
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




