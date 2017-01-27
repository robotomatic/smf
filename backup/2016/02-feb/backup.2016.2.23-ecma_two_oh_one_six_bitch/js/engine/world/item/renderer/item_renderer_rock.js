"use strict";

function ItemRendererRock() {
    this.rocks = new Array();
}

ItemRendererRock.prototype.drawRock = function(ctx, item, x, y, width, height, scale, titem, drawdetails) {
    
    let id = item.id;
    if (this.rocks[id]) {
        this.drawRockCache(ctx, item, x, y, width, height);
        return;
    }
    
    y -= 2 * scale;
    height += 2 * scale;
    
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let cctx = canvas.getContext("2d");
    
    let color = titem.colorlight;
    let shadow = titem.colordark;
    
    let g = cctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, color);
    g.addColorStop(1, shadow);
    color = g;
    
    cctx.fillStyle = color;
    let rect = new Rectangle(0, 0, width, height);
    let poly = new Polygon();
    let points = rect.getPoints();
    poly.setPoints(points);
    poly.craziness(5);
    
    let amt = 4;
    
    cctx.beginPath();
    poly.drawRound(cctx, amt);
    
    cctx.save();
    cctx.clip();

    let lw = .2 * scale;
    
    let rh = height * .3;
    let rw = width * 3;
    let rx = -width;
    let ry = -rh / 2;

    
    let a = random(0, 10);
    let dx = rx + rw / 2;
    let dy = ry + rh / 2;
    cctx.translate(dx, dy);
    let rad = a * Math.PI / 180;
    cctx.rotate(rad);
    rx = -rw / 2;
    ry = -rh / 2;

    cctx.beginPath();
    
    let rpoly = new Polygon();
    let rps = new Array();
    rps[0] = new Point(rx, ry);
    rps[1] = new Point(rx + rw, ry);
    rps[2] = new Point(rx + rw, ry + rh);
    rps[3] = new Point(rx, ry +rh);
    rpoly.setPoints(rps);
    rpoly.craziness(2);
    rpoly.drawOutlineRound(cctx, 2, shadow, lw);
    
    amt = random(2, 10);
    
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
    let cg = this.rocks[id];
    ctx.drawImage(cg.canvas, x, y, width, height);
    if (item.angle) ctx.restore();
}
