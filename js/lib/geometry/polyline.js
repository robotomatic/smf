"use strict";

function Polyline() {
    this.points = new Array();
    this.factory = false;
}

Polyline.prototype.x = function() {
    return this.points[0].x;
}

Polyline.prototype.y = function() {
    return this.points[0].y;
}

Polyline.prototype.width = function() {
    return this.points.length > 0 ? this.points[this.points.length - 1].x - this.points[0].x : 0;
}

Polyline.prototype.height = function() {
    return this.points.length > 0 ? this.points[this.points.length - 1].y - this.points[0].y : 0;
}

Polyline.prototype.addPoints = function(points) {
    for (var i = 0; i < points.length; i++) this.addPoint(points[i]);
}

Polyline.prototype.addPoint = function(point) {
//    this.points[this.points.length] = this.factory ? geometryfactory.getPoint(x, y, info) : new Point(x, y, info);
    this.points[this.points.length] = geometryfactory.getPoint(point.x, point.y, point.info);
}

Polyline.prototype.translate = function(x, y, scale) {
    scale = scale || 1;
    for (var i = 0; i < this.points.length; i++) {
        this.points[i].x = x + (this.points[i].x * scale);
        this.points[i].y = y + (this.points[i].y * scale);
    }
}

Polyline.prototype.draw = function(ctx, color, weight) {
    var points = this.points;
    if (points.length < 2) return;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}