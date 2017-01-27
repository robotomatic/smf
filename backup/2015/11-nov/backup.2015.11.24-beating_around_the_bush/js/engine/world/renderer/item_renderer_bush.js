ItemRendererBush = function() {
    this.bushes = new Array();
}

ItemRendererBush.prototype.drawBush = function(ctx, item, x, y, width, height, scale, titem, drawdetails) {

    var id = item.id;
    if (this.bushes[id]) {
        this.drawBushCache(ctx, item, x, y, width * 2, height * 2);
        return;
    }

    var bushcanvas = document.createElement('canvas');
    bushcanvas.width = width * 2;
    bushcanvas.height = height * 2;
    var bushctx = bushcanvas.getContext("2d");
    
    var canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    var cctx = canvas.getContext("2d");
    
    cctx.beginPath();
    this.createBush(cctx, item, width, height, scale);

    var color = titem.colorlight;
    var shadow = titem.colordark;
    
    if (item.shadow) {
        cctx.fillStyle = "#5a5338";
        cctx.globalAlpha = .4;
        cctx.fill();
        var trans = 10;
        bushctx.drawImage(canvas, trans, trans, width * 2, height * 2);
        cctx.globalAlpha = 1;
    }

    cctx.save();
    
    cctx.fillStyle = shadow;
    cctx.fill();
    
    bushctx.drawImage(canvas, 0, 0, width * 2, height * 2);

    cctx.clip();

    var g = cctx.createLinearGradient(0, 0, 0, height * 2);
    g.addColorStop(0, color);
    g.addColorStop(1, shadow);
    color = g;
    
//    cctx.translate(-width + 50, -height + 50);

    cctx.fillStyle = color;
    cctx.fill();
    
//    cctx.beginPath();
//    var rect = new Rectangle(0, 0, width * 2, height * 2);
//    var pg = new Polygon();
//    pg.setPoints(rect.getPoints());
//    pg.craziness(10);
//    pg.drawRound(cctx, 2);
    
    bushctx.drawImage(canvas, -2, -2, width * 2, height * 2);
    
    cctx.restore();
    
    this.bushes[id] = {
        canvas : bushcanvas,
        ctx : bushctx,
        id : id
    };
    
    this.drawBushCache(ctx, item, x, y, width * 2, height * 2);
}

ItemRendererBush.prototype.createBush = function(ctx, bush, width, height, scale) {
    var hw = width / 2;
    var hh = height / 2;
    var py = 10;
    var points = new Array();
    points[0] = new Point(hw / 2, py);
    points[1] = new Point(hw / 2 + hw, py);
    points[2] = new Point(width, py + height);
    points[3] = new Point(0, py + height);
    var poly = new Polygon();
    poly.setPoints(points);
    poly.craziness(5);
    poly.translate(hw, hh, 1);
    var amt = 2.5;
    var mbr = poly.getMbr();
    var cp = poly.getCenter();
    var amount = 20;
    cp.y += amount;
    poly.pathRound(ctx, 20);
    this.createBranches(ctx, bush, cp, amount, width, height, scale, true);
}

ItemRendererBush.prototype.createBranches = function(ctx, bush, cp, amount, width, height, scale, details) {
    var degx = 30 * scale;
    var degy = 20 * scale;
    var pad = degy / 2;
    var amt = 5 * scale;
    var mbrw = (width + amt) * scale;
    var mbrh = (height + amt) * scale;
    var n = new Line(cp, new Point(cp.x, cp.y - amount - (mbrh / 2)));
    this.createBranch(ctx, bush, n, amount, width, height, scale);
    var ne = new Line(cp, new Point(cp.x  + degx, cp.y - amount - degy));
    this.createBranch(ctx, bush, ne, amount, width, height, scale);
    var e = new Line(cp, new Point(cp.x + (mbrw / 4), cp.y + pad));
    this.createBranch(ctx, bush, e, amount, width, height, scale);
    var nw = new Line(cp, new Point(cp.x  - degx, cp.y - amount - degy));
    this.createBranch(ctx, bush, nw, amount, width, height, scale);
    var w = new Line(cp, new Point(cp.x - (mbrw / 4), cp.y + pad));
    this.createBranch(ctx, bush, w, amount, width, height, scale);
    if (details) {
        var nee = new Line(cp, new Point(cp.x + degx / 2 + pad, cp.y - (mbrh / 2) + pad));
        this.createBranch(ctx, bush, nee, amount, width, height, scale);
        var s = new Line(cp, new Point(cp.x, cp.y + (mbrh / 2)));
        this.createBranch(ctx, bush, s, amount, width, height, scale);
        var nww = new Line(cp, new Point(cp.x - degx / 2 - pad, cp.y - (mbrh / 2) + pad));
        this.createBranch(ctx, bush, nww, amount, width, height, scale);
    }
}


ItemRendererBush.prototype.createBranch = function(ctx, bush, line, amount, width, height, scale) {
    if (width < 30 || height < 30) return;
    var branchcolor = bush.colordark;
    var branchweight = 2 * scale;
    
//    line.draw(ctx, branchcolor, branchweight);
    var a = line.angle() + 90;
    var w = 20 * scale;
    var h = 10 * scale;
    var p  = line.end;
    var x = p.x - (w / 2);
    var y = p.y - (h / 2);
    var dx = x + w / 2;
    var dy = y + h / 2;
    ctx.translate(dx, dy);
    var rad = a * Math.PI / 180;
    ctx.rotate(rad);
    x = -w / 2;
    y = -h / 2;
    
    var pp = new Point(x + (w / 2), y + (h / 2));
    this.createLeaf(ctx, pp.x, pp.y - 5, 35, 30);
    this.createBranches(ctx, bush, pp, amount / 2, width / 2, height / 3, scale / 2, false);
    
    ctx.rotate(-rad);
    ctx.translate(-dx, -dy);
}

ItemRendererBush.prototype.createLeaf = function(ctx, x, y, width, height) {
    var poly = new Polygon();
    poly.addPoint(new Point(x - (width / 2), y + height));
    poly.addPoint(new Point(x, y));
    poly.addPoint(new Point(x + (width / 2), y + height));
    poly.addPoint(new Point(x, y + height));
    var amt = 5;
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




