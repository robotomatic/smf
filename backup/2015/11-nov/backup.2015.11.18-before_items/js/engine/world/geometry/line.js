Line = function(start, end) {
    this.start = start;
    this.end = end;
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

Line.prototype.draw = function(ctx, color, weight) {
    drawLine(ctx, color, weight);
}
