"use strict";

function Point(x, y, z, info = null) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.info = info;
}

Point.prototype.setInfo = function(info) {
    this.info = info;
}

Point.prototype.update = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Point.prototype.path = function(gamecanvas, size = 5) {
    var ss = size / 2;
    gamecanvas.rect(this.x - ss, this.y - ss, size, size); 
}

Point.prototype.draw = function(gamecanvas, size = 5) {
    var ss = size / 2;
    gamecanvas.fillRect(this.x - ss, this.y - ss, size, size); 
}