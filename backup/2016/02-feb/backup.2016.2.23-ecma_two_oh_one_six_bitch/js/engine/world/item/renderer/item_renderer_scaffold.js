"use strict";

function ItemRendererScaffold() { }

ItemRendererScaffold.prototype.drawSupport = function(ctx, item, x, y, width, height, scaffold, drawdetails) {
    
    let scale = item.width / width;
    
    let stype = (item.itemtype == "platform-support") ? "single" : "double";
    
    let color = item.color ? item.color : scaffold.color;
    
    let beamwidth = scaffold.beamwidth;
    let sectionheight = scaffold.sectionheight;
    let cross = scaffold.cross;

    let bwidth = beamwidth * scale;
    let b1x = x;
    let b2x = b1x + width - bwidth;

    ctx.fillStyle = color;
    drawRect(ctx, b1x, y, bwidth, height);
    drawRect(ctx, b2x, y, bwidth, height);
    
    let sheight = sectionheight * scale;

    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    
    let side = (item.itemstyle == "flip") ? 0 : 1;

    let lw = bwidth / 2;
    ctx.lineWidth = lw;
    
    ctx.beginPath();
    
    for (let i = 0; i < height; i+= sheight) {
        
        ctx.rect(b1x, y + i, width, bwidth);
        
        let cy = y + i + sheight + bwidth;
        if (cy > y + height) cy = y + height;
        
        if (side == 0) {
            ctx.moveTo(b1x, y + i);
            ctx.lineTo(b1x + width, cy);
            if (stype == "double") {
                ctx.moveTo(b1x + width, y + i);
                ctx.lineTo(b1x, cy);
            }
            side = 1;
        } else {
            ctx.moveTo(b1x + width, y + i);
            ctx.lineTo(b1x, cy);
            if (stype == "double") {
                ctx.moveTo(b1x, y + i);
                ctx.lineTo(b1x + width, cy);
            }
            side = 0;
        }
    }
    ctx.stroke();            
}