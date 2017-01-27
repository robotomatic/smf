ItemRendererGears = function() {
    this.gears = new Array();
}

ItemRendererGears.prototype.drawGear = function(ctx, item, x, y, width, height, gear, drawdetails) {
    
    
//    var id = 
    
    

    var scale = item.width / width;
    
    var color = gear.color;

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    var rad = item.angle * Math.PI / 180;
    ctx.rotate(rad);
    x = -width / 2;
    y = -height / 2;
    
    ctx.fillStyle = color;

    var r = item.radius / scale;
    
    drawCircle(ctx, r, x, y, width, height);
    
    ctx.lineCap = "butt";            
    ctx.strokeStyle = color;
    
    var lw = r * .8;
    ctx.lineWidth = lw;
    
    var amt = r / 4;
    
    ctx.moveTo(x + (width / 2), y + amt);
    ctx.lineTo(x + (width / 2), y + height - amt);

    ctx.moveTo(x + amt, y  + (height / 2));
    ctx.lineTo(x  + width - amt, y  + (height / 2));
    
    var damt = 3 * amt;
    
    ctx.moveTo(x + width - damt, y + damt);
    ctx.lineTo(x + damt, y + height - damt);
    
    ctx.moveTo(x + damt, y + damt);
    ctx.lineTo(x + width - damt, y + height - damt);

    
    ctx.stroke();

    var color = gear.colormiddle;
    ctx.fillStyle = color;
    r *= .8;
    drawCircle(ctx, r, x, y, width, height);
    
    var color = gear.colorcenter;
    ctx.fillStyle = color;
    r *= .5;
    drawCircle(ctx, r, x, y, width, height);
    
    ctx.restore();
}