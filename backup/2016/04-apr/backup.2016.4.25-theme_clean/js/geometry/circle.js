"use strict";

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}


Circle.prototype.draw = function(ctx) {
    drawCircle(ctx, this.x, this.y, this.radius);
}