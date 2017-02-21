"use strict";

function GeometryFactory() {
    
}

GeometryFactory.prototype.getPoint = function(x, y, info) {
    return new Point(x, y, info);
}

GeometryFactory.prototype.getLine = function(p1, p2) {
    return new Line(p1, p2);
}

GeometryFactory.prototype.getCircle = function(x, y, radius) {
    return new Circle(x, y, radius);
}

GeometryFactory.prototype.getTriangle = function(x, y, width, height, info) {
    return new Triangle(x, y, width, height, info);
}

GeometryFactory.prototype.getRectangle = function(x, y, width, height, angle) {
    return new Rectangle(x, y, width, height, angle);
}

GeometryFactory.prototype.getPolyline = function() {
    return new Polyline();
}

GeometryFactory.prototype.getPolylines = function() {
    return new Polylines();
}

GeometryFactory.prototype.getPolygon = function(points) {
    return new Polygon(points);
}

GeometryFactory.prototype.getText = function(x, y, text) {
    return new Text(x, y, text);
}





var geometryfactory = new GeometryFactory();
