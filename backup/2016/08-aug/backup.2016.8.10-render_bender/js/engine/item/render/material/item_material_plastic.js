"use strict";

function ItemMaterialPlastic() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemMaterialPlastic.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {
    var mbr = polygon.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    this.drawPlastic(ctx, item, polygon, material, x, y, width, height, scale);
}
    
ItemMaterialPlastic.prototype.drawPlastic = function(ctx, item, polygon, material, x, y, width, height, scale) {

    this.canvas.width = width;
    this.canvas.height = height;
    
    var gy = y;
    var h = 400;
    var color;
    if (material.color.light.gradient) {
        var gradient = material.color.light.gradient;
        var g = ctx.createLinearGradient(0, gy, 0, h + gy);
        var start = gradient.start;
        var stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
    }
    this.ctx.fillStyle = color;

    polygon.translate(-x, -y);
    if (material.craziness) polygon.craziness(material.craziness);
    this.ctx.beginPath();
    
    if (material.radius) polygon.drawRound(this.ctx, material.radius);
    else  polygon.draw(this.ctx);
    
    var mbr = item.getMbr();

    this.ctx.globalCompositeOperation = 'source-atop';
    this.drawPlasticCels(this.ctx, material, 0, 0, mbr.width, mbr.height, scale);
    this.ctx.globalCompositeOperation = 'source-over';
    
    var img = new Image(this.canvas, 0, 0, width, height);
    img.draw(ctx, x, y, width, height);
}

ItemMaterialPlastic.prototype.drawPlasticCels = function(ctx, material, x, y, width, height, scale) {
    var cols = (width / material.cel.width) + 1; 
    var rows = (height / material.cel.height) + 1; 
    var cw = material.cel.width * scale;
    var ch = material.cel.height * scale;
    var cx = x; 
    var cy = y;
    for (var i = 0; i < rows; i++) {
        for (var ii = 0; ii < cols; ii++) {
            this.drawPlasticCel(ctx, material, cx, cy, cw, ch);
            cx += cw;
        }
        cx = (i % 2 === 0 ) ? x - (cw / 2) : x;
        cy += ch - (cw / 4);
    }
}


ItemMaterialPlastic.prototype.drawPlasticCel = function(ctx, material, x, y, w, h) {
    
    var poly = new Polygon();

    var hw = w / 2;
    var hh = w / 4;
    
    var p = new Point(0, 0);

    p.x = x + hw;
    p.y = y;
    poly.addPoint(p);

    p.x = x + w;
    p.y = y + hh;
    poly.addPoint(p);
    
    p.x = x + w;
    p.y = y + h - hh;
    poly.addPoint(p);

    p.x = x + hw;
    p.y = y + h;
    poly.addPoint(p);
    
    p.x = x;
    p.y = y + h - hh;
    poly.addPoint(p);

    p.x = x;
    p.y = y + hh;
    poly.addPoint(p);
    
    var lw = material.cel.lineweight;

    ctx.beginPath();
    poly.drawOutline(ctx, material.color.shadow, lw);

    if (material.cel.alternate.chance) {
        var rando = random(0, material.cel.alternate.chance);
        if (rando == 0) {
            ctx.fillStyle = material.cel.alternate.color;
            ctx.beginPath();
            poly.draw(ctx);
        }
    }

    var t = 1;
    poly.translate(t, t);
    
    ctx.beginPath();
    poly.drawOutline(ctx, material.color.hilight, lw);
}
