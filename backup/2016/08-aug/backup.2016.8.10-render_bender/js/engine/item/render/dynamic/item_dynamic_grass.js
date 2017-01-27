"use strict";

/*

    TODO:
    
    - add knuckle and render smooth
    - randomize width, mid & blade width
    
    - use Image class to draw to main ctx

*/

function ItemDynamicGrass() { 
    this.pad = 20;
    this.grass = new Array();
    this.minupdate = 3;
    this.maxupdate = 9;
    this.bladewidth = 3;
    this.maxsway = 10;
    this.maxbladesway = 2;
    this.swayamount = .5;
    this.rectangle = new Rectangle(0, 0, 0, 0);
    this.point = new Point(0, 0);
    this.polygon = new Polygon();
    this.dynamic = true;
}

ItemDynamicGrass.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale, name) {
    this.drawGrass(ctx, item, x, y, width, height, scale, titem, name);
}

ItemDynamicGrass.prototype.drawGrass = function(ctx, item, x, y, width, height, scale, titem, name) {
    var spad = this.pad * scale;
    x -= spad;
    width += spad * 2;
    height += spad;
    y -= spad;
    var id = item.id;
    var g = this.grass[id];
    if (g) {
        if (this.dynamic) {
            this.updateGrass(ctx, item, x, y, width, height, scale);
            return;
        } else {
            this.renderGrass(ctx, id, x, y, width, height);
            return;
        }
    }
    var iw = item.width * scale;
    var ih = item.height * scale;
    var canvas = document.createElement('canvas');
    canvas.width = iw + (spad * 2);
    canvas.height = ih + spad;
    var grassctx = canvas.getContext("2d");
    var color = titem.renderer.color.light;
    if (color.gradient) {
        var gradient = color.gradient;
        var g = ctx.createLinearGradient(0, 0, 0, ih);
        var start = gradient.start;
        var stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
    }
    grassctx.fillStyle = color;
    var gx = spad;
    var gy = spad;
    var gw = iw;
    var gh = ih;
    var bw = this.bladewidth * scale;
    var numblades = clamp(item.width / this.bladewidth);
    var sh = clamp(gh / numblades);
    var mid = clamp(numblades / 2) - 1;
    var angle = null;
    if (item.iteminfo) {
        if (item.iteminfo.mid) mid = item.iteminfo.mid;
        if (item.iteminfo.angle) angle = item.iteminfo.angle;
    }
    this.grass[id] = {
        canvas : canvas,
        ctx : grassctx,
        id : id,
        blades : Array()
    };
    grassctx.beginPath();
    for (var i = 0; i < numblades; i++) {
        var bh = 0;
        if (i < mid) bh = ((i + 2) * sh) + sh;
        else if (i == mid) bh = gh;
        else  bh = (gh - ((i ) * sh)) + sh;
        var blade = this.drawGrassBlade(grassctx, gx, gy, gh, bh, bw, i, angle);
        this.grass[id].blades[i] = blade;
    }
    grassctx.fill();
    this.renderGrass(ctx, id, x, y, width, height);
}

ItemDynamicGrass.prototype.drawGrassBlade = function(ctx, bladex, bladey, bladeheight, thisheight, bladewidth, index, angle) {
    var bw = bladewidth;
    var bx = bladex + (bladewidth * index);   
    var by = bladey + bladeheight;
    var bh = round(random(thisheight * .75, thisheight));
    this.polygon.points.length = 0;
    this.point.x = round(bx);
    this.point.y = round(by);
    this.polygon.addPoint(this.point);
    this.point.x = round(this.point.x + bw);
    this.point.y = round(this.point.y - bh);
    var newangle = 0;
    if (angle) {
        if (angle.start) {
            var start = angle.start;
            var stop = angle.stop;
            newangle = random(start, stop);
            this.point.x = round(this.point.x + newangle);
        }
    }
    this.polygon.addPoint(this.point);
    this.point.info = "";
    this.point.x = round(bx + (bw * 2));
    this.point.y = round(this.point.y + bh);
    this.polygon.addPoint(this.point);
    this.polygon.pathSimple(ctx);
    return {
        polygon : new Polygon(this.polygon.getPoints()),
        startangle : newangle,
        angle : newangle,
        newangle : newangle
    }
}

ItemDynamicGrass.prototype.updateGrass = function(ctx, item, x, y, width, height, scale) {
    var id = item.id;
    if (item.renderupdate == 0) item.renderupdate = random(this.minupdate, this.maxupdate);
    if (item.rendercount++ < item.renderupdate) {
        this.renderGrass(ctx, id, x, y, width, height);
        return;
    }
    item.rendercount = 0;
    item.renderupdate = random(this.minupdate, this.maxupdate);
    this.animateGrass(ctx, item, x, y, width, height, scale);   
}
    
ItemDynamicGrass.prototype.animateGrass = function(ctx, item, x, y, width, height, scale) {
    var id = item.id;
    var grass = this.grass[id];
    if (!grass) return;
    clearRect(grass.ctx, 0, 0, grass.canvas.width, grass.canvas.height);
    var max = this.maxsway;
    var bmax = this.maxbladesway;
    var rando = random(-max, max);
    var amount = this.swayamount;
    grass.ctx.beginPath();
    var blades = grass.blades;
    for (var i = 0; i < blades.length; i++) {
        var blade = blades[i];
        var poly = blade.polygon;
        var startangle = blade.startangle;
        var angle = blade.angle;
        var newangle = blade.newangle;
        if (angle == newangle) {
            var bladerando = random(-bmax, bmax);
            newangle = startangle + rando + bladerando;
            this.grass[id].blades[i].newangle = newangle;
        }
        var d = newangle - angle;
        if (d < 0) {
            poly.points[1].x = round(poly.points[1].x - amount);
            this.grass[id].blades[i].angle -= amount;
        } else {
            poly.points[1].x = round(poly.points[1].x + amount);
            this.grass[id].blades[i].angle += amount;
        }
        this.grass[id].blades[i].polygon = poly;
        poly.pathSimple(grass.ctx);
    }
    grass.ctx.fill();
    this.renderGrass(ctx, id, x, y, width, height);
}

ItemDynamicGrass.prototype.renderGrass = function(ctx, id, x, y, width, height) {
    var cg = this.grass[id];
    
    // todo: needs to be image class
    
    ctx.drawImage(cg.canvas, x, y, width, height);
}