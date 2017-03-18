"use strict";

function Text(x, y, message) {
    this.x = x;
    this.y = y;
    this.message = message;
}


Text.prototype.draw = function(gamecanvas, size) {
    var lines = this.message.split("\n");
    gamecanvas.setStrokeStyle("");
    var fontsize = size ? size : 15;
    gamecanvas.setFont(fontsize + "px Arial");
    var tx = round(this.x);
    for (var i = 0; i < lines.length; i++) {
        var ty = round(this.y + (i * fontsize));
        gamecanvas.fillText(lines[i], tx, ty);
    }
}