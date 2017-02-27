"use strict";

function GeometryFactory() {

    this.points = new Array();
    this.pointnum = -1;
    this.pointtot = 100000;
    
    this.lines = new Array();
    this.linenum = -1;
    this.linetot = 10000;
    
    this.circles = new Array();
    this.circlenum = -1;
    this.circletot = 10000;
    
    this.triangles = new Array();
    this.trianglenum = -1;
    this.triangletot = 10000;
    
    this.rects = new Array();
    this.rectnum = -1;
    this.recttot = 10000;
    
    this.polylines = new Array();
    this.polylinenum = -1;
    this.polylinetot = 10000;
    
    this.polys = new Array();
    this.polynum = -1;
    this.polytot = 10000;
    
    this.texts = new Array();
    this.textenum = -1;
    this.texttot = 10000;
}

GeometryFactory.prototype.init = function() {
    for (var i = 0; i < this.pointtot; i++) this.points.push(new Point(0, 0));
    for (var i = 0; i < this.linetot; i++) this.lines.push(new Line(new Point(0, 0), new Point(0, 0)));
    for (var i = 0; i < this.circletot; i++) this.circles.push(new Circle(0, 0, 0));
    for (var i = 0; i < this.triangletot; i++) this.triangles.push(new Triangle(0, 0, 0, 0, null));
    for (var i = 0; i < this.recttot; i++) this.rects.push(new Rectangle(0, 0, 0, 0));
    for (var i = 0; i < this.polylinetot; i++) {
        var p = new Polyline();
        p.factory = true;
        this.polylines.push(p);
    }
    for (var i = 0; i < this.polytot; i++) {
        var p = new Polygon();
        p.factory = true;
        this.polys.push(p);
    }
    for (var i = 0; i < this.texttot; i++) this.texts.push(new Text(0, 0, ""));
}

GeometryFactory.prototype.reset = function() {
    this.pointnum = -1;
    this.linenum = -1;
    this.circlenum = -1;
    this.trianglenum = -1;
    this.rectnum = -1;
    this.polylinenum = -1;
    this.polynum = -1;
    this.textnum = -1;
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
}

GeometryFactory.prototype.getCircle = function(x, y, radius) {
    this.circlenum++;
    if (this.circlenum >= this.circletot) {
        console.log("Circle == " + this.circlenum)
        this.circlenum = 0;
    }
    this.circles[this.circlenum].x = x;
    this.circles[this.circlenum].y = y;
    this.circles[this.circlenum].redius = radius;
    return this.circles[this.circlenum];
}

GeometryFactory.prototype.getTriangle = function(x, y, width, height, info) {
    this.trianglenum++;
    if (this.trianglenum >= this.triangletot) {
        console.log("Triangle == " + this.trianglenum)
        this.trianglenum = 0;
    }
    this.triangles[this.trianglenum].x = x;
    this.triangles[this.trianglenum].y = y;
    this.triangles[this.trianglenum].width = width;
    this.triangles[this.trianglenum].height = height;
    this.triangles[this.trianglenum].info = info;
    return this.triangles[this.trianglenum];
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
}

GeometryFactory.prototype.getPolyline = function() {
    this.polylinenum++;
    if (this.polylinenum >= this.polylinetot) {
        console.log("Polyline == " + this.polylinenum)
        this.polylinenum = 0;
    }
    this.polylines[this.polylinenum].points.length = 0;
    return this.polylines[this.polylinenum];
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
}

GeometryFactory.prototype.getText = function(x, y, text) {
    this.textnum++;
    if (this.textnum >= this.texttot) {
        console.log("Text == " + this.textnum)
        this.textnum = 0;
    }
    this.texts[this.textnum].x = x;
    this.texts[this.textnum].y = y;
    this.texts[this.textnum].text = text;
    return this.texts[this.textnum];
}


var geometryfactory = new GeometryFactory();        
geometryfactory.init();
