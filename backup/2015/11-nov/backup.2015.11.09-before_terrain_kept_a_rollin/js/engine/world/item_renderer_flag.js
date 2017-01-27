ItemRendererFlag = function() {
    this.x;
    this.y;
    this.width;
    this.height;
    this.color;
    
    this.incr = 0;
    this.fx = 0;
    this.fy = 0;
    
}

ItemRendererFlag.prototype.drawFlag = function(ctx, item, x, y, width, height, scale, flag) {

    var pw = width / 20;
    var px = x + width - pw;
    
    ctx.fillStyle = flag.color;
    
    var fy = y + (height / 10);
    var fh = height / 3;
    
    var wavelength = item.width;
    var amplitude = item.amplitude;
    var offset = item.offset;
    
    var wl = wavelength * scale;
    var freq = 2 * Math.PI * (1 /  wl);
    var amp  = amplitude * scale;

    ctx.beginPath();
    ctx.moveTo(x, fy);
    
    var cy = 0;
    var step = 1 * scale;
    var c = 0;
    for (var i = x; i < width + x; i += step) {
        cy = amp * Math.sin(freq * c + this.fx);
        cy *= scale;
        ctx.lineTo(i, fy + cy);
        c += step;
    }

    for (var i = width + x; i > x; i -= step) {
        cy = amp * Math.sin(freq * c + this.fx);
        cy *= scale;
        ctx.lineTo(i, fy + cy + fh);
        c -= step;
    }
    
    ctx.lineTo(x, fy);
    ctx.closePath();
    
    ctx.fill();

    this.fx += Number(offset);
    
    ctx.fillStyle = "gray";
    drawRect(ctx, px, y, pw, height);

    ctx.fillStyle = "lightgray";
    drawRect(ctx, px, y, pw / 3, height);
}
