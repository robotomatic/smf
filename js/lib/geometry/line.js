"use strict";

function Line(start, end) {
    this.start = start ? start : new Point(0, 0);
    this.end = end ? end : new Point(0, 0);
    this.points = [this.start, this.end];
    this.mbr = null;
}

Line.prototype.getPoints = function() {
    return this.points;
}


Line.prototype.scale = function(scale) {
    var d = this.length() * scale;
    var a = this.angle() * (MATH_PI / 180);
    this.end.x = this.start.x + d * cos(a);
    this.end.y = this.start.y + d * sin(a);
}



Line.prototype.translate = function(x, y, scale) {
    this.start.x = x + (this.start.x * scale)
    this.start.y = y + (this.start.y * scale);
    this.end.x = x + (this.end.x * scale);
    this.end.y = y + (this.end.y * scale);
}

Line.prototype.normalize = function() {
    var startx;
    var starty;
    var endx;
    var endy;
    if (this.start.x <= this.end.x) {
        startx = this.start.x;
        endx = this.end.x;
    } else {
        startx = this.end.x;
        endx = this.start.x;
    }
    if (this.start.y <= this.end.y) {
        starty = this.start.y;
        endy = this.end.y;
    } else {
        starty = this.end.y;
        endy = this.start.y;
    }
    this.start.x = startx;
    this.start.y = starty;
    this.end.x = endx;
    this.end.y = endy;
    return this;
}

Line.prototype.getMbr = function() {
    var normal = this.normalize();
    if (!this.mbr) this.mbr = new Rectangle(0, 0, 0, 0);
    this.mbr.x = normal.start;
    this.mbr.y = normal.end;
    this.mbr.width = normal.end.x - normal.start.x;
    this.mbr.height = normal.end.y - normal.start.y;
    return this.mbr;
}

Line.prototype.width = function() {
    var normal = this.normalize();
    return normal.end.x - normal.start.x;
}

Line.prototype.height = function() {
    var normal = this.normalize();
    return normal.end.y - normal.start.y;
}

Line.prototype.angle = function() {
    return angleDegrees(this.start, this.end);
}

Line.prototype.length = function() {
    return distance(this.start.x, this.start.y, this.end.x, this.end.y);    
}

Line.prototype.rotate = function(deg) {
    deg += this.angle();
    var a = deg * (MATH_PI / 180);
    var d = this.length();
    var nx = this.start.x + d * cos(a);
    var ny = this.start.y + d * sin(a);
    this.end.x = nx;
    this.end.y = ny;
    return this;
}


Line.prototype.path = function(gamecanvas) {
    gamecanvas.moveTo(this.start.x, this.start.y);
    gamecanvas.lineTo(this.end.x, this.end.y);
}

Line.prototype.draw = function(gamecanvas, color, weight) {
    this.path(gamecanvas);
    gamecanvas.setLineCap("round");
    gamecanvas.setStrokeStyle(color);
    gamecanvas.setLineWidth(weight ? weight : .2);
    gamecanvas.stroke();            
}