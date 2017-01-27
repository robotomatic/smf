"use strict";

function Rectangle(x, y, width, height, angle) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.width = width;
    this.height = height;
    this.angle = angle;

    this.center = new Point(0, 0);
    this.mbr = null;
    this.polygon = null;
    
    this.points = new Array(
        new Point(0, 0),
        new Point(0, 0),
        new Point(0, 0),
        new Point(0, 0)
    );
    
    this.tempPoints = new Array(
        new Point(0, 0),
        new Point(0, 0),
        new Point(0, 0),
        new Point(0, 0)
    );
    
    this.lines = new Array(
        new Line(0, 0),
        new Line(0, 0),
        new Line(0, 0),
        new Line(0, 0)
    );

    this.tempLine = new Line(0, 0);
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
    var minx = this.x;
    var miny = this.y;
    var maxx = this.x;
    var maxy = this.y;
    var points = this.getPoints();
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var px = p.x;
        var py = p.y;
        if (px < minx) minx = px;
        if (px > maxx) maxx = px;
        if (py < miny) miny = py;
        if (py > maxy) maxy = py;
    }
    var w = maxx - minx;
    var h = maxy - miny;

    if (!this.mbr) this.mbr = new Rectangle(0, 0, 0, 0);
    this.mbr.x = minx;
    this.mbr.y = miny;
    this.mbr.width = w;
    this.mbr.height = h;
    return this.mbr;
}

Rectangle.prototype.getCenter = function() {
    var mbr = this.getMbr();
    this.center.x = mbr.x + (mbr.width / 2);
    this.center.y = mbr.y + (mbr.height / 2);
    return this.center;
}

Rectangle.prototype.getPoints = function() {
    this.points[0].x = this.x;
    this.points[0].y = this.y;
    this.points[1].x = this.x + this.width;
    this.points[1].y = this.y;
    this.points[2].x = this.x + this.width;
    this.points[2].y = this.y + this.height;
    this.points[3].x = this.x;
    this.points[3].y = this.y + this.height;
    return this.points;
}

Rectangle.prototype.getLines = function() {
    var points = this.getPoints();
    this.lines[0].start = points[0];
    this.lines[0].end = points[1];
    this.lines[1].start = points[1];
    this.lines[1].end = points[2];
    this.lines[2].start = points[2];
    this.lines[2].end = points[3];
    this.lines[3].start = points[3];
    this.lines[3].end = points[0];
    return this.lines;
}

Rectangle.prototype.rotate = function(deg, cp) {
    var center = cp ? cp : this.getCenter();
    var points = this.getPoints();

    this.tempLine.start = center;
    this.tempLine.end = points[0];
    this.tempLine = this.tempLine.rotate(deg);
    this.tempPoints[0] = this.tempLine.end;
    
    this.tempLine.start = center;
    this.tempLine.end = points[1];
    this.tempLine = this.tempLine.rotate(deg);
    this.tempPoints[1] = this.tempLine.end;

    this.tempLine.start = center;
    this.tempLine.end = points[2];
    this.tempLine = this.tempLine.rotate(deg);
    this.tempPoints[2] = this.tempLine.end;
    
    this.tempLine.start = center;
    this.tempLine.end = points[3];
    this.tempLine = this.tempLine.rotate(deg);
    this.tempPoints[3] = this.tempLine.end;
    
    return this.tempPoints;
}

Rectangle.prototype.contains = function(point) {
    if (this.x >= point.x || this.x + this.width <= point.x ) return false;
    if (this.y >= point.y || this.y + this.height <= point.y ) return false;
    return true;
}

Rectangle.prototype.path = function(ctx) {
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x, this.y);
}

Rectangle.prototype.draw = function(ctx) {
    this.path(ctx);
    ctx.fill();
}

Rectangle.prototype.drawOutline = function(ctx, color, weight) {
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);            
}

Rectangle.prototype.drawRound = function(ctx) {
    if (!this.polygon) this.polygon = new Polygon();
    this.polygon.setPoints(this.getPoints());
    this.polygon.drawRound(ctx);
}

Rectangle.prototype.drawSmooth = function(ctx) {
    if (!this.polygon) this.polygon = new Polygon();
    this.polygon.setPoints(this.getPoints());
    this.polygon.drawSmooth(ctx);
}