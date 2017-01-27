Point = function(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.draw = function(ctx, color, size) {
    ctx.fillStyle = color;
    drawRect(ctx, this.x - (size / 2), this.y - (size / 2), size, size, 1);
}