"use strict";

function Polylines() {
    this.polylines = new Array();
}

Polylines.prototype.width = function() {
    let w = 0;
    for (let i = 0; i < this.polylines.length; i++) w += this.polylines[i].width;
    return w;
}

Polylines.prototype.height = function() {
    let h = 0;
    for (let i = 0; i < this.polylines.length; i++) h += this.polylines[i].height;
    return h;
}

Polylines.prototype.createPolylines = function(lines) {
    let current = null;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let sp = line.start;
        let ep = line.end;
        if (!current) {
            current = new Polyline();
            current.addPoint(sp)
            current.addPoint(ep)
        } else {
            let cp = current.points[current.points.length - 1];
            let l = new Line(cp, sp);
            let d = l.length();
            if (d < 2) {
                current.addPoint(ep);
            } else {
                let p = new Polyline();
                p.addPoints(current.points);
                this.polylines[this.polylines.length] = p;
                current = new Polyline();
                current.addPoint(sp);
                current.addPoint(ep);
            }
        }
    }
    if (current && current.points && current.points.length == 2) {
        let l = new Line(current.points[0], current.points[1]);
        if (l.length() > 1) {
            let p = new Polyline();
            p.addPoints(current.points);
            this.polylines[this.polylines.length] = p;
        }
    }
}

Polylines.prototype.draw = function(ctx, color, weight) {
    for (let i = 0; i < this.polylines.length; i++) this.polylines[i].draw(ctx, color, weight);
}

