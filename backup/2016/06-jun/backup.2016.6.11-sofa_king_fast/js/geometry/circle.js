"use strict";

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

Circle.prototype.path = function(ctx) {
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.closePath();
}

Circle.prototype.draw = function(ctx) {
    this.path(ctx);
    ctx.fill();    
}

Circle.prototype.drawOutline = function(ctx, color, weight, opacity, scale) {
    this.path(ctx);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}