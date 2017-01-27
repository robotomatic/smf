"use strict";

function ItemRendererPlastic() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemRendererPlastic.prototype.draw = function(ctx, color, item, x, y, width, height, titem, scale, drawdetails) {
    if (titem.renderer == "plastic") this.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else this.drawPlatformBg(ctx, item, x, y, width, height, scale, titem, drawdetails);
}

ItemRendererPlastic.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    if (!scale) scale = 1;
    var poly = new Polygon();
    poly.createPolygon(item.parts);
    var tops = poly.tops;
    poly.craziness(0);
    poly.translate(x, y, scale);
    var mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = platform.colorlight;
    var colordark = platform.colordark;
    this.drawGround(ctx, poly, x, y, width, height, scale, color, colordark, 25);
    this.drawPlatformTops(ctx, tops, x, y, scale, platform.colortoplight);
}

ItemRendererPlastic.prototype.drawPlatformBg = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    if (!scale) scale = 1;
    var poly = new Polygon();
    poly.createPolygon(item.parts);
    poly.craziness(0);
    poly.translate(x, y, scale);
    var mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = platform.colorlight;
    var colordark = platform.colordark;
    this.drawGround(ctx, poly, x, y, width, height, scale, color, colordark, 45);
}

ItemRendererPlastic.prototype.drawGround = function(ctx, polygon, x, y, width, height, scale, color, colordark, step) {

    this.canvas.width = width;
    this.canvas.height = height;
    
    var gy = y;
    var h = 400;
    var fcolor = "white";
    if (color.gradient) {
        var gradient = color.gradient;
        var g = ctx.createLinearGradient(0, gy, 0, h + gy);
        var start = gradient.start;
        var stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
    }
    if (colordark.gradient) {
        var gradient = color.gradient;
        var g = ctx.createLinearGradient(0, gy, 0, h + gy);
        var start = gradient.start;
        var stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        colordark = g;
    }
    this.ctx.fillStyle = color;

    polygon.translate(-x, -y);
    polygon.draw(this.ctx);

//    this.ctx.globalCompositeOperation = 'source-atop';
//    
//
//    this.ctx.globalCompositeOperation = 'source-over';
    
    var img = new Image(this.canvas, 0, 0, width, height);
    img.draw(ctx, x, y, width, height);
}























ItemRendererPlastic.prototype.drawPlatformTops = function(ctx, tops, x, y, scale, color) {
    var pl = new Polylines();
    pl.createPolylines(tops);
    var pad = 5;
    var ptops = new Array();
    for (var i = 0; i < pl.polylines.length; i++) ptops[ptops.length] = this.createPlatformTop(pl.polylines[i], pad);
    var offset = pad;
    var shadowoffset = offset * 1.5;
    var shadow = "#92938b";
    ctx.globalAlpha = .8;
    ctx.beginPath();
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true);
}

ItemRendererPlastic.prototype.createPlatformTop = function(top, pad) {
    var pg = new Polygon();
    var p;
    var np;
    p = top.points[0];
    np = new Point(p.x - pad, p.y - pad);
    pg.addPoint(np);
    for (var i = 0; i < top.points.length; i++) {
        p = top.points[i];
        np = new Point(p.x, p.y - pad);
        pg.addPoint(np);
    }
    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y - pad);
    pg.addPoint(np);
    var bpad = pad;
    for (var i = top.points.length; i > 0; i--) {
        p = top.points[i - 1];
        np = new Point(p.x, p.y + bpad);
        pg.addPoint(np);
    }
    return pg;
}

ItemRendererPlastic.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset, details) {

    var mbr = top.getMbr();
    if (mbr.width < 15 || mbr.height < 5) return;
    
    var angle = 50;
    var num = 15;
    var max = 12;
    var shadow = "#9dac4c";
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