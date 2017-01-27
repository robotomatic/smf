"use strict";

function Image(data, x, y, width, height) {
    this.data = data;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}


Image.prototype.draw = function(ctx, dx, dy, dw, dh) {
    if (dx) ctx.drawImage(this.data, this.x, this.y, this.width, this.height, dx, dy, dw, dh);
    else ctx.drawImage(this.data, this.x, this.y, this.width, this.height);
}