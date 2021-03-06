"use strict";

function ItemRendererScaffold() { }

ItemRendererScaffold.prototype.draw = function(ctx, color, item, x, y, width, height, titem, scale, drawdetails) {
    this.drawSupport(ctx, item, x, y, width, height, titem, scale, drawdetails);
}

ItemRendererScaffold.prototype.drawSupport = function(ctx, item, x, y, width, height, scaffold, scale, drawdetails) {
    
    var stype = (item.itemtype == "platform-support") ? "single" : "double";
    
    var color = item.color ? item.color : scaffold.color;
    
    var beamwidth = scaffold.beamwidth;
    var sectionheight = scaffold.sectionheight;
    var cross = scaffold.cross;

    var bwidth = beamwidth * scale;
    var b1x = x;
    var b2x = b1x + width - bwidth;

    ctx.fillStyle = color;
    
    var r = new Rectangle(b1x, y, bwidth, height);
    ctx.beginPath();
    r.draw(ctx);

    r.x = b2x;
    ctx.beginPath();
    r.draw(ctx);
    
//    var sheight = sectionheight;
//
//    ctx.lineCap = "round";            
//    ctx.strokeStyle = color;
//    
//    var side = (item.itemstyle == "flip") ? 0 : 1;
//
//    var lw = bwidth / 2;
//    ctx.lineWidth = lw;
//    
//    ctx.beginPath();
//    
//    for (var i = 0; i < height; i+= sheight) {
//        
//        ctx.rect(b1x, y + i, width, bwidth);
//        
//        var cy = y + i + sheight + bwidth;
//        if (cy > y + height) cy = y + height;
//        
//        if (side == 0) {
//            ctx.moveTo(b1x, y + i);
//            ctx.lineTo(b1x + width, cy);
//            if (stype == "double") {
//                ctx.moveTo(b1x + width, y + i);
//                ctx.lineTo(b1x, cy);
//            }
//            side = 1;
//        } else {
//            ctx.moveTo(b1x + width, y + i);
//            ctx.lineTo(b1x, cy);
//            if (stype == "double") {
//                ctx.moveTo(b1x, y + i);
//                ctx.lineTo(b1x + width, cy);
//            }
//            side = 0;
//        }
//    }
//    ctx.stroke();            
}