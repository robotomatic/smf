"use strict";

function ItemMaterialRock() {
}

ItemMaterialRock.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {

    var color = material.color.light;
    var shadow = material.color.dark;
    
    if (color.gradient) {
        var g = ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, color.gradient.start);
        g.addColorStop(1, color.gradient.stop);
        color = g;
    }
    
    ctx.fillStyle = color;
    ctx.beginPath();
    polygon.drawRound(ctx, material.radius);
    
    ctx.globalCompositeOperation = 'source-atop';
    this.drawLines(ctx, x, y, width, height, scale, shadow);
    ctx.globalCompositeOperation = 'source-over';
}

ItemMaterialRock.prototype.drawLines = function(ctx, x, y, width, height, scale, color) {

    var l = new Line();
    
    var px = x;
    var py = y;
    
    var lt = random(5, 7);
    
    l.start.x = px;
    l.start.y = py + lt;

    var a = random(1, 5);
    
    l.end.x = px + width;
    l.end.y = l.start.y + a;
    
    ctx.beginPath();
    l.path(ctx);
    
    var d = random(3, 5);
    l.start.y += d;
    l.end.y += d;
    var da = random(-2, 2);
    l.end.y += da;
    l.path(ctx);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    ctx.stroke();
    
    
}