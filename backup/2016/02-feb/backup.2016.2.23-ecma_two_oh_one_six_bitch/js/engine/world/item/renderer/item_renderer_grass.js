"use strict";

function ItemRendererGrass() { 
    this.grass = new Array();
}

ItemRendererGrass.prototype.drawGrass = function(ctx, item, x, y, width, height, scale, titem, drawdetails) {
    let id = item.id;
    if (this.grass[id]) {
        this.drawGrassCache(ctx, item, x + width / 2, y, width, height);
        return;
    }
    
    let canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height;
    let grassctx = canvas.getContext("2d");
    
    let color = titem.colorlight;
    let shadow = titem.colordark;
    
    let p = new Point(width, height);

    let max = 20;
    let angle = 45;

    let num = 4;
    let distance = 2;
    
    for (let d = 0; d < distance; d++) {
        for (let i = 0; i < num; i++) {
            let qm = i + (d * 10);
            let em = max / 8;
            let px = p.x + (qm * scale);
            let py = p.y + (em * scale);
            
            this.draw(grassctx, new Point(p.x + (30 * scale), p.y), color, shadow, scale, angle / 2, max / 2);
            this.draw(grassctx, new Point(p.x + (20 * scale), p.y), color, shadow, scale, angle / 2, max / 1.5);
            this.draw(grassctx, new Point(p.x + (10 * scale), p.y), color, shadow, scale, angle, max);

            this.draw(grassctx, new Point(p.x - (30 * scale), p.y), color, shadow, scale, -angle / 2, max / 2);
            this.draw(grassctx, new Point(p.x - (20 * scale), p.y), color, shadow, scale, -angle / 2, max / 1.5);
            this.draw(grassctx, new Point(p.x - (10 * scale), p.y), color, shadow, scale, -angle, max);
        }
    }
    
    
    this.grass[id] = {
        canvas : canvas,
        ctx : grassctx,
        id : id
    };
    
    this.drawGrassCache(ctx, item, x + width / 2, y, width, height);
}


ItemRendererGrass.prototype.drawGrassCache = function(ctx, item, x, y, width, height) {
    let id = item.id;
    let cg = this.grass[id];
    ctx.drawImage(cg.canvas, x, y, width, height);
}



ItemRendererGrass.prototype.draw = function(ctx, point, color, shadow, scale, angle, max) {
    let halfmax = max / 2;
    let rh = random(halfmax, max) * scale;
    let ra = random(0, angle);
    this.drawGrassBlade(ctx, point, color, shadow, scale, angle, max, rh, ra);
}

ItemRendererGrass.prototype.drawGrassBlade = function(ctx, point, color, shadow, scale, angle, max, height, rotation) {
    ctx.beginPath();
    
    let maxheight = max;
    let halfmax = maxheight / 2;
    let quadmax = halfmax / 2;
    let rw = quadmax * scale;
    let rx = point.x;
    let ry = point.y;
    let rt = rw / 2;
    ctx.save();
    let dx = rx + rw / 2;
    let dy = ry + height / 2;
    
    dy += 2 * scale;
    
    ctx.translate(dx, dy);
    let rad = rotation * Math.PI / 180;
    ctx.rotate(rad);
    rx = (angle < 0) ? rw * 2: -rw * 2;
    ry = -height / 2;
    ry += 1;
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - rt, ry);
    if (angle < 0) ctx.quadraticCurveTo(rx, ry - height, rx - (rt * 2), ry - (height * 2));
    else ctx.quadraticCurveTo(rx, ry - height, rx + (rt * 2), ry - (height * 2));
    ctx.quadraticCurveTo(rx + rt, ry - height, rx + rt, ry);
    ctx.lineTo(rx + rt, ry);
    ctx.closePath();
    ctx.restore();

    let r = random(0, 10);
    ctx.fillStyle = (r < 7) ? color : shadow;
    ctx.fill();
}

