"use strict";

function ItemRendererGears() {
    this.gears = new Array();
}

ItemRendererGears.prototype.drawGear = function(ctx, item, x, y, width, height, gear, drawdetails) {

    var id = item.id;
    
    if (this.gears[id]) {
        this.drawGearCache(ctx, item, x, y, width, height);
        return;
    }
    
    var canvas = document.createElement('canvas');
    canvas.width = item.width;
    canvas.height = item.height;
    var gearctx = canvas.getContext("2d");
    
    var scale = 1;
    var color = gear.color;
    gearctx.fillStyle = color;

    var r = item.radius / scale;

    var itemx = 0;
    var itemy = 0;

    gearctx.beginPath();
    drawCircle(gearctx, r, itemx, itemy, item.width, item.height);
    
    gearctx.lineCap = "butt";            
    gearctx.strokeStyle = color;
    
    var lw = r * .8;
    gearctx.lineWidth = lw;
    
    var amt = r / 4;
    
    gearctx.moveTo(itemx + (item.width / 2), itemy + amt);
    gearctx.lineTo(itemx + (item.width / 2), itemy + item.height - amt);

    gearctx.moveTo(itemx + amt, itemy  + (item.height / 2));
    gearctx.lineTo(itemx  + item.width - amt, itemy  + (item.height / 2));
    
    var damt = 3 * amt;
    
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
    var id = item.id;
    var cg = this.gears[id];
    ctx.save();
    ctx.translate(x + (width / 2), y + (height / 2));
    var rad = item.angle * Math.PI / 180;
    ctx.rotate(rad);
    x = -width / 2;
    y = -height / 2;
    ctx.drawImage(cg.canvas, x, y, width, height);
    ctx.restore();
}
