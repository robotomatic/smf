ItemRendererRock = function() {
    this.rocks = new Array();
}

ItemRendererRock.prototype.drawRock = function(ctx, item, x, y, width, height, scale, titem, drawdetails) {
    
    var id = item.id;
    if (this.rocks[id]) {
        this.drawRockCache(ctx, item, x, y, width, height);
        return;
    }
    
    y -= 2 * scale;
    height += 2 * scale;
    
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var cctx = canvas.getContext("2d");
    
    var color = titem.colorlight;
    var shadow = titem.colordark;
    
    var g = cctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, color);
    g.addColorStop(1, shadow);
    color = g;
    
    cctx.fillStyle = color;
    var rect = new Rectangle(0, 0, width, height);
    var poly = new Polygon();
    var points = rect.getPoints();
    poly.setPoints(points);
    poly.craziness(5);
    
    var amt = 4;
    
    cctx.beginPath();
    poly.drawRound(cctx, amt);
    
    cctx.save();
    cctx.clip();

    var lw = .2 * scale;
    
    var rh = height * .3;
    var rw = width * 3;
    var rx = -width;
    var ry = -rh / 2;

    
    var a = random(0, 10);
    var dx = rx + rw / 2;
    var dy = ry + rh / 2;
    cctx.translate(dx, dy);
    var rad = a * Math.PI / 180;
    cctx.rotate(rad);
    rx = -rw / 2;
    ry = -rh / 2;

    cctx.beginPath();
    
    var rpoly = new Polygon();
    var rps = new Array();
    rps[0] = new Point(rx, ry);
    rps[1] = new Point(rx + rw, ry);
    rps[2] = new Point(rx + rw, ry + rh);
    rps[3] = new Point(rx, ry +rh);
    rpoly.setPoints(rps);
    rpoly.craziness(2);
    rpoly.drawOutlineRound(cctx, 2, shadow, lw);
    
    var amt = random(2, 10);
    
    rpoly.translate(0, amt, 1);
    rpoly.drawOutlineRound(cctx, 2, shadow, lw);
    
    cctx.restore();
    
    this.rocks[id] = {
        canvas : canvas,
        ctx : cctx,
        id : id
    };
    
    this.drawRockCache(ctx, item, x, y, width, height);
}


ItemRendererRock.prototype.drawRockCache = function(ctx, item, x, y, width, height) {
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
    var cg = this.rocks[id];
    ctx.drawImage(cg.canvas, x, y, width, height);
    if (item.angle) ctx.restore();
}
