"use strict";

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.info = null;
}

Point.prototype.setInfo = function(info) {
    this.info = info;
}

Point.prototype.draw = function(ctx, color, size) {
    ctx.fillStyle = color;
    drawRect(ctx, this.x - (size / 2), this.y - (size / 2), size, size, 1);
}