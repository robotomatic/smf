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
    this.points[this.points.length] = geometryfactory.getPoint(point.x, point.y, point.z, point.info);
}

Polyline.prototype.translate = function(x, y, scale) {
    scale = scale || 1;
    for (var i = 0; i < this.points.length; i++) {
        this.points[i].x = x + (this.points[i].x * scale);
        this.points[i].y = y + (this.points[i].y * scale);
    }
}

Polyline.prototype.draw = function(gamecanvas, color, weight) {
    var points = this.points;
    if (points.length < 2) return;
    gamecanvas.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) gamecanvas.lineTo(points[i].x, points[i].y);
    gamecanvas.setLineCap("round");            
    gamecanvas.setStrokeStyle(color);
    gamecanvas.setLineWidth(weight ? weight : .2);
    gamecanvas.stroke();            
}