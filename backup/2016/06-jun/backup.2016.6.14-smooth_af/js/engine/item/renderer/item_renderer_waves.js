"use strict";

function ItemRendererWaves() {

    
    this.incval = .1;
    this.incr = 0;
    
    // todo: this is ...strange... can be done better
    
    this.y = 0;
    this.x = 0;
    
    this.poly = new Polygon();
    this.point = new Point(0, 0);

    
    this.gradient = {
        gradient : null,
        height : 0,
        top : 0
    }
    
}

ItemRendererWaves.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale, drawdetails, ox, oy) {
    this.drawWaves(ctx, color, item, window, x, y, width, height, scale, titem, ox, oy);
}

ItemRendererWaves.prototype.drawWaves = function(ctx, color, item, window, x, y, width, height, scale, wave, ox, oy) {
    
    if (height < 1 || isNaN(height)) return;
    
    var wavelength = wave.wavelength;
    var amplitude = wave.amplitude;
    var offset = wave.offset;
    
    color = wave.color ? wave.color : color;
    if (color && color.gradient && height > 0 && (height + y) > 0) {
        var gradient = color.gradient;
        
        var t = gradient.top ? (gradient.top - oy) * scale : y;
        var h = gradient.height ? gradient.height * scale : height;
        
        if (this.gradient && this.gradient.height == h && this.gradient.top == t) {
            color = this.gradient.gradient;
        } else {
            var g = ctx.createLinearGradient(0, t, 0, h + t);
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
            this.gradient.gradient = g;
            this.gradient.height = h;
            this.gradient.top = t;
        }
    }
    ctx.fillStyle = color;
    
    var wl = wavelength * scale;
    var freq = 2 * Math.PI * (1 /  wl);
    var amp  = amplitude * scale;

    ctx.beginPath();
    
    
    this.poly.points.length = 0;
    
    this.point.x = x;
    this.point.y = y;
    this.poly.addPoint(this.point);
    
    this.y += this.incr;
    if (this.y > amp) {
        this.y = amp;
        this.incr = -this.incval;
    } else if (this.y < -(2 * amp)) {
        this.y = -(2 * amp);
        this.incr = this.incval;
    }
    
    amp += (this.y * scale);
    
    var cy = 0;
    var step = 50 * scale;
    var c = 0;
    
    var ww = window.width * scale;
    
    for ( var i = x; i < ww - x; i += step ) {

        cy = amp * Math.sin(freq * c + this.x);
        cy *= scale;
        
        this.point.x = i;
        this.point.y = y + cy;
        this.poly.addPoint(this.point);
        
        c += step;
    }

    this.x += Number(offset);

    this.point.x = x + width;
    this.point.y = y + height;
    this.poly.addPoint(this.point);

    this.point.x = x;
    this.point.y = y + height;
    this.poly.addPoint(this.point);

    this.point.x = x;
    this.point.y = y;
    this.poly.addPoint(this.point);
    
    this.poly.draw(ctx);
 }