"use strict";

function ItemRendererWaves() {
    this.incr = .2;
    
    // todo: this is ...strange... can be done better
    
    this.y = 0;
    this.x = 0;
}

ItemRendererWaves.prototype.drawWaves = function(ctx, color, item, x, y, width, height, scale, wave) {

    if (height < 1 || isNaN(height)) return;
    
    let wavelength = wave.wavelength;
    let amplitude = wave.amplitude;
    let offset = wave.offset;
    
    if (color.gradient) {
        let gradient = color.gradient;
        let g = ctx.createLinearGradient(0, y, 0, height + y);
        let start = gradient.start;
        let stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
    }
    ctx.fillStyle = color;
    
    let wl = wavelength * scale;
    let freq = 2 * Math.PI * (1 /  wl);
    let amp  = amplitude * scale;

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
    
    let cy = 0;
    let step = 10 * scale;
    let c = 0;
    for ( let i = x; i < (item.width * scale) + x; i += step ) {
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