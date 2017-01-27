"use strict";

function Text(x, y, message) {
    this.x = x;
    this.y = y;
    this.message = message;
}


Text.prototype.draw = function(ctx) {
    var lines = this.message.split("\n");
    ctx.strokeStyle = "";
    var fontsize = 15;
    ctx.font = fontsize + "px Arial";
    for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], this.x, this.y + (i * fontsize));
}