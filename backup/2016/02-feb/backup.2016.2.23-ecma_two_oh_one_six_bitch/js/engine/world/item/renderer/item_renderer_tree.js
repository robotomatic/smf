"use strict";

function ItemRendererTree() {}

ItemRendererTree.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {


    if (!scale) scale = 1;

    
    let poly = new Polygon();
    poly.createPolygon(item.parts);

    let craziness = 4;
    
    // todo : need shape translator
    let plg = new Polygon();
    for (let i = 0; i < poly.points.length; i++) {
        let npx = x + (poly.points[i].x * scale);
        let npy = y + (poly.points[i].y * scale);
        
        npx += random(-craziness, craziness);
        npy += 2;
        
        let np = new Point(npx, npy);
        plg.addPoint(np);
    }

    let color = platform.colortopdark;
    ctx.fillStyle = color;

    let tops = poly.tops;
    
    let pl = new Polylines();
    pl.createPolylines(tops);

    let pad = 5;

    let ptops = new Array();
    for (let i = 0; i < pl.polylines.length; i++) ptops[ptops.length] = this.createPlatformTop(pl.polylines[i], pad);

    let offset = pad;
    let shadowoffset = offset * 2;

    ctx.beginPath();
    plg.drawRound(ctx, 5);
    
    ctx.save();
    ctx.clip();
    ctx.beginPath();
    ctx.globalAlpha = .8;
    let shadow = "#879b1b";
    for (let i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    
    color = platform.colortoplight;
    ctx.beginPath();
    ctx.fillStyle = color;
    for (let i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true);
}

ItemRendererTree.prototype.createPlatformTop = function(top, pad) {

    let pg = new Polygon();
    let p;
    let np;

    p = top.points[0];
    np = new Point(p.x - pad, p.y - pad);
    pg.addPoint(np);
    
    let simple = false;
    if (top.points.length == 2) {
        simple = true;
        top.points[2] = top.points[1];
        
        let d = top.points[1].x - top.points[0].x;
        let rd = random(0, d);
        
        top.points[1] = new Point(top.points[0].x + rd, top.points[0].y);
    }

    for (let i = 0; i < top.points.length; i++) {
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

    let bpad = pad;
    if (simple) bpad = pad = random(0, pad);

    for (let i = top.points.length; i > 1; i--) {
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

    let angle = 50;
    let num = 5;
    let max = 8;

    let t = top.points.length;
    let pl = new Polygon();
    for (let i = 0; i < t; i++) {
        let p = new Point(x + (top.points[i].x * scale), y + (top.points[i].y * scale) + (offset * scale));
        pl.addPoint(p);
    }
    ctx.fillStyle = color;
    pl.drawRound(ctx, 4);
}