"use strict";

function ItemRendererTree() {}

ItemRendererTree.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale, drawdetails) {
    this.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
}

ItemRendererTree.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {

    if (!scale) scale = 1;
    
    var poly = new Polygon();
    poly.createPolygon(item.parts);

//    var craziness = 4;
    var craziness = 0;
    
    // todo : need shape translator
    var plg = new Polygon();
    for (var i = 0; i < poly.points.length; i++) {
        var npx = x + (poly.points[i].x * scale);
        var npy = y + (poly.points[i].y * scale);
        
        npx += random(-craziness, craziness);
        npy += 2;
        
        var np = new Point(npx, npy);
        plg.addPoint(np);
    }

    var color = platform.colortopdark;
    ctx.fillStyle = color;

    var tops = poly.tops;
    
    var pl = new Polylines();
    pl.createPolylines(tops);

    var pad = 5;

    var ptops = new Array();
    for (var i = 0; i < pl.polylines.length; i++) ptops[ptops.length] = this.createPlatformTop(pl.polylines[i], pad);

    var offset = pad;
    var shadowoffset = offset * 2;

    ctx.beginPath();
//    plg.drawRound(ctx, 5);
    plg.draw(ctx, 5);
    
//    ctx.save();
//    ctx.clip();
//    ctx.beginPath();
//    ctx.globalAlpha = .8;
//    var shadow = "#879b1b";
//    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false);
//    ctx.fill();
//    ctx.globalAlpha = 1;
//    ctx.restore();

    
    color = platform.colortoplight;
    ctx.beginPath();
    ctx.fillStyle = color;
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true);
}

ItemRendererTree.prototype.createPlatformTop = function(top, pad) {

    var pg = new Polygon();
    var p;
    var np;

    p = top.points[0];
    np = new Point(p.x - pad, p.y - pad);
    pg.addPoint(np);
    
    var simple = false;
    if (top.points.length == 2) {
        simple = true;
        top.points[2] = top.points[1];
        
        var d = top.points[1].x - top.points[0].x;
        var rd = random(0, d);
        rd = 0;
        
        top.points[1] = new Point(top.points[0].x + rd, top.points[0].y);
    }

    for (var i = 0; i < top.points.length; i++) {
        p = top.points[i];
        np = new Point(p.x, p.y - pad);
        pg.addPoint(np);
    }
    
    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y - pad);
    pg.addPoint(np);

    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y);
    pg.addPoint(np);

    var bpad = pad;
    //if (simple) bpad = pad = random(0, pad);

    for (var i = top.points.length; i > 1; i--) {
        p = top.points[i - 1];
        np = new Point(p.x, p.y + bpad);
        pg.addPoint(np);
    }

    p = top.points[0];
    np = new Point(p.x - pad, p.y);
    pg.addPoint(np);

    return pg;
}


ItemRendererTree.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset, details) {

    var angle = 50;
    var num = 5;
    var max = 8;

    var t = top.points.length;
    var pl = new Polygon();
    for (var i = 0; i < t; i++) {
        var p = new Point(x + (top.points[i].x * scale), y + (top.points[i].y * scale) + (offset * scale));
        pl.addPoint(p);
    }
    ctx.fillStyle = color;
    pl.drawRound(ctx, 4);
}