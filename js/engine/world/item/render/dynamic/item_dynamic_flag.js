"use strict";

function ItemDynamicFlag() {
    this.x;
    this.y;
    this.width;
    this.height;
    this.color;
    
    this.incr = 0;
    this.fx = 0;
    this.fy = 0;

    this.poly = geometryfactory.getPolygon();
    this.rect = geometryfactory.getRectangle(0, 0, 0, 0);

    this.point = geometryfactory.getPoint(0, 0);
    
    this.flags = new Array();
    
}

ItemDynamicFlag.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale) {
    this.drawFlag(ctx, item, x, y, width, height, scale, titem);
}

ItemDynamicFlag.prototype.drawFlag = function(ctx, item, x, y, width, height, scale, flag) {
    
    if (!width || !height) return;
    
    var id = item.id;
    
    var a = 0;
//    if (this.flags[id]) {
//        a = this.flags[id].angle;
//    } else {
//        a = random(-3, 3);
//        this.flags[id] = {
//            flag : item,
//            angle : a
//        }
//    }
    
//    ctx.save();
//    
//    var dx = x + width / 2;
//    var dy = y + height / 2;
//    ctx.translate(dx, dy);
//    var rad = a * MATH_PI / 180;
//    ctx.rotate(rad);
//    x = -width / 2;
//    y = -height / 2;
    
    var pw = width / 20;
    var px = x + width - pw;
    
    ctx.fillStyle = flag.renderer.color;
    
    var fy = y + (height / 10);
    var fh = height / 3;
    
    var wavelength = item.width;
    var amplitude = flag.renderer.amplitude;

    var offset = flag.renderer.offset;
    
    var wl = wavelength * scale;
    var freq = 2 * MATH_PI * (1 /  wl);
    
    var amp  = amplitude * scale;

    var off = 10 * scale;
    var bottomright = (a < 0) ? x + off : x - off;
    
    this.poly.points.length = 0;
    var cy = 0;
    var step = 5 * scale;
    var c = 0;
    for (var i = x; i < width + x - 2; i += step) {
        cy = amp * sin(freq * c + this.fx);
        cy *= scale;
        
        this.point.x = i;
        this.point.y = fy + cy;
        
        this.poly.addPoint(this.point);
        c += step;
    }
    for (var i = width + x - 2; i > bottomright; i -= step) {
        cy = amp * sin(freq * c + this.fx);
        cy *= scale;

        this.point.x = i;
        this.point.y = fy + cy + fh;
        
        this.poly.addPoint(this.point);

        c -= step;
    }
    
    if (this.poly.points.length == 0) return;
    
    ctx.beginPath();
    this.poly.draw(ctx);

    this.fx += offset;
    
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
    
//    ctx.restore();
}

