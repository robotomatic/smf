"use strict";

function ItemRendererMetal() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemRendererMetal.prototype.draw = function(ctx, color, item, x, y, width, height, titem, scale, drawdetails) {
    if (titem.renderer == "metal") this.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else this.drawPlatformBg(ctx, item, x, y, width, height, scale, titem, drawdetails);
}

ItemRendererMetal.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    if (!scale) scale = 1;
    var poly = new Polygon();
    poly.createPolygon(item.parts);
    var tops = poly.tops;
    poly.craziness(3);
    poly.translate(x, y, scale);
    var mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = platform.colorlight;
    var colordark = platform.colordark;
    this.drawGround(ctx, poly, x, y, width, height, scale, color, colordark, 25);
    this.drawPlatformTops(ctx, tops, x, y, scale, platform.colortoplight);
}

ItemRendererMetal.prototype.drawPlatformBg = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    if (!scale) scale = 1;
    var poly = new Polygon();
    poly.createPolygon(item.parts);
    poly.craziness(5);
    poly.translate(x, y, scale);
    var mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = platform.colorlight;
    var colordark = platform.colordark;
    this.drawGround(ctx, poly, x, y, width, height, scale, color, colordark, 45);
}

ItemRendererMetal.prototype.drawGround = function(ctx, polygon, x, y, width, height, scale, color, colordark, step) {

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























ItemRendererMetal.prototype.drawPlatformTops = function(ctx, tops, x, y, scale, color) {
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

ItemRendererMetal.prototype.createPlatformTop = function(top, pad) {
    var pg = new Polygon();
    var p;
    var np;
    p = top.points[0];
    np = new Point(p.x - pad, p.y - pad);
    pg.addPoint(np);
    var simple = false;
    if (top.points.length == 2) {
        simple = true;
        top.points[2] = top.points[1];
        var d = top.points[1].x - top.points[0].x;
        var rd = random(0, d);
        top.points[1] = new Point(top.points[0].x + rd, top.points[0].y);
    }
    for (var i = 0; i < top.points.length; i++) {
        p = top.points[i];
        np = new Point(p.x, p.y - pad);
        pg.addPoint(np);
    }
    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y - pad);
    pg.addPoint(np);
    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y);
    pg.addPoint(np);
    var bpad = pad;
    if (simple) bpad = pad = random(0, pad);
    for (var i = top.points.length; i > 0; i--) {
        p = top.points[i - 1];
        np = new Point(p.x, p.y + bpad);
        pg.addPoint(np);
    }
    p = top.points[0];
    np = new Point(p.x - pad, p.y);
    pg.addPoint(np);
    return pg;
}

ItemRendererMetal.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset, details) {

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