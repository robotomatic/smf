"use strict";

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

Circle.prototype.path = function(ctx) {
    ctx.arc(this.x, this.y, this.radius, 0, 2 * MATH_PI, false);
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

Circle.prototype.drawEllipse = function(ctx, w, h) {
    var kappa = .5522848;
    var ox = (w / 2) * kappa;
    var oy = (h / 2) * kappa;
    
    var x = this.x - w / 2;
    var y = this.y - h / 2;
    
    var xe = x + w;
    var ye = y + h;
    var xm = x + w / 2;
    var ym = y + h / 2;
    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.fill();
}