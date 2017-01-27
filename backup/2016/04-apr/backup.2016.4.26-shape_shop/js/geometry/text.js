"use strict";

function Text(x, y, message) {
    this.x = x;
    this.y = y;
    this.message = message;
}


Text.prototype.draw = function(ctx) {
    drawText(ctx, this.x, this.y, this.message);
}