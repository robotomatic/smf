"use strict";

function ItemRendererMetal() {}

ItemRendererMetal.prototype.draw = function(ctx, color, item, x, y, width, height, titem, scale, drawdetails) {
    this.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
}

ItemRendererMetal.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {

    if (!scale) scale = 1;
    
    ctx.fillStyle = platform.color;

    var points = new Array();
    
    var parts = item.parts;
    for (var i = 0; i < parts.length; i++) {

        var cp = parts[i];

        var cpx = x + (cp.x * scale);
        var cpy = y + (cp.y * scale);
        var cpw = cp.width * scale;
        var cph = cp.height * scale;

        var s;
        if (cp.ramp) s = new Triangle(cpx, cpy, cpw, cph, cp);
        else s = new Rectangle(cpx, cpy, cpw, cph);
        
        ctx.beginPath();
        
        s.draw(ctx);
    }
}