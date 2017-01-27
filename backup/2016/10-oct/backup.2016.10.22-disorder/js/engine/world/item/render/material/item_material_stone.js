"use strict";

function ItemMaterialStone() {
}

ItemMaterialStone.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {
    var mbr = polygon.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = material.color.light ? material.color.light : material.color;
    var colordark = material.color.dark ? material.color.dark : material.color;
    this.drawStone(ctx, polygon, material, x, y, width, height, scale, color, colordark);
}

ItemMaterialStone.prototype.drawStone = function(ctx, polygon, material, x, y, width, height, scale, color, colordark) {

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
    this.drawStonePolys(ctx, material, 0, 0, width, height, scale, color, colordark);
    ctx.globalCompositeOperation = 'source-over';
}

ItemMaterialStone.prototype.drawStonePolys = function(ctx, material, x, y, width, height, scale, color, colordark) {
    var amt = material.stones.size;
    var min = material.stones.min;
    var max = material.stones.max;
    var tot = random(min, max);
    for (var i = 0; i < tot; i++) {
        var cx = random(x, x + width);
        var cy = random(y, y + height);
        var cw = random(amt / 2, amt * 2);
        var ch = cw;
        this.drawStonePoly(ctx, cx, cy, cw, ch, scale, color, colordark);
    }
}

ItemMaterialStone.prototype.drawStonePoly = function(ctx, x, y, width, height, scale, color, darkcolor) {
    var poly = new Polygon();
    var amt = width / 2;
    poly.addPoint(new Point(x, y));
    poly.addPoint(new Point(x + width / 2, y - amt));
    poly.addPoint(new Point(x + width, y));
    poly.addPoint(new Point(x +width + amt, y + height / 2));
    poly.addPoint(new Point(x + width, y + height));
    poly.addPoint(new Point(x + width / 2, y + height + amt));
    poly.addPoint(new Point(x, y + height));
    poly.addPoint(new Point(x - amt, y + height / 2));
    var a = random(0, 360);
    var points = poly.rotate(a);
    poly.setPoints(points);
    poly.craziness(2);
    var weight = .2 * scale;
    var rad = 5 * scale;
    ctx.fillStyle = darkcolor;
    ctx.beginPath();
    poly.drawRound(ctx, rad);
}