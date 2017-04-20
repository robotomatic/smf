"use strict"

function Points(points) {
    this.points = new Array();
    if (points) this.setPoints(points);
}

Points.prototype.setPoints = function(points) {
    this.points.length = 0;
    for (var i = 0; i < points.length; i++) {
        this.addPoint(points[i]);
    }
}




Points.prototype.updatePoints = function(points) {
    if (!points || !points.length) return;
    for (var i = 0; i < points.length; i++) this.updatePoint(i, points[i]);
}

Points.prototype.updatePoint = function(index, point) {
    if (!point) return;
    this.updatePointXY(index, point.x, point.y, point.z, point.info);
}

Points.prototype.updatePointXY = function(index, x, y, z, info = null) {
    if (!this.points[index]) {
        this.points[index] = new Point(x, y, z, info);
    } else {
        this.points[index].x = x;
        this.points[index].y = y;
        this.points[index].z = z;
        this.points[index].info = info;
    }
}






Points.prototype.addPoints = function(points) {
    if (!points || !points.length) return;
    for (var i = 0; i < points.length; i++) this.addPoint(points[i]);
}

Points.prototype.addPoint = function(point) {
    if (!point) return;
    this.addPointXY(point.x, point.y, point.z, point.info);
}

Points.prototype.addPointXY = function(x, y, z, info = null) {
    var ok = true;
    var t = this.points.length;
    for (var i = 0; i < t; i++) {
        var p = this.points[i];
        var d = distance(p.x, p.y, x, y);
        if (d == 0) {
            ok = false;
            break;
        }
    }
    if (!ok) return;
    var p = geometryfactory.getPoint(x, y, z, info);
    this.points[this.points.length] = p;
}
