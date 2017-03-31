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

Point.prototype.update = function(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.draw = function(gamecanvas, size) {
    var ss = size / 2;
    gamecanvas.fillRect(this.x - ss, this.y - ss, size, size); 
}