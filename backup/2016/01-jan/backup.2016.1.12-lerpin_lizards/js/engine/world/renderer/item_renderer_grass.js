ItemRendererGrass = function() { 
    this.grass = new Array();
}

ItemRendererGrass.prototype.drawGrass = function(ctx, item, x, y, width, height, scale, titem, drawdetails) {
    var id = item.id;
    if (this.grass[id]) {
        this.drawGrassCache(ctx, item, x + width / 2, y, width, height);
        return;
    }
    
    var canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height;
    var grassctx = canvas.getContext("2d");
    
    var color = titem.colorlight;
    var shadow = titem.colordark;
    
    var p = new Point(width, height);

    var max = 20;
    var angle = 45;

    var num = 4;
    var distance = 2;
    
    for (var d = 0; d < distance; d++) {
        for (var i = 0; i < num; i++) {
            var qm = i + (d * 10);
            var em = max / 8;
            var px = p.x + (qm * scale);
            var py = p.y + (em * scale);
            
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
    var id = item.id;
    var cg = this.grass[id];
    ctx.drawImage(cg.canvas, x, y, width, height);
}



ItemRendererGrass.prototype.draw = function(ctx, point, color, shadow, scale, angle, max) {
    var halfmax = max / 2;
    var rh = random(halfmax, max) * scale;
    var ra = random(0, angle);
    this.drawGrassBlade(ctx, point, color, shadow, scale, angle, max, rh, ra);
}

ItemRendererGrass.prototype.drawGrassBlade = function(ctx, point, color, shadow, scale, angle, max, height, rotation) {
    ctx.beginPath();
    
    var maxheight = max;
    var halfmax = maxheight / 2;
    var quadmax = halfmax / 2;
    var rw = quadmax * scale;
    var rx = point.x;
    var ry = point.y;
    var rt = rw / 2;
    ctx.save();
    var dx = rx + rw / 2;
    var dy = ry + height / 2;
    
    dy += 2 * scale;
    
    ctx.translate(dx, dy);
    var rad = rotation * Math.PI / 180;
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

    var r = random(0, 10);
    ctx.fillStyle = (r < 7) ? color : shadow;
    ctx.fill();
}

