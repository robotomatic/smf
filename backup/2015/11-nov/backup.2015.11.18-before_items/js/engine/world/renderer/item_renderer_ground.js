ItemRendererGround = function() {}

ItemRendererGround.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {

    if (!scale) scale = 1;

    var poly = new Polygon();
    poly.createPolygon(item.parts);

    // todo : need shape translator
    var pl = new Polygon();
    for (var i = 0; i < poly.points.length; i++) pl.addPoint(new Point(x + (poly.points[i].x * scale), y + (poly.points[i].y * scale)));
    
    ctx.save();
    ctx.fillStyle = platform.colortopdark;
    pl.draw(ctx);
    
    ctx.clip();

    var tops = poly.tops;
    this.drawPlatformTops(ctx, tops, x, y, scale, platform.colortoplight);
}

ItemRendererGround.prototype.drawPlatformTops = function(ctx, tops, x, y, scale, color) {
    
    var pl = new Polylines();
    pl.createPolylines(tops);

    var pad = 5;

    var ptops = new Array();
    for (var i = 0; i < pl.polylines.length; i++) ptops[ptops.length] = this.createPlatformTop(pl.polylines[i], pad);

    var offset = pad;
    var shadowoffset = offset * 2;
    
    ctx.globalAlpha = .3;
    var shadow = "#616f68";
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset);
    ctx.globalAlpha = 1;
    ctx.restore();
    
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset);
}

ItemRendererGround.prototype.createPlatformTop = function(top, pad) {

    var pg = new Polygon();
    var p;
    var np;
    
    
    if (top.points.length == 2) {
        top.points[2] = top.points[1];
        
        var d = top.points[1].x - top.points[0].x;
        var rd = random(0, d);
        
        top.points[1] = new Point(top.points[0].x + rd, top.points[0].y);
    }

    
    for (var i = 0; i < top.points.length; i++) {
        p = top.points[i];
        np = new Point(p.x, p.y - pad);
        
        //  can curve a little on top
        
        pg.addPoint(np);
    }
    
    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y - pad);
    pg.addPoint(np);

    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y);
    pg.addPoint(np);

    // this can curve
    
    for (var i = top.points.length - 1; i > 1; i--) {
        p = top.points[i - 1];
        np = new Point(p.x, p.y + pad);
        // can curve a lot on bottom
        pg.addPoint(np);
    }

    // this can curve
    
    p = top.points[0];
    np = new Point(p.x - pad, p.y);
    pg.addPoint(np);

    p = top.points[0];
    np = new Point(p.x - pad, p.y - pad);
    pg.addPoint(np);

    return pg;
}

ItemRendererGround.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset) {
    var pl = new Polygon();
    for (var i = 0; i < top.points.length; i++) {
        var p = new Point(x + (top.points[i].x * scale), y + (top.points[i].y * scale) + (offset * scale));
        pl.addPoint(p);
    }
    ctx.fillStyle = color;
    
    pl.draw(ctx);
}


