"use strict";

function ItemRendererFlag() {
    this.x;
    this.y;
    this.width;
    this.height;
    this.color;
    
    this.incr = 0;
    this.fx = 0;
    this.fy = 0;

    this.flags = new Array();
    
}

ItemRendererFlag.prototype.drawFlag = function(ctx, item, x, y, width, height, scale, flag) {
    
    let id = item.id;
    
    let a = 0;
    if (this.flags[id]) {
        a = this.flags[id].angle;
    } else {
        a = random(-3, 3);
        this.flags[id] = {
            flag : item,
            angle : a
        }
    }
    
    ctx.save();
    
    
    let dx = x + width / 2;
    let dy = y + height / 2;
    ctx.translate(dx, dy);
    let rad = a * Math.PI / 180;
    ctx.rotate(rad);
    x = -width / 2;
    y = -height / 2;

    
    let pw = width / 20;
    let px = x + width - pw;
    
    ctx.fillStyle = flag.color;
    
    let fy = y + (height / 10);
    let fh = height / 3;
    
    let wavelength = item.width;
    let amplitude = flag.amplitude;

    let offset = flag.offset;
    
//    offset = random(offset / 2, offset);
    
    let wl = wavelength * scale;
    let freq = 2 * Math.PI * (1 /  wl);
    let amp  = amplitude * scale;

    ctx.beginPath();
    ctx.moveTo(x, fy);
    
    let cy = 0;
    let step = 1 * scale;
    let c = 0;
    for (let i = x; i < width + x; i += step) {
        cy = amp * Math.sin(freq * c + this.fx);
        cy *= scale;
        ctx.lineTo(i, fy + cy);
        c += step;
    }

    for (let i = width + x; i > x; i -= step) {
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
    
    ctx.restore();
}

