"use strict";

function ItemRendererWaves() {

    
    this.incval = .1;
    this.incr = 0;
    
    // todo: this is ...strange... can be done better
    
    this.y = 0;
    this.x = 0;
    
    this.poly = new Polygon();
    this.point = new Point(0, 0);
    this.top = 0;

    
    this.gradient = {
        gradient : null,
        height : 0,
        top : 0
    }
    
}

ItemRendererWaves.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale) {
    this.drawWaves(ctx, color, item, window, x, y, width, height, scale, titem);
}

ItemRendererWaves.prototype.drawWaves = function(ctx, color, item, window, x, y, width, height, scale, wave) {
    
    if (height < 1 || isNaN(height)) return;
    
    var wavelength = wave.renderer.wavelength;
    var amplitude = wave.renderer.amplitude;
    var offset = wave.renderer.offset;

    if (!scale) scale = 1;
    
    color = wave.renderer.color ? wave.renderer.color : color;
    if (color && color.gradient && height > 0 && (height + y) > 0) {
        var gradient = color.gradient;
        
        var t = gradient.top ? ((gradient.top - item.y) * scale) + y  : y;
        var h = gradient.height ? gradient.height * scale  : height;

        if (isNaN(t) || isNaN(h)) return;
            
        var g = ctx.createLinearGradient(0, t, 0, h + t);
        
//        if (this.gradient && this.gradient.height == h && this.gradient.top == t) {
//
//            color = this.gradient.gradient;

//            var d = y - this.top;
//            this.poly.translate(0, d, 1);
//            ctx.fillStyle = color;
//            ctx.beginPath();
//            this.poly.draw(ctx);
//            
//            return;
            
//        } else {
        var start = gradient.start;
        var stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
//        this.gradient.gradient = g;
//        this.gradient.height = h;
//        this.gradient.top = t;
//        }
    }
    ctx.fillStyle = color;
    
    var wl = wavelength * scale;
    var freq = 2 * Math.PI * (1 /  wl);
    var amp  = amplitude * scale;

    
    this.poly.points.length = 0;
    this.top = y;
    
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
    var step = 200 * scale;
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

    this.x += offset;

    this.point.x = x + width;
    this.point.y = y + height;
    this.poly.addPoint(this.point);

    this.point.x = x;
    this.point.y = y + height;
    this.poly.addPoint(this.point);

    this.point.x = x;
    this.point.y = y;
    this.poly.addPoint(this.point);
    
    ctx.beginPath();
    this.poly.draw(ctx);
 }