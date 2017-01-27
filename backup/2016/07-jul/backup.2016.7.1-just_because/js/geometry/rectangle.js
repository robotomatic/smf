"use strict";

function Rectangle(x, y, width, height, angle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.points = new Array(4);
    this.polygon = new Polygon();
}

Rectangle.prototype.reset = function() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.angle = 0;
}

Rectangle.prototype.translate = function(x, y, scale) {
    scale = scale || 1;
    this.x = x + (this.x * scale);
    this.y = y + (this.y * scale);
}

Rectangle.prototype.pad = function(width, height) {
    height = height ? height : width;
    var hw = width / 2;
    var hh = height  / 2;
    this.x -= hw;
    this.y -= hh;
    this.width += width;
    this.height += height;
}

Rectangle.prototype.getMbr = function() {
    var minx;
    var miny;
    var maxx;
    var maxy;
    var points = this.getPoints();
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var px = p.x;
        var py = p.y;
        if (!minx || px < minx) minx = px;
        if (!maxx || px > maxx) maxx = px;
        if (!miny || py < miny) miny = py;
        if (!maxy || py > maxy) maxy = py;
    }
    var w = maxx - minx;
    var h = maxy - miny;
    return new Rectangle(minx, miny, w, h);
}

Rectangle.prototype.getCenter = function() {
    var mbr = this.getMbr();
    return new Point(mbr.x + (mbr.width / 2), mbr.y + (mbr.height / 2));
}

Rectangle.prototype.getPoints = function() {
    this.points[0] = new Point(this.x, this.y);
    this.points[1] = new Point(this.x + this.width, this.y);
    this.points[2] = new Point(this.x + this.width, this.y + this.height);
    this.points[3] = new Point(this.x, this.y + this.height);
    return this.points;
}

Rectangle.prototype.getLines = function() {
    var points = this.getPoints();
    var lines = new Array();
    lines[0] = new Line(points[0], points[1]);
    lines[1] = new Line(points[1], points[2]);
    lines[2] = new Line(points[2], points[3]);
    lines[3] = new Line(points[3], points[0]);
    return lines;
}

Rectangle.prototype.rotate = function(deg, cp) {
    var center = cp ? cp : this.getCenter();
    var points = this.getPoints();
    var out = new Array();
    var l;
    l = new Line(center, points[0]);
    l = l.rotate(deg);
    out[0] = l.end;
    l = new Line(center, points[1]);
    l = l.rotate(deg);
    out[1] = l.end;
    l = new Line(center, points[2]);
    l = l.rotate(deg);
    out[2] = l.end;
    l = new Line(center, points[3]);
    l = l.rotate(deg);
    out[3] = l.end;
    return out;
}

Rectangle.prototype.contains = function(point) {
    if (this.x >= point.x || this.x + this.width <= point.x ) return false;
    if (this.y >= point.y || this.y + this.height <= point.y ) return false;
    return true;
}

Rectangle.prototype.draw = function(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height); 
}

Rectangle.prototype.drawOutline = function(ctx, color, weight) {
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);            
}

Rectangle.prototype.drawRound = function(ctx) {
    this.polygon.setPoints(this.getPoints());
    this.polygon.drawRound(ctx);
}

Rectangle.prototype.drawSmooth = function(ctx) {
    this.polygon.setPoints(this.getPoints());
    this.polygon.drawSmooth(ctx);
}