"use strict";

function ItemRendererGears() {
    this.gears = new Array();
}

ItemRendererGears.prototype.drawGear = function(ctx, item, x, y, width, height, gear, drawdetails) {

    let id = item.id;
    
    if (this.gears[id]) {
        this.drawGearCache(ctx, item, x, y, width, height);
        return;
    }
    
    let canvas = document.createElement('canvas');
    canvas.width = item.width;
    canvas.height = item.height;
    let gearctx = canvas.getContext("2d");
    
    let scale = 1;
    let color = gear.color;
    gearctx.fillStyle = color;

    let r = item.radius / scale;

    let itemx = 0;
    let itemy = 0;

    gearctx.beginPath();
    drawCircle(gearctx, r, itemx, itemy, item.width, item.height);
    
    gearctx.lineCap = "butt";            
    gearctx.strokeStyle = color;
    
    let lw = r * .8;
    gearctx.lineWidth = lw;
    
    let amt = r / 4;
    
    gearctx.moveTo(itemx + (item.width / 2), itemy + amt);
    gearctx.lineTo(itemx + (item.width / 2), itemy + item.height - amt);

    gearctx.moveTo(itemx + amt, itemy  + (item.height / 2));
    gearctx.lineTo(itemx  + item.width - amt, itemy  + (item.height / 2));
    
    let damt = 3 * amt;
    
    gearctx.moveTo(itemx + item.width - damt, itemy + damt);
    gearctx.lineTo(itemx + damt, itemy + item.height - damt);
    
    gearctx.moveTo(itemx + damt, itemy + damt);
    gearctx.lineTo(itemx + item.width - damt, itemy + item.height - damt);
    
    gearctx.stroke();

    gearctx.beginPath();
    color = gear.colormiddle;
    gearctx.fillStyle = color;
    r *= .8;
    drawCircle(gearctx, r, itemx, itemy, item.width, item.height);
    
    gearctx.beginPath();
    color = gear.colorcenter;
    gearctx.fillStyle = color;
    r *= .5;
    drawCircle(gearctx, r, itemx, itemy, item.width, item.height);
    
    if (gear.blur) blurCanvas(canvas, gearctx, gear.blur);

    this.gears[id] = {
        canvas : canvas,
        ctx : gearctx,
        id : id
    };
    
    this.drawGearCache(ctx, item, x, y, width, height);
}

ItemRendererGears.prototype.drawGearCache = function(ctx, item, x, y, width, height) {
    let id = item.id;
    let cg = this.gears[id];
    ctx.save();
    ctx.translate(x + (width / 2), y + (height / 2));
    let rad = item.angle * Math.PI / 180;
    ctx.rotate(rad);
    x = -width / 2;
    y = -height / 2;
    ctx.drawImage(cg.canvas, x, y, width, height);
    ctx.restore();
}
