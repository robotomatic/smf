"use strict";

function ItemRendererMetal() {}

ItemRendererMetal.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {

    if (!scale) scale = 1;
    
    ctx.fillStyle = platform.color;

    let points = new Array();
    
    let parts = item.parts;
    for (let i = 0; i < parts.length; i++) {

        let cp = parts[i];

        let cpx = x + (cp.x * scale);
        let cpy = y + (cp.y * scale);
        let cpw = cp.width * scale;
        let cph = cp.height * scale;

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