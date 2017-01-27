Line = function(start, end) {
    this.start = start;
    this.end = end;
}

Line.prototype.getPoints = function() {
    return new Array(this.start, this.end);
}

Line.prototype.getMbr = function() {
    return new Rectangle(this.start, this.end, this.width(), this.height());
}

Line.prototype.width = function() {
    return this.end.x - this.start.x;
}

Line.prototype.height = function() {
    return this.end.y - this.start.y;
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



Line.prototype.draw = function(ctx, color, weight) {
    drawLine(ctx, color, weight);
}