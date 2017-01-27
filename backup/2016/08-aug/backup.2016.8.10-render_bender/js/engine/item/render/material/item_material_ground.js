"use strict";

function ItemMaterialGround() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemMaterialGround.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {
    var mbr = polygon.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = material.color.light;
    var colordark = material.color.dark;
    var step = material.step;
    this.drawGround(ctx, polygon, material, x, y, width, height, scale, color, colordark, step);
}

ItemMaterialGround.prototype.drawGround = function(ctx, polygon, material, x, y, width, height, scale, color, colordark, step) {

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
    if (material.craziness) polygon.craziness(material.craziness);
    this.ctx.beginPath();
    
    if (material.radius) polygon.drawRound(this.ctx, material.radius);
    else  polygon.draw(this.ctx);

    this.ctx.globalCompositeOperation = 'source-atop';
    
    this.drawGroundLines(this.ctx, 0, 0, width, height, scale, colordark, step);
    this.drawGroundStones(this.ctx, 0, 0, width, height, scale, color, colordark);

    this.ctx.globalCompositeOperation = 'source-over';
    
    var img = new Image(this.canvas, 0, 0, width, height);
    img.draw(ctx, x, y, width, height);
}

ItemMaterialGround.prototype.drawGroundLines = function(ctx, x, y, width, height, scale, color, step) {
    ctx.strokeStyle = color;
    ctx.lineWidth = .2 * scale;
    var wstep = 20;
    if (height <= step) step = height / 2;
    var amp = random(0, 10);
    var inc = 1;
    var p = new Polyline();
    for (var i = step; i < height; i+= step) {
        var s = i * scale;
        p.points.length = 0;
        p.addPoint(new Point(x, y + s));
        for (var ii = 0; ii < width; ii += wstep) {
            amp+= inc;
            if (amp > 10) inc = -1;
            else if (amp < 0) inc = 1;
            p.addPoint(new Point(x + ii, y + s + amp));
        }
        ctx.beginPath();
        p.draw(ctx);
    }
}

ItemMaterialGround.prototype.drawGroundStones = function(ctx, x, y, width, height, scale, color, darkcolor) {
    var amt = height / 4;
    if (amt < 30) amt = 30;
    var max = 3;
    var tot = random(0, max);
    var double = false;
    for (var i = 0; i < tot; i++) {
        var cx = random(x, x + (width - amt));
        var cy = random(y, y + (height - amt));
        var cw = random(amt / 2, amt);
        var ch = cw;
        this.drawGroundStone(ctx, cx, cy, cw, ch, scale, color, darkcolor);
        var dd = random (1, 5);
        if (dd < 3 && !double) {
            var hcw = cw / 1.3;
            var hch = ch / 1.3;
            this.drawGroundStone(ctx, cx + hcw, cy + hch, cw / 2, ch / 2, scale, color, darkcolor);
            double = true;
        }
    }
}

ItemMaterialGround.prototype.drawGroundStone = function(ctx, x, y, width, height, scale, color, darkcolor) {
    var poly = new Polygon();
    var amt = width / 5;
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
    var weight = .2 * scale;
    ctx.fillStyle = color;
    var rad = 5 * scale;
    ctx.beginPath();
    poly.drawRound(ctx, rad);
    ctx.beginPath();
    poly.drawOutlineRound(ctx, rad, darkcolor, weight);
}