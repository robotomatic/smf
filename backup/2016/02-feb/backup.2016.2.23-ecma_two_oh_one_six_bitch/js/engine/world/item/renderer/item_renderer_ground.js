"use strict";

function ItemRendererGround() {
    
    // todo: need to add turf and grass separately...
    // make sure things aren't being cached 2x...
    
}

ItemRendererGround.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    if (!scale) scale = 1;
    let poly = new Polygon();
    poly.createPolygon(item.parts);
    let tops = poly.tops;
    poly.craziness(3);
    poly.translate(x, y, scale);
    let mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    let color = platform.colorlight;
    let colordark = platform.colordark;
    this.drawGround(ctx, poly, x, y, width, height, scale, color, colordark, 25);
    this.drawPlatformTops(ctx, tops, x, y, scale, platform.colortoplight);
//    drawDebug(ctx, item, x, y, scale);
}

ItemRendererGround.prototype.drawPlatformBg = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    if (!scale) scale = 1;
    let poly = new Polygon();
    poly.createPolygon(item.parts);
    poly.craziness(5);
    poly.translate(x, y, scale);
    let mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    let color = platform.colorlight;
    let colordark = platform.colordark;
    this.drawGround(ctx, poly, x, y, width, height, scale, color, colordark, 45);
    ctx.restore();
//    drawDebug(ctx, item, x, y, scale);
}

