"use strict";

function Text(x, y, message) {
    this.x = x;
    this.y = y;
    this.message = message;
}


Text.prototype.draw = function(ctx, size) {
    var lines = this.message.split("\n");
    ctx.strokeStyle = "";
    var fontsize = size ? size : 15;
    ctx.font = fontsize + "px Arial";
    var tx = round(this.x);
    for (var i = 0; i < lines.length; i++) {
        var ty = round(this.y + (i * fontsize));
        ctx.fillText(lines[i], tx, ty);
    }
}