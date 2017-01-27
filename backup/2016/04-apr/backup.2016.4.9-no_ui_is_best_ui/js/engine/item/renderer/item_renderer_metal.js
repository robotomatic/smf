"use strict";

function ItemRendererMetal() {}

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

        if (cp.ramp) {
            drawTriangle(ctx, cp, cpx, cpy, cpw, cph, scale);
            //drawTriangleOutline(ctx, "red", cp, cpx, cpy, cpw, cph, scale, .2, 1);
        } else {
            drawRect(ctx, cpx, cpy, cpw, cph);
            //drawRectOutline(ctx, "red", cpx, cpy, cpw, cph, .2, 1);
        }

    }
    
    //  need function to overlap 2 shapes!!!
    
//    drawLineOutline(ctx, points, "black", 1);
}