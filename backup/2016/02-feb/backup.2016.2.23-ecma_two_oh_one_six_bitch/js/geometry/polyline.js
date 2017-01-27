"use strict";

function Polyline() {
    this.points = new Array();
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
    for (let i = 0; i < points.length; i++) this.addPoint(points[i]);
}

Polyline.prototype.addPoint = function(point) {
    this.points[this.points.length] = new Point(point.x, point.y);
}

Polyline.prototype.draw = function(ctx, color, weight) {
    drawPolyline(ctx, this, color, weight);
}