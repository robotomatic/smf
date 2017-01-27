"use strict";

function Point(x, y, info = null) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.info = info;
}

Point.prototype.setInfo = function(info) {
    this.info = info;
}

Point.prototype.draw = function(ctx, size) {
    var ss = size / 2;
    ctx.fillRect(this.x - ss, this.y - ss, size, size); 
}