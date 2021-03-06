ItemRendererWaves = function() {
    this.incr = .2;
    this.y = 0;
    this.x = 0;
}

ItemRendererWaves.prototype.drawWaves = function(ctx, color, item, x, y, width, height, lighten, outline, outlinewidth, scale, wave) {

    
    var wavelength = wave.wavelength;
    var amplitude = wave.amplitude;
    var offset = wave.offset;
    
    if (color.gradient) {
        var gradient = color.gradient;
        var g = ctx.createLinearGradient(0, y, 0, height + y);
        var start = gradient.start;
        var stop = gradient.stop;
        if (lighten) {
            start = lightenColor(start, this.lighten);
            stop = lightenColor(stop, this.lighten);
        }
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
    }
    ctx.fillStyle = color;
    
    var wl = wavelength * scale;
    var freq = 2 * Math.PI * (1 /  wl);
    var amp  = amplitude * scale;

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    this.y += this.incr;
    if (this.y > amp) {
        this.y = amp;
        this.incr = -.2;
    } else if (this.y < -(2 * amp)) {
        this.y = -(2 * amp);
        this.incr = .2;
    }
    
    amp += (this.y * scale);
    
    var cy = 0;
    var step = 10 * scale;
    var c = 0;
    for ( var i = x; i < width + x; i += step) {
        cy = amp * Math.sin(freq * c + this.x);
        cy *= scale;
        ctx.lineTo(i, y + cy);
        c += step;
    }

    this.x += Number(offset);
    
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
    
    ctx.fill();
 }