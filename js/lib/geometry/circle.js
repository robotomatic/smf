"use strict";

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

Circle.prototype.path = function(gamecanvas) {
    gamecanvas.arc(this.x, this.y, this.radius, 0, 2 * MATH_PI, false);
    gamecanvas.closePath();
}

Circle.prototype.draw = function(gamecanvas) {
    this.path(gamecanvas);
    gamecanvas.fill();    
}

Circle.prototype.drawOutline = function(gamecanvas, color, weight, opacity, scale) {
    this.path(gamecanvas);
    gamecanvas.setLineCap("round");
    gamecanvas.setStrokeStyle(color);
    if (opacity) gamecanvas.setAlpha(opacity);
    weight = scale ? weight * scale : weight;
    gamecanvas.setLineWidth(weight ? weight : .2);
    gamecanvas.stroke();            
    if (opacity) gamecanvas.setAlpha(1);
}

Circle.prototype.drawEllipse = function(gamecanvas, w, h) {
    var kappa = .5522848;
    var ox = (w / 2) * kappa;
    var oy = (h / 2) * kappa;
    
    var x = this.x - w / 2;
    var y = this.y - h / 2;
    
    var xe = x + w;
    var ye = y + h;
    var xm = x + w / 2;
    var ym = y + h / 2;
    gamecanvas.beginPath();
    gamecanvas.moveTo(x, ym);
    gamecanvas.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    gamecanvas.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    gamecanvas.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    gamecanvas.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    gamecanvas.fill();
}