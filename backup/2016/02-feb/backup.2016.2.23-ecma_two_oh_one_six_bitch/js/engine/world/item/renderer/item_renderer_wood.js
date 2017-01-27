"use strict";

function ItemRendererWood() { }

ItemRendererWood.prototype.drawSupport = function(ctx, item, x, y, width, height, support, drawdetails) {

    let itemwidth = item.width;
    let itemheight = item.height;
    
    let scale = itemwidth / width;
    
    let color = item.color ? item.color : support.color;

    let lcolor = support.colorlight;
    let dcolor = support.colordark;
    
    let sectionheight = support.sectionheight * scale;
    let sectionwidth = support.sectionwidth;

    if (drawdetails) {
        let g = ctx.createLinearGradient(x, y, width + x, y);
        g.addColorStop(0, dcolor);
        g.addColorStop(.5, lcolor);
        g.addColorStop(1, dcolor);
        color = g;
    }
    ctx.fillStyle = color;
    
    drawRect(ctx, x, y, width, height);
    
    if (!drawdetails) return;
    
    ctx.lineCap = "round";            
    ctx.strokeStyle = dcolor;
    ctx.lineWidth = .3 * scale;
    
//    ctx.strokeRect(x, y, width, height);

    ctx.save();
    ctx.rect(x, y, width, height);
    ctx.clip();
    
    ctx.strokeStyle = support.colordark;
    ctx.fillStyle = support.colorlight;
    ctx.lineWidth = 1 * scale;

    let sectionw = sectionwidth / 2;
    let totalsections = Math.floor(itemwidth / sectionwidth);
    
    let tsw = totalsections * sectionwidth;
    let d = (itemwidth - tsw) / 2;
    
    let vx = x + (d + sectionw) * scale;
    for (let i = 0; i < totalsections; i++) {
        let ix = (sectionwidth * i) * scale;
        let ii = y;
        while (ii < y + height) {
            ctx.beginPath();
            let r = (ii == y) ? 0 : random(0, sectionheight * .2);
            ii += r;
            ctx.moveTo(vx + ix, ii);
            ii += random(sectionheight * .6, sectionheight);
            if (ii > y + height) ii = y + height;
            ctx.lineTo(vx + ix, ii);
            ctx.stroke();
        }
        
    }
    
    let chunks = itemheight / sectionheight;
    ctx.fillStyle = color;
    for (let c = 1; c < chunks -1; c++) {
        let knot = random(0, 3);
        if (knot == 1) {
            let cw = width / 2;
            let ch = (sectionheight / 2) * scale;

            let ccx = x + (width / 2);
            
            
            let left = random(1, 5);
            if (left == 1) {
                ccx -= width / 4;
            } else {
                let right = random(1, 5);
                if (right == 1) {
                    ccx += width / 4;
                } else {
                    ccx -= width / 10;
                }
            }
            
            let ccy = y + ((sectionheight * c) * scale);
            
            ctx.beginPath();
            ctx.ellipse(ccx, ccy, cw, ch, 0, 0, 2 * Math.PI);
            ctx.fill();    
            
            ctx.strokeStyle = support.colordark;

            let ds = 5 * scale;
            
            let hds = sectionheight;

            while (cw > 1) {
                cw -= ds;
                ch -= ds * 1.5;
                
                if (ch < 0) continue;
                
                
                ctx.beginPath();
                
                if (random(1, 5) == 1) ctx.setLineDash([hds, hds]);
                else ctx.setLineDash([]);
                
                let circ = 2 * Math.PI;
                let sa = circ
                let ea = 0;
                                
                //let ccw = random(0, 1);
                let ccw = true;
                
                if (cw > 1 && ch > 1) {
                    ctx.ellipse(ccx, ccy, cw, ch, 0, sa, ea, ccw);
                    ctx.stroke();    
                }
                
            }
            break;
        }
    }
    
    ctx.globalAlpha = .4;
    let sh = 5 * scale;
    ctx.fillStyle = "#5a5338";
    drawRect(ctx, x, y, width, sh);
    ctx.globalAlpha = 1;
    
    ctx.restore();
    
}