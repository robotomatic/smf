"use strict";

function Rectangle(x, y, width, height, angle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
}

Rectangle.prototype.translate = function(x, y) {
    this.x += x;
    this.y += y;
}

Rectangle.prototype.getMbr = function() {
    let minx;
    let miny;
    let maxx;
    let maxy;
    let points = this.getPoints();
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let px = p.x;
        let py = p.y;
        if (!minx || px < minx) minx = px;
        if (!maxx || px > maxx) maxx = px;
        if (!miny || py < miny) miny = py;
        if (!maxy || py > maxy) maxy = py;
    }
    let w = maxx - minx;
    let h = maxy - miny;
    return new Rectangle(minx, miny, w, h);
}

Rectangle.prototype.getCenter = function() {
    let mbr = this.getMbr();
    return new Point(mbr.x + (mbr.width / 2), mbr.y + (mbr.height / 2));
}

Rectangle.prototype.getPoints = function() {
    let points = new Array();
    points[0] = new Point(this.x, this.y);
    points[1] = new Point(this.x + this.width, this.y);
    points[2] = new Point(this.x + this.width, this.y + this.height);
    points[3] = new Point(this.x, this.y + this.height);
    return points;
}

Rectangle.prototype.getLines = function() {
    let points = this.getPoints();
    let lines = new Array();
    lines[0] = new Line(points[0], points[1]);
    lines[1] = new Line(points[1], points[2]);
    lines[2] = new Line(points[2], points[3]);
    lines[3] = new Line(points[3], points[0]);
    return lines;
}

Rectangle.prototype.rotate = function(deg, cp) {
    let center = cp ? cp : this.getCenter();
    let points = this.getPoints();
    let out = new Array();
    let l;
    l = new Line(center, points[0]);
    l = l.rotate(deg);
    out[0] = l.end;
    l = new Line(center, points[1]);
    l = l.rotate(deg);
    out[1] = l.end;
    l = new Line(center, points[2]);
    l = l.rotate(deg);
    out[2] = l.end;
    l = new Line(center, points[3]);
    l = l.rotate(deg);
    out[3] = l.end;
    return out;
}

Rectangle.prototype.contains = function(point) {
    if (this.x >= point.x || this.x + this.width <= point.x ) return false;
    if (this.y >= point.y || this.y + this.height <= point.y ) return false;
    return true;
}


Rectangle.prototype.draw = function(ctx) {
    let x = this.x;
    let y = this.y;
    if (this.angle) {
        ctx.save();
        let a = this.angle;
        let dx = x + this.width / 2;
        let dy = y + this.height / 2;
        ctx.translate(dx, dy);
        let rad = a * Math.PI / 180;
        ctx.rotate(rad);
        x = -this.width / 2;
        y = -this.height / 2;
    }
    drawRect(ctx, x, y, this.width, this.height);
    if (this.angle) ctx.restore();
}

Rectangle.prototype.drawOutline = function(ctx, color, lineweight) {
    let x = this.x;
    let y = this.y;
    if (this.angle) {
        ctx.save();
        let a = this.angle;
        let dx = x + this.width / 2;
        let dy = y + this.height / 2;
        ctx.translate(dx, dy);
        let rad = a * Math.PI / 180;
        ctx.rotate(rad);
        x = -this.width / 2;
        y = -this.height / 2;
    }
    drawRectOutline(ctx, color, x, y, this.width, this.height, lineweight, 1, 1);
    if (this.angle) ctx.restore();
}