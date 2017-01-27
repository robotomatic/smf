"use strict";

function ItemMaterialMetal() {
}

ItemMaterialMetal.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {
    var mbr = polygon.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = material.color.light ? material.color.light : material.color;
    var colordark = material.color.dark ? material.color.dark : material.color;
    this.drawMetal(ctx, polygon, material, x, y, width, height, scale, color, colordark);
}

ItemMaterialMetal.prototype.drawMetal = function(ctx, polygon, material, x, y, width, height, scale, color, colordark) {

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
    ctx.fillStyle = color;

    if (material.craziness) polygon.craziness(material.craziness);
    ctx.beginPath();
    
    if (material.radius) polygon.drawRound(ctx, material.radius);
    else polygon.draw(ctx);

    ctx.globalCompositeOperation = 'source-atop';
    this.drawMetalRects(ctx, 0, 0, width, height, scale, color, colordark);
    ctx.globalCompositeOperation = 'source-over';
}

ItemMaterialMetal.prototype.drawMetalRects = function(ctx, x, y, width, height, scale, color, colordark) {
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

ItemMaterialMetal.prototype.drawMetalRect = function(ctx, x, y, width, height, scale, color, darkcolor) {
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