ItemRendererGround.prototype.drawGround = function(ctx, polygon, x, y, width, height, scale, color, colordark, step) {
    let gy = y;
    let h = 400;
    ctx.save();
    let fcolor = "white";
    if (color.gradient) {
        let gradient = color.gradient;
        let g = ctx.createLinearGradient(0, gy, 0, h + gy);
        let start = gradient.start;
        let stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
    }
    if (colordark.gradient) {
        let gradient = color.gradient;
        let g = ctx.createLinearGradient(0, gy, 0, h + gy);
        let start = gradient.start;
        let stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        colordark = g;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    polygon.drawRound(ctx, 20);
    ctx.clip();
    this.drawGroundLines(ctx, x, y, width, height, scale, colordark, step);
    this.drawGroundStones(ctx, x, y, width, height, scale, color, colordark);
}
    
ItemRendererGround.prototype.drawGroundLines = function(ctx, x, y, width, height, scale, color, step) {
    ctx.strokeStyle = color;
    ctx.lineWidth = .2 * scale;
//    ctx.beginPath();
    let wstep = 20;
    if (height <= step) step = height / 2;
    let amp = random(0, 10);
    let inc = 1;
    for (let i = step; i < height; i+= step) {
        let s = i * scale;
        ctx.moveTo(x, y + s);
        for (let ii = 0; ii < width; ii += wstep) {
            amp+= inc;
            if (amp > 10) inc = -1;
            else if (amp < 0) inc = 1;
            ctx.lineTo(x + ii, y + s + amp);
        }
    }
    ctx.stroke();
}

ItemRendererGround.prototype.drawGroundStones = function(ctx, x, y, width, height, scale, color, darkcolor) {
    let amt = height * .25;
    if (amt < 30) amt = 30;
    let max = 3;
    let tot = random(0, max);
    let double = false;
    for (let i = 0; i < tot; i++) {
        let cx = random(x, x + (width - amt));
        let cy = random(y, y + (height - amt));
        let cw = random(amt / 2, amt);
        let ch = cw;
        this.drawGroundStone(ctx, cx, cy, cw, ch, scale, color, darkcolor);
        let dd = random (1, 5);
        if (dd < 3 && !double) {
            let hcw = cw / 1.3;
            let hch = ch / 1.3;
            this.drawGroundStone(ctx, cx + hcw, cy + hch, cw / 2, ch / 2, scale, color, darkcolor);
            double = true;
        }
    }
    
}

ItemRendererGround.prototype.drawGroundStone = function(ctx, x, y, width, height, scale, color, darkcolor) {
    ctx.beginPath();
    let poly = new Polygon();
    let amt = width / 5;
    poly.addPoint(new Point(x, y));
    poly.addPoint(new Point(x + width / 2, y - amt));
    poly.addPoint(new Point(x + width, y));
    poly.addPoint(new Point(x +width + amt, y + height / 2));
    poly.addPoint(new Point(x + width, y + height));
    poly.addPoint(new Point(x + width / 2, y + height + amt));
    poly.addPoint(new Point(x, y + height));
    poly.addPoint(new Point(x - amt, y + height / 2));
    let a = random(0, 360);
    let points = poly.rotate(a);
    poly.setPoints(points);
//    poly.craziness(.5);
    let weight = .2 * scale;
    ctx.fillStyle = color;
    let rad = 5 * scale;
    poly.drawRound(ctx, rad);
    poly.drawOutlineRound(ctx, rad, darkcolor, weight);
//    poly.draw(ctx, true, darkcolor, weight);
}























ItemRendererGround.prototype.drawPlatformTops = function(ctx, tops, x, y, scale, color) {
    let pl = new Polylines();
    pl.createPolylines(tops);
    let pad = 5;
    let ptops = new Array();
    for (let i = 0; i < pl.polylines.length; i++) ptops[ptops.length] = this.createPlatformTop(pl.polylines[i], pad);
    let offset = pad;
    let shadowoffset = offset * 1.5;
    let shadow = "#92938b";
    ctx.globalAlpha = .8;
    for (let i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    
    for (let i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true);
}

ItemRendererGround.prototype.createPlatformTop = function(top, pad) {
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

ItemRendererGround.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset, details) {

    let mbr = top.getMbr();
    if (mbr.width < 15 || mbr.height < 5) return;
    
    let angle = 50;
    let num = 15;
    let max = 12;
    let shadow = "#9dac4c";
    let t = top.points.length;
    let pl = new Polygon();
    for (let i = 0; i < t; i++) {
        let p = new Point(x + (top.points[i].x * scale), y + (top.points[i].y * scale) + (offset * scale));
        pl.addPoint(p);
        if (i == 0) {
            let distance = 1;
            let l = new Line(top.points[1], top.points[2]);
            let ld = l.length();
            if (ld > 60) {
                distance = 2;
                max = 8;
            }
            this.drawPlatformTopGrassStart(ctx, p, color, shadow, scale, max + 3, num / 3, angle + 10, distance);
        } else {
            let h = Math.round(t / 2, 0) - 1;
            if (i == h) {
                let distance = 1;
                let l = new Line(top.points[i - 2], top.points[i - 1]);
                let ld = l.length();
                if (ld > 60) {
                    distance = 2;    
                    max = 8;
                }
                this.drawPlatformTopGrassEnd(ctx, p, color, shadow, scale, max + 3, num / 3, angle + 10, distance);
            } else if (i < h - 2) {
//                this.drawPlatformTopGrassMid(ctx, p, color, scale, max, num, 0);
            }
        }
    }
    
    
    
    ctx.fillStyle = color;
    pl.drawRound(ctx, 20);
}

ItemRendererGround.prototype.drawPlatformTopGrassStart = function(ctx, point, color, shadow, scale, max, num, angle, distance) {
    for (let d = 0; d < distance; d++) {
        for (let i = 0; i < num; i++) {
            let qm = i + (d * 10);
            let em = max / 8;
            let px = point.x + (qm * scale);
            let py = point.y + (em * scale);;
            let grass = new ItemRendererGrass();
            grass.draw(ctx, new Point(px, py), color, shadow, scale, -angle, max);
            grass.draw(ctx, new Point(px + (10 * scale), py), color, shadow, scale, -angle / 2, max / 1.5);
            grass.draw(ctx, new Point(px + (15 * scale), py), color, shadow, scale, -angle / 2, max / 2);
        }
    }
    
}

ItemRendererGround.prototype.drawPlatformTopGrassEnd = function(ctx, point, color, shadow, scale, max, num, angle, distance) {
    for (let d = 0; d < distance; d++) {
        for (let i = 0; i < num; i++) {
            let qm = i + (d * 10);
            let em = max / 8;
            let px = point.x - (qm * scale);
            let py = point.y + (em * scale);
            let grass = new ItemRendererGrass();
            grass.draw(ctx, new Point(px, py), color, shadow, scale, 30, max, angle);
            grass.draw(ctx, new Point(px - (10 * scale), py), color, shadow, scale, angle / 2, max / 1.5);
            grass.draw(ctx, new Point(px - (15 * scale), py), color, shadow, scale, angle / 2, max / 2);
        }
    }
}

ItemRendererGround.prototype.drawPlatformTopGrassMid = function(ctx, point, color, scale, max, num, angle) {
//    for (let i = 0; i < num; i ++) {
//        let ii = i * 2;
//        let qm = ii + (max / 4);
//        let em = max / 8;
//        let px = point.x + (qm * scale);
//        let py = point.y + (em * scale);;
//        let grass = new Grass();
//        grass.draw(ctx, new Point(px - (5 * scale), py), color, scale, -angle / 2, max / 2);
//        grass.draw(ctx, new Point(px + (5 * scale), py), color, scale, -angle / 2, max / 2);
//    }
}

