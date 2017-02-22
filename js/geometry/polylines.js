"use strict";

function Polylines() {
    this.polylines = new Array();
}

Polylines.prototype.width = function() {
    var w = 0;
    for (var i = 0; i < this.polylines.length; i++) w += this.polylines[i].width;
    return w;
}

Polylines.prototype.height = function() {
    var h = 0;
    for (var i = 0; i < this.polylines.length; i++) h += this.polylines[i].height;
    return h;
}

Polylines.prototype.translate = function(x, y, scale) {
    scale = scale || 1;
    for (var i = 0; i < this.polylines.length; i++) {
        this.polylines[i].translate(x, y, scale);
    }
}

Polylines.prototype.createPolylines = function(lines) {
    var current = null;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var sp = line.start;
        var ep = line.end;
        if (!current) {
            current = new Polyline();
            current.addPoint(sp)
            current.addPoint(ep)
        } else {
            var cp = current.points[current.points.length - 1];
            var l = new Line(cp, sp);
            var d = l.length();
            if (d < 2) {
                current.addPoint(ep);
            } else {
                var p = new Polyline();
                p.addPoints(current.points);
                this.polylines[this.polylines.length] = p;
                current = new Polyline();
                current.addPoint(sp);
                current.addPoint(ep);
            }
        }
    }
    if (current && current.points) {
        var p = new Polyline();
        p.addPoints(current.points);
        this.polylines[this.polylines.length] = p;
    }
}

Polylines.prototype.draw = function(ctx, color, weight) {
    for (var i = 0; i < this.polylines.length; i++) this.polylines[i].draw(ctx, color, weight);
}

