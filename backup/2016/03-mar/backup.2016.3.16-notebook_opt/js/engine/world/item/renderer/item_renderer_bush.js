"use strict";

function ItemRendererBush() {
    this.bushes = new Array();
}

ItemRendererBush.prototype.drawBush = function(ctx, item, x, y, width, height, scale, titem, drawdetails) {

    var id = item.id;
    if (this.bushes[id]) {
        this.drawBushCache(ctx, item, x, y, width, height);
        return;
    }

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var cctx = canvas.getContext("2d");

    cctx.beginPath();
    var branches = new Path2D();
    var leaves = new Path2D();
    this.createBush(branches, leaves, item, width / 2, height / 2, scale);

    var color = titem.colorlight;
    var shadow = titem.colordark;

    var trans = 10;
    
    var bleaves;
    var dx;
    var dy;
    
    
    if (item.shadow) {
        cctx.save();
        if (item.shadow == "self") {
            var keys = Object.keys(this.bushes);
            var bush = this.bushes[keys[keys.length - 1]];
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

    var g = cctx.createLinearGradient(0, 0, 0, height);
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

    var hw = width / 2;
    var hh = height / 2;
    var py = 5;
    var points = new Array();
    
    points[0] = new Point(0, py);

    points[1] = new Point(hw, py + height - (height / 4));
    
    points[2] = new Point(hw / 2, py + height);
    points[3] = new Point(-hw / 2, py + height);
    
    points[4] = new Point(-hw, py + height - (height / 4));
    
    var poly = new Polygon();
    poly.setPoints(points);
    poly.craziness(5);
    poly.translate(width, hh, 1);

    var mbr = poly.getMbr();
    var cp = poly.getCenter();

    var amount = 20;
    cp.y += amount + (hh / 2);
    poly.pathRound(ctxleaves, 2);
    this.createBranches(ctxbranches, ctxleaves, bush, cp, amount, width, height, scale, 0, true);
}

ItemRendererBush.prototype.createBranches = function(ctxbranches, ctxleaves, bush, cp, amount, width, height, scale, angle, details) {

    var degx = 30 * scale;
    var degy = 20 * scale;
    var pad = degy / 2;
    var amt = 5 * scale;
    var mbrw = (width + amt) * scale;
    var mbrh = (height + amt) * scale;

    var n = new Line(cp, new Point(cp.x, cp.y - (height / 2) - amt));
    this.createBranch(ctxbranches, ctxleaves, bush, n, amount, width, height, scale, angle);
    
    var ne = new Line(new Point(cp.x, cp.y), new Point(cp.x  + degx, cp.y - (amount * 2) - degy));
    this.createBranch(ctxbranches, ctxleaves, bush, ne, amount, width, height, scale, angle);
    
    var e = new Line(new Point(cp.x, cp.y), new Point(cp.x + (mbrw / 2), cp.y - (amount * 2)));
    this.createBranch(ctxbranches, ctxleaves, bush, e, amount, width, height, scale, angle);
    
    var nw = new Line(new Point(cp.x, cp.y), new Point(cp.x  - degx, cp.y - (amount * 2) - degy));
    this.createBranch(ctxbranches, ctxleaves, bush, nw, amount, width, height, scale, angle);
    
    var w = new Line(new Point(cp.x, cp.y), new Point(cp.x - (mbrw / 2), cp.y - (amount * 2)));
    this.createBranch(ctxbranches, ctxleaves, bush, w, amount, width, height, scale, angle);
    
//    if (details) {
//        var nee = new Line(cp, new Point(cp.x + amount - amt, cp.y - amount * 2));
//        this.createBranch(ctxbranches, ctxleaves, bush, nee, amount, width, height, scale, angle);
//        var s = new Line(cp, new Point(cp.x, cp.y + (mbrh / 2)));
//        this.createBranch(ctxbranches, ctxleaves, bush, s, amount, width, height, scale, angle);
//        var nww = new Line(cp, new Point(cp.x - amount + amt, cp.y - amount * 2));
//        this.createBranch(ctxbranches, ctxleaves, bush, nww, amount, width, height, scale, angle);
//    }
}


ItemRendererBush.prototype.createBranch = function(ctxbranches, ctxleaves, bush, line, amount, width, height, scale, angle) {

    if (width < 30 || height < 30) return;

    line = line.rotate(angle);
    line.path(ctxbranches);
    
    var a = line.angle() + 90;

    if (width > 80 && height > 80) {
        var leafwidth = width / 3;
        var leafheight = line.length();
        this.createLeaf(ctxleaves, line.end, leafwidth, leafheight, a);
    }
    
    this.createBranches(ctxbranches, ctxleaves, bush, line.end, amount / 2, width / 2, height / 3, scale / 2, angle + a, false);
}

ItemRendererBush.prototype.createLeaf = function(ctx, point, width, height, angle) {
    var x = point.x;
    var y = point.y - (height / 2);
    var poly = new Polygon();
    poly.addPoint(new Point(x, y));
    poly.addPoint(new Point(x + (width / 2), y + height));
    poly.addPoint(new Point(x, y + height));
    poly.addPoint(new Point(x - (width / 2), y + height));
    
    var points = poly.rotate(angle);
    
    poly.setPoints(points);
    
    var amt = 2;
    poly.pathRound(ctx, amt);
}

ItemRendererBush.prototype.drawBushCache = function(ctx, item, x, y, width, height) {
    if (item.angle) {
        ctx.save();
        var a = item.angle;
        var dx = x + width / 2;
        var dy = y + height / 2;
        ctx.translate(dx, dy);
        var rad = a * Math.PI / 180;
        ctx.rotate(rad);
        x = -width / 2;
        y = -height / 2;
    }
    var id = item.id;
    var cg = this.bushes[id];
    ctx.drawImage(cg.canvas, x, y, width, height);
    if (item.angle) ctx.restore();
}




