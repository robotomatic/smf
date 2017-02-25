"use strict";

function GeometryFactory() {

    this.points = new Array();
    this.pointnum = -1;
    this.pointtot = 10000;
    
    this.lines = new Array();
    this.linenum = -1;
    this.linetot = 10000;
    
    this.rects = new Array();
    this.rectnum = -1;
    this.recttot = 10000;
    
    this.polys = new Array();
    this.polynum = -1;
    this.polytot = 10000;
    
}

GeometryFactory.prototype.init = function() {
    for (var i = 0; i < this.pointtot; i++) this.points.push(new Point(0, 0));
    for (var i = 0; i < this.linetot; i++) this.lines.push(new Line(new Point(0, 0), new Point(0, 0)));
    for (var i = 0; i < this.recttot; i++) this.rects.push(new Rectangle(0, 0, 0, 0));
    for (var i = 0; i < this.polytot; i++) {
        var p = new Polygon();
        p.factory = true;
        this.polys.push(p);
    }
}

GeometryFactory.prototype.reset = function() {
    this.pointnum = -1;
    this.linenum = -1;
    this.rectnum = -1;
    this.polynum = -1;
}

GeometryFactory.prototype.getPoint = function(x, y, info = null) {
    this.pointnum++;
    if (this.pointnum >= this.pointtot) {
        console.log("Point == " + this.pointnum)
        this.pointnum = 0;
    }
    this.points[this.pointnum].x = x;
    this.points[this.pointnum].y = y;
    this.points[this.pointnum].info = info;
    return this.points[this.pointnum];
//    return new Point(x, y, info);
}

GeometryFactory.prototype.getLine = function(p1, p2) {
    this.linenum++;
    if (this.linenum >= this.linetot) {
        console.log("Line == " + this.linenum)
        this.linenum = 0;
    }
    this.lines[this.linenum].start.x = p1 ? p1.x : 0;
    this.lines[this.linenum].start.y = p1 ? p1.y : 0;
    this.lines[this.linenum].end.x = p2 ? p2.x : 0;
    this.lines[this.linenum].end.y = p2 ? p2.y : 0;
    return this.lines[this.linenum];
//    return new Line(p1, p2);
}

GeometryFactory.prototype.getCircle = function(x, y, radius) {
    return new Circle(x, y, radius);
}

GeometryFactory.prototype.getTriangle = function(x, y, width, height, info) {
    return new Triangle(x, y, width, height, info);
}

GeometryFactory.prototype.getRectangle = function(x, y, width, height, angle) {
    this.rectnum++;
    if (this.rectnum >= this.recttot) {
        console.log("Rect == " + this.rectnum)
        this.rectnum = 0;
    }
    this.rects[this.rectnum].x = x;
    this.rects[this.rectnum].y = y;
    this.rects[this.rectnum].width = width;
    this.rects[this.rectnum].height = height;
    this.rects[this.rectnum].angle = angle;
    return this.rects[this.rectnum];
//    return new Rectangle(x, y, width, height, angle);
}

GeometryFactory.prototype.getPolyline = function() {
    return new Polyline();
}

GeometryFactory.prototype.getPolylines = function() {
    return new Polylines();
}

GeometryFactory.prototype.getPolygon = function(points) {
    this.polynum++;
    if (this.polynum >= this.polytot) {
        console.log("Poly == " + this.polynum)
        this.polynum = 0;
    }
    this.polys[this.polynum].points.length = 0;
    this.polys[this.polynum].setPoints(points);
    return this.polys[this.polynum];
//    return new Polygon(points);
}

GeometryFactory.prototype.getText = function(x, y, text) {
    return new Text(x, y, text);
}


var geometryfactory = new GeometryFactory();        
geometryfactory.init();
