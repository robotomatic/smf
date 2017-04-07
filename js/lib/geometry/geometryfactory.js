"use strict";

function GeometryFactory() {
    
    this.factory = true;
    this.ready = false;

    this.points = new Array();
    this.pointnum = -1;
    this.pointtot = 20000;
    this.pointmax = 0;
    
    this.lines = new Array();
    this.linenum = -1;
    this.linetot = 10000;
    this.linemax = 0;
    
    this.circles = new Array();
    this.circlenum = -1;
    this.circletot = 10000;
    this.circlemax = 0;
    
    this.triangles = new Array();
    this.trianglenum = -1;
    this.triangletot = 10000;
    this.trianglemax = 0;
    
    this.rects = new Array();
    this.rectnum = -1;
    this.recttot = 10000;
    this.rectmax = 0;
    
    this.polylines = new Array();
    this.polylinenum = -1;
    this.polylinetot = 10000;
    this.polylinemax = 0;
    
    this.polys = new Array();
    this.polynum = -1;
    this.polytot = 10000;
    this.polymax = 0;
    
    this.texts = new Array();
    this.textenum = -1;
    this.texttot = 10000;
    this.textmax = 0;
}

GeometryFactory.prototype.init = function() {
    if (!this.factory) return;
    benchmark("geometry factory - start", "gf");
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
    this.ready = true;
    benchmark("geometry factory - end", "gf");
}

GeometryFactory.prototype.reset = function() {
    if (!this.factory) return;
    if (!this.ready) {
        this.init();
        return;
    }
    if (this.pointmax > this.pointtot) logDev("Point Max:" + this.pointmax);
    this.pointnum = -1;
    this.pointmax = -1;
    
    if (this.linemax > this.linetot) logDev("Line Max: " + this.linemax);
    this.linenum = -1;
    this.linemax = -1;
    
    if (this.circlemax > this.circletot) logDev("Circle Max:" + this.circlemax);
    this.circlenum = -1;
    this.circlemax = -1;
    
    if (this.trianglemax > this.triangletot) logDev("Triangle Max:" + this.trianglemax);
    this.trianglenum = -1;
    this.trianglemax = -1;
    
    if (this.rectmax > this.recttot) logDev("Rectangle Max:" + this.rectmax);
    this.rectnum = -1;
    this.rectmax = -1;
    
    if (this.polylinemax > this.polylinetot) logDev("POlyline Max:" + this.polylinemax);
    this.polylinenum = -1;
    this.polylinemax = -1;
    
    if (this.polymax > this.polytot) logDev("POlygone Max:" + this.polymax);
    this.polynum = -1;
    this.polymax = -1;
    
    if (this.textmax > this.texttot) logDev("Text Max:" + this.textmax);
    this.textnum = -1;
    this.textmax = -1;
}

GeometryFactory.prototype.getPoint = function(x, y, info = null) {
    if (!this.factory) return new Point(x, y, info);
    this.pointnum++;
    this.pointmax++;
    if (this.pointnum >= this.pointtot) {
        logDev("Point == " + this.pointnum)
        this.pointnum = 0;
    }
    this.points[this.pointnum].x = x;
    this.points[this.pointnum].y = y;
    this.points[this.pointnum].info = info;
    return this.points[this.pointnum];
}

GeometryFactory.prototype.getLine = function(p1, p2) {
    if (!this.factory) return new Line(p1, p2);
    this.linenum++;
    this.linemax++;
    if (this.linenum >= this.linetot) {
        logDev("Line == " + this.linenum)
        this.linenum = 0;
    }
    this.lines[this.linenum].start.x = p1 ? p1.x : 0;
    this.lines[this.linenum].start.y = p1 ? p1.y : 0;
    this.lines[this.linenum].end.x = p2 ? p2.x : 0;
    this.lines[this.linenum].end.y = p2 ? p2.y : 0;
    return this.lines[this.linenum];
}

GeometryFactory.prototype.getCircle = function(x, y, radius) {
    if (!this.factory) return new Circle(x, y, radius);
    this.circlenum++;
    this.circlemax++;
    if (this.circlenum >= this.circletot) {
        logDev("Circle == " + this.circlenum)
        this.circlenum = 0;
    }
    this.circles[this.circlenum].x = x;
    this.circles[this.circlenum].y = y;
    this.circles[this.circlenum].radius = radius;
    return this.circles[this.circlenum];
}

GeometryFactory.prototype.getTriangle = function(x, y, width, height, info) {
    if (!this.factory) return new Triangle(x, y, width, height, info);
    this.trianglenum++;
    this.trianglemax++;
    if (this.trianglenum >= this.triangletot) {
        logDev("Triangle == " + this.trianglenum)
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
    if (!this.factory) return new Rectangle(x, y, width, height, angle);
    this.rectnum++;
    this.rectmax++;
    if (this.rectnum >= this.recttot) {
        logDev("Rect == " + this.rectnum)
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
    if (!this.factory) return new Polyline();
    this.polylinenum++;
    this.polylinemax++;
    if (this.polylinenum >= this.polylinetot) {
        logDev("Polyline == " + this.polylinenum)
        this.polylinenum = 0;
    }
    this.polylines[this.polylinenum].points.length = 0;
    return this.polylines[this.polylinenum];
}

GeometryFactory.prototype.getPolygon = function(points) {
    if (!this.factory) return new Polygon(points);
    this.polynum++;
    this.polymax++;
    if (this.polynum >= this.polytot) {
        logDev("Poly == " + this.polynum)
        this.polynum = 0;
    }
    this.polys[this.polynum].points.length = 0;
    this.polys[this.polynum].setPoints(points);
    return this.polys[this.polynum];
}

GeometryFactory.prototype.getText = function(x, y, text) {
    if (!this.factory) return new Text(x, y, text);
    this.textnum++;
    this.textmax++;
    if (this.textnum >= this.texttot) {
        logDev("Text == " + this.textnum)
        this.textnum = 0;
    }
    this.texts[this.textnum].x = x;
    this.texts[this.textnum].y = y;
    this.texts[this.textnum].text = text;
    return this.texts[this.textnum];
}


var geometryfactory = new GeometryFactory();        
geometryfactory.init();