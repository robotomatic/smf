"use strict";

function ItemRendererMetal() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemRendererMetal.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale, drawdetails) {
    if (titem.renderer == "metal") this.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else this.drawPlatformBg(ctx, item, x, y, width, height, scale, titem, drawdetails);
}

ItemRendererMetal.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    this.drawPlatformMetal(ctx, item, x, y, width, height, scale, platform, drawdetails, true);
}

ItemRendererMetal.prototype.drawPlatformBg = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    this.drawPlatformMetal(ctx, item, x, y, width, height, scale, platform, drawdetails, false);
}


ItemRendererMetal.prototype.drawPlatformMetal = function(ctx, item, x, y, width, height, scale, platform, drawdetails, top) {
    if (!scale) scale = 1;
    var poly = new Polygon();
    var ip = item.getPolygon();
    poly.setPoints(ip.getPoints());
    poly.translate(x, y, scale);
    var mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = platform.colorlight;
    var colordark = platform.colordark;
    this.drawMetal(ctx, poly, x, y, width, height, scale, color, colordark, 25);
    if (top) this.drawPlatformTops(ctx, item, x, y, scale, platform.colortoplight);
}

ItemRendererMetal.prototype.drawMetal = function(ctx, polygon, x, y, width, height, scale, color, colordark, step) {

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

    this.ctx.globalCompositeOperation = 'source-atop';
    this.drawMetalRects(this.ctx, 0, 0, width, height, scale, color, colordark);
    this.ctx.globalCompositeOperation = 'source-over';
    
    var img = new Image(this.canvas, 0, 0, width, height);
    img.draw(ctx, x, y, width, height);
}

ItemRendererMetal.prototype.drawMetalRects = function(ctx, x, y, width, height, scale, color, colordark) {
    var amt = 50;
    var max = 10;
    var tot = random(0, max);
    for (var i = 0; i < tot; i++) {
        var cx = random(0, width);
        var cy = random(0, height);
        var cw = random(amt, amt * 2);
        var ch = cw;
        this.drawMetalRect(ctx, x + cx, y + cy, cw, ch, scale, color, colordark);        
    }
}

ItemRendererMetal.prototype.drawMetalRect = function(ctx, x, y, width, height, scale, color, darkcolor) {
    var rect = new Rectangle(x, y, width, height);
    var poly = new Polygon();
    poly.setPoints(rect.getPoints());
    var a = random(-15, 15);
    var points = poly.rotate(a);
    poly.setPoints(points);
    var weight = .2 * scale;
    ctx.fillStyle = color;
    var rad = 100;
    ctx.beginPath();
    poly.drawRound(ctx, rad);
    ctx.beginPath();
    poly.drawOutlineRound(ctx, rad, darkcolor, weight);
}




    
ItemRendererMetal.prototype.drawPlatformTops = function(ctx, item, x, y, scale, color) {
    var ptops = item.polytops;
    var offset = 5;
    var shadowoffset = offset * 1.5;
    var shadow = "#62605d";
    ctx.globalAlpha = .8;
    ctx.beginPath();
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true);
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