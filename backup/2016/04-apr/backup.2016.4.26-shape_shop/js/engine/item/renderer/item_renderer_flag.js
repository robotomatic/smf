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

    this.poly = new Polygon();
    this.rect = new Rectangle(0, 0, 0, 0);
    
    this.flags = new Array();
    
}

ItemRendererFlag.prototype.draw = function(ctx, color, item, x, y, width, height, titem, scale, drawdetails) {
    this.drawFlag(ctx, item, x, y, width, height, scale, titem);
}

ItemRendererFlag.prototype.drawFlag = function(ctx, item, x, y, width, height, scale, flag) {
    
    var id = item.id;
    
    var a = 0;
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
    
    var dx = x + width / 2;
    var dy = y + height / 2;
    ctx.translate(dx, dy);
    var rad = a * Math.PI / 180;
    ctx.rotate(rad);
    x = -width / 2;
    y = -height / 2;
    
    var pw = width / 20;
    var px = x + width - pw;
    
    ctx.fillStyle = flag.color;
    
    var fy = y + (height / 10);
    var fh = height / 3;
    
    var wavelength = item.width;
    var amplitude = flag.amplitude;

    var offset = flag.offset;
    
    var wl = wavelength * scale;
    var freq = 2 * Math.PI * (1 /  wl);
    
    var amp  = amplitude * scale;

    var bottomright = (a < 0) ? x + 10 : x - 10;
    
    this.poly.points.length = 0;
    var cy = 0;
    var step = 1 * scale;
    var c = 0;
    for (var i = x; i < width + x - 2; i += step) {
        cy = amp * Math.sin(freq * c + this.fx);
        cy *= scale;
        this.poly.addPoint(new Point(i, fy + cy));
        c += step;
    }
    for (var i = width + x - 2; i > bottomright; i -= step) {
        cy = amp * Math.sin(freq * c + this.fx);
        cy *= scale;
        this.poly.addPoint(new Point(i, fy + cy + fh));
        c -= step;
    }
    
    ctx.beginPath();
    this.poly.draw(ctx);

    this.fx += Number(offset);

    
    
    ctx.beginPath();
    ctx.fillStyle = "gray";
    this.rect.x = px;
    this.rect.y = y;
    this.rect.width = pw;
    this.rect.height = height;
    this.rect.draw(ctx);

    ctx.beginPath();
    ctx.fillStyle = "lightgray";
    this.rect.width = pw / 3;
    this.rect.draw(ctx);
    
    ctx.restore();
}

