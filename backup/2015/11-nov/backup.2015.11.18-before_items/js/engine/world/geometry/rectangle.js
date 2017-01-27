Rectangle = function(x, y, width, height, angle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
}

Rectangle.prototype.draw = function(ctx) {
    var x = this.x;
    var y = this.y;
    if (this.angle) {
        ctx.save();
        var a = this.angle;
        var dx = x + this.width / 2;
        var dy = y + this.height / 2;
        ctx.translate(dx, dy);
        var rad = a * Math.PI / 180;
        ctx.rotate(rad);
        x = -this.width / 2;
        y = -this.height / 2;
    }
    drawRect(ctx, x, y, this.width, this.height);
    if (this.angle) ctx.restore();
}

Rectangle.prototype.drawOutline = function(ctx, color, lineweight) {
    var x = this.x;
    var y = this.y;
    if (this.angle) {
        ctx.save();
        var a = this.angle;
        var dx = x + this.width / 2;
        var dy = y + this.height / 2;
        ctx.translate(dx, dy);
        var rad = a * Math.PI / 180;
        ctx.rotate(rad);
        x = -this.width / 2;
        y = -this.height / 2;
    }
    drawRectOutline(ctx, color, x, y, this.width, this.height, lineweight, 1, 1);
    if (this.angle) ctx.restore();
}