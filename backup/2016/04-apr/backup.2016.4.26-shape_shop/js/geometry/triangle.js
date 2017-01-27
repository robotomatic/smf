"use strict";

function Triangle(x, y, width, height, info) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.info = info;
}


Triangle.prototype.draw = function(ctx) {
    drawTriangle(ctx, this.info, this.x, this.y, this.width, this.height);
}