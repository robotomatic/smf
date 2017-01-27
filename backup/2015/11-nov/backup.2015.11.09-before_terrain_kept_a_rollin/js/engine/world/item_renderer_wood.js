ItemRendererWood = function() {
}

ItemRendererWood.prototype.drawSupport = function(ctx, item, x, y, width, height, support, drawdetails) {

    scale = item.width / width;
    
    var color = item.color ? item.color : support.color;
    
    var sectionheight = support.sectionheight * scale;
    var sectionwidth = support.sectionwidth;

    ctx.fillStyle = color;
    drawRect(ctx, x, y, width, height);

    if (!drawdetails) return;
    
    ctx.lineCap = "round";            
    ctx.strokeStyle = support.colordark;
    ctx.lineWidth = .2 * scale;
    
    ctx.strokeRect(x, y, width, height);

    ctx.save();
    ctx.rect(x, y, width, height);
    ctx.clip();
    
    ctx.strokeStyle = support.colorlight;
    ctx.fillStyle = support.colorlight;
    ctx.lineWidth = 1 * scale;

    var sectionw = sectionwidth / 2;
    var totalsections = Math.floor(item.width / sectionwidth);
    
    var tsw = totalsections * sectionwidth;
    var d = (item.width - tsw) / 2;
    
    var vx = x + (d + sectionw) * scale;
    for (var i = 0; i < totalsections; i++) {
        var ix = (sectionwidth * i) * scale;
        var ii = y;
        while (ii < y + height) {
            ctx.beginPath();
            var r = (ii == y) ? 0 : random(0, sectionheight * .2);
            ii += r;
            ctx.moveTo(vx + ix, ii);
            ii += random(sectionheight * .6, sectionheight);
            if (ii > y + height) ii = y + height;
            ctx.lineTo(vx + ix, ii);
            ctx.stroke();
        }
        
    }
    
    var chunks = item.height / sectionheight;
    ctx.fillStyle = color;
    for (var c = 1; c < chunks -1; c++) {
        var knot = random(0, 10);
        if (knot == 1) {
            var cw = width / 2;
            var ch = (sectionheight / 2) * scale;

            var ccx = x + (width / 2);
            
            
            var left = random(1, 5);
            if (left == 1) {
                ccx -= width / 4;
            } else {
                var right = random(1, 5);
                if (right == 1) {
                    ccx += width / 4;
                } else {
                    ccx -= width / 10;
                }
            }
            
            var ccy = y + ((sectionheight * c) * scale);
            
            ctx.beginPath();
            ctx.ellipse(ccx, ccy, cw, ch, 0, 0, 2 * Math.PI);
            ctx.fill();    
            
            ctx.strokeStyle = support.colorlight;

            var ds = 5 * scale;
            while (cw > 1) {
                cw -= ds;
                ch -= ds * 1.5;
                ctx.beginPath();
                ctx.ellipse(ccx, ccy, cw, ch, 0, 0, 2 * Math.PI);
                ctx.stroke();    
            }
            break;
        }
    }

    ctx.restore();
    
    ctx.globalAlpha = .3;
    var sh = 5 * scale;
    ctx.fillStyle = "#616f68";
    drawRect(ctx, x, y, width, sh);
    ctx.globalAlpha = 1;
}