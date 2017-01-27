"use strict";

function ItemMaterialRock() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemMaterialRock.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale, drawdetails, ox, oy) {

    y -= 2 * scale;
    height += 2 * scale;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    var color = material.color.light;
    var shadow = material.color.dark;
    
    if (color.gradient) {
        var g = this.ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, color.gradient.start);
        g.addColorStop(1, color.gradient.stop);
        color = g;
    }
    
    this.ctx.fillStyle = color;
    
    polygon.translate(-x, -y);
    this.ctx.beginPath();
    polygon.drawRound(this.ctx, material.radius);
    
    this.ctx.globalCompositeOperation = 'source-atop';
    this.drawLines(this.ctx, width, height, scale, shadow);
    this.ctx.globalCompositeOperation = 'source-over';
    
    var img = new Image(this.canvas, 0, 0, width, height);
    img.draw(ctx, x, y, width, height);
}

ItemMaterialRock.prototype.drawLines = function(ctx, width, height, scale, color) {

    ctx.save();
    
    var rh = height * .3;
    var rw = width * 3;
    var rx = -width;
    var ry = -rh / 2;
    
    var a = random(0, 10);
    var dx = rx + rw / 2;
    var dy = ry + rh / 2;
    ctx.translate(dx, dy);
    
    var rad = a * Math.PI / 180;
    ctx.rotate(rad);
    rx = -rw / 2;
    ry = -rh / 2;

    var lw = .2 * scale;
    
    ctx.beginPath();
    
    var rpoly = new Polygon();
    var rps = new Array();
    
    rps[0] = new Point(rx, ry);
    rps[1] = new Point(rx + rw, ry);
    rps[2] = new Point(rx + rw, ry + rh);
    rps[3] = new Point(rx, ry +rh);
    rpoly.setPoints(rps);
    rpoly.craziness(2);
    rpoly.drawOutlineRound(ctx, 2, color, lw);
    
    var amt = random(2, 10);
    
    rpoly.translate(0, amt, 1);
    rpoly.drawOutlineRound(ctx, 2, color, lw);
    
    ctx.restore();
    
}