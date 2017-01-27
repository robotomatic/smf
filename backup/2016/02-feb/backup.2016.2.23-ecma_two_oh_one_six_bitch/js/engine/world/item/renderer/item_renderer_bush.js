"use strict";

function ItemRendererBush() {
    this.bushes = new Array();
}

ItemRendererBush.prototype.drawBush = function(ctx, item, x, y, width, height, scale, titem, drawdetails) {

    let id = item.id;
    if (this.bushes[id]) {
        this.drawBushCache(ctx, item, x, y, width, height);
        return;
    }

    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let cctx = canvas.getContext("2d");

    cctx.beginPath();
    let branches = new Path2D();
    let leaves = new Path2D();
    this.createBush(branches, leaves, item, width / 2, height / 2, scale);

    let color = titem.colorlight;
    let shadow = titem.colordark;

    let trans = 10;
    
    let bleaves;
    let dx;
    let dy;
    
    
    if (item.shadow) {
        cctx.save();
        if (item.shadow == "self") {
            let keys = Object.keys(this.bushes);
            let bush = this.bushes[keys[keys.length - 1]];
            bleaves = bush.leaves;
            dx = bush.x - x;
            dy = bush.y - y - (bush.canvas.height - height);
            cctx.translate(dx, dy);
        }
        cctx.fillStyle = "#5a5338";
        cctx.globalAlpha = .4;
        cctx.translate(trans, trans);
        if (item.shadow == "self") {
            cctx.clip(bleaves);
            cctx.translate(-dx, -dy);
        }
        cctx.fill(leaves);
        cctx.globalAlpha = 1;
        cctx.restore();
    }

    cctx.save();
    cctx.fillStyle = shadow;
    cctx.fill(leaves);
    
    cctx.clip(leaves);

    let g = cctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, color);
    g.addColorStop(1, shadow);
    color = g;

    trans = 5;
    cctx.translate(-trans, 0);
    cctx.fillStyle = color;
    
    cctx.fill(leaves);

    cctx.translate(trans, 0);
    
    cctx.strokeStyle = shadow;
    cctx.lineWidth = .5 * scale;
    cctx.stroke(branches);

    cctx.restore();
    
    this.bushes[id] = {
        id : id,
        canvas : canvas,
        ctx : cctx,
        leaves : leaves,
        branches : branches,
        x : x,
        y : y
    };
    
    this.drawBushCache(ctx, item, x, y, width, height);
}

ItemRendererBush.prototype.createBush = function(ctxbranches, ctxleaves, bush, width, height, scale) {

    let hw = width / 2;
    let hh = height / 2;
    let py = 5;
    let points = new Array();
    
    points[0] = new Point(0, py);

    points[1] = new Point(hw, py + height - (height / 4));
    
    points[2] = new Point(hw / 2, py + height);
    points[3] = new Point(-hw / 2, py + height);
    
    points[4] = new Point(-hw, py + height - (height / 4));
    
    let poly = new Polygon();
    poly.setPoints(points);
    poly.craziness(5);
    poly.translate(width, hh, 1);

    let mbr = poly.getMbr();
    let cp = poly.getCenter();

    let amount = 20;
    cp.y += amount + (hh / 2);
    poly.pathRound(ctxleaves, 2);
    this.createBranches(ctxbranches, ctxleaves, bush, cp, amount, width, height, scale, 0, true);
}

ItemRendererBush.prototype.createBranches = function(ctxbranches, ctxleaves, bush, cp, amount, width, height, scale, angle, details) {

    let degx = 30 * scale;
    let degy = 20 * scale;
    let pad = degy / 2;
    let amt = 5 * scale;
    let mbrw = (width + amt) * scale;
    let mbrh = (height + amt) * scale;

    let n = new Line(cp, new Point(cp.x, cp.y - (height / 2) - amt));
    this.createBranch(ctxbranches, ctxleaves, bush, n, amount, width, height, scale, angle);
    
    let ne = new Line(new Point(cp.x, cp.y), new Point(cp.x  + degx, cp.y - (amount * 2) - degy));
    this.createBranch(ctxbranches, ctxleaves, bush, ne, amount, width, height, scale, angle);
    
    let e = new Line(new Point(cp.x, cp.y), new Point(cp.x + (mbrw / 2), cp.y - (amount * 2)));
    this.createBranch(ctxbranches, ctxleaves, bush, e, amount, width, height, scale, angle);
    
    let nw = new Line(new Point(cp.x, cp.y), new Point(cp.x  - degx, cp.y - (amount * 2) - degy));
    this.createBranch(ctxbranches, ctxleaves, bush, nw, amount, width, height, scale, angle);
    
    let w = new Line(new Point(cp.x, cp.y), new Point(cp.x - (mbrw / 2), cp.y - (amount * 2)));
    this.createBranch(ctxbranches, ctxleaves, bush, w, amount, width, height, scale, angle);
    
//    if (details) {
//        let nee = new Line(cp, new Point(cp.x + amount - amt, cp.y - amount * 2));
//        this.createBranch(ctxbranches, ctxleaves, bush, nee, amount, width, height, scale, angle);
//        let s = new Line(cp, new Point(cp.x, cp.y + (mbrh / 2)));
//        this.createBranch(ctxbranches, ctxleaves, bush, s, amount, width, height, scale, angle);
//        let nww = new Line(cp, new Point(cp.x - amount + amt, cp.y - amount * 2));
//        this.createBranch(ctxbranches, ctxleaves, bush, nww, amount, width, height, scale, angle);
//    }
}


ItemRendererBush.prototype.createBranch = function(ctxbranches, ctxleaves, bush, line, amount, width, height, scale, angle) {

    if (width < 30 || height < 30) return;

    line = line.rotate(angle);
    line.path(ctxbranches);
    
    let a = line.angle() + 90;

    if (width > 80 && height > 80) {
        let leafwidth = width / 3;
        let leafheight = line.length();
        this.createLeaf(ctxleaves, line.end, leafwidth, leafheight, a);
    }
    
    this.createBranches(ctxbranches, ctxleaves, bush, line.end, amount / 2, width / 2, height / 3, scale / 2, angle + a, false);
}

ItemRendererBush.prototype.createLeaf = function(ctx, point, width, height, angle) {
    let x = point.x;
    let y = point.y - (height / 2);
    let poly = new Polygon();
    poly.addPoint(new Point(x, y));
    poly.addPoint(new Point(x + (width / 2), y + height));
    poly.addPoint(new Point(x, y + height));
    poly.addPoint(new Point(x - (width / 2), y + height));
    
    let points = poly.rotate(angle);
    
    poly.setPoints(points);
    
    let amt = 2;
    poly.pathRound(ctx, amt);
}

ItemRendererBush.prototype.drawBushCache = function(ctx, item, x, y, width, height) {
    if (item.angle) {
        ctx.save();
        let a = item.angle;
        let dx = x + width / 2;
        let dy = y + height / 2;
        ctx.translate(dx, dy);
        let rad = a * Math.PI / 180;
        ctx.rotate(rad);
        x = -width / 2;
        y = -height / 2;
    }
    let id = item.id;
    let cg = this.bushes[id];
    ctx.drawImage(cg.canvas, x, y, width, height);
    if (item.angle) ctx.restore();
}




