Line = function(start, end) {
    this.start = start;
    this.end = end;
}

Line.prototype.getPoints = function() {
    return new Array(this.start, this.end);
}

Line.prototype.translate = function(x, y, scale) {
    this.start.x = x + (this.start.x * scale)
    this.start.y = y + (this.start.y * scale);
    this.end.x = x + (this.end.x * scale);
    this.end.y = y + (this.end.y * scale);
}

Line.prototype.normalize = function() {
    var startx;
    var starty;
    var endx;
    var endy;
    if (this.start.x <= this.end.x) {
        startx = this.start.x;
        endx = this.end.x;
    } else {
        startx = this.end.x;
        endx = this.start.x;
    }
    if (this.start.y <= this.end.y) {
        starty = this.start.y;
        endy = this.end.y;
    } else {
        starty = this.end.y;
        endy = this.start.y;
    }
    return new Line(new Point(startx, starty), new Point(endx, endy));
}

Line.prototype.getMbr = function() {
    var normal = this.normalize();
    return new Rectangle(normal.start, normal.end, this.width(), this.height());
}

Line.prototype.width = function() {
    var normal = this.normalize();
    return normal.end.x - normal.start.x;
}

Line.prototype.height = function() {
    var normal = this.normalize();
    return normal.end.y - normal.start.y;
}

Line.prototype.angle = function() {
    return angleDegrees(this.start, this.end);
}

Line.prototype.length = function() {
    return distance(this.start.x, this.start.y, this.end.x, this.end.y)    
}

Line.prototype.rotate = function(deg) {
    deg += this.angle();
    var a = deg * (Math.PI / 180);
    var d = this.length();
    var nx = this.start.x + d * Math.cos(a);
    var ny = this.start.y + d * Math.sin(a);
    return new Line(this.start, new Point(nx, ny));
}


Line.prototype.path = function(ctx) {
    createLine(ctx, this);
}

Line.prototype.draw = function(ctx, color, weight) {
    drawLine(ctx, this, color, weight);
}