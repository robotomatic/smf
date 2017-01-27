"use strict";

/*

    TODO:
    
    - add knuckle and render smooth
    - randomize width, mid & blade width
    
    - use Image class to draw to main ctx

*/

function ItemDynamicGrass() { 
    this.pad = 0;
    this.grass = new Array();
    
    
    this.bladewidth = 3;
    
    this.dynamic = true;
    this.minupdate = 1;
    this.maxupdate = 1;
//    this.minupdate = 3;
//    this.maxupdate = 6;
    this.bladesway = 5;
    this.swayamount = 0.5;
    
    this.rectangle = new Rectangle(0, 0, 0, 0);
    this.point = new Point(0, 0);
    this.polygon = new Polygon();
    this.bladepoly = new Polygon();
    this.image = new Image(null, 0, 0, 0, 0);
}

ItemDynamicGrass.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale, name) {
    this.drawGrass(ctx, item, x, y, width, height, scale, titem, name);
}

ItemDynamicGrass.prototype.drawGrass = function(ctx, item, x, y, width, height, scale, titem, name) {

    var isf = item.scalefactor;
    var box = item.box;
    x = box.x;
    y = box.y;
    width = box.width;
    var hp = 2 * isf;
    height = box.height + hp;
    

    var spad = this.pad * scale;
    

    var id = item.id;
    var g = this.grass[id];
    if (g) {
        var animate = isf >= 0.8; 
        if (this.dynamic && animate) {
            this.updateGrass(ctx, item, titem, x, y, width, height, scale);
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
        var gy = this.pad * scale;
        var it = spad + (ih / 2);
        if (it >= ih) it = ih / 2;
        var ppp = 10 * item.scalefactor;
        var g = grassctx.createLinearGradient(0, it - (ppp * 3), 0, ih);
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
    
    var numblades = clamp(item.width / this.bladewidth) - 1;
    
    var sh = clamp(gh / numblades);
    
    var mid = clamp(numblades / 2) - 1;
    var angle = 0;
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
    
    var cx = this.point.x;
    var startangle = 0;
    if (angle) {
        if (angle.start) {
            var start = angle.start;
            var stop = angle.stop;
            startangle = random(start, stop);
            this.point.x = round(this.point.x + startangle);
            cx = this.point.x;
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
        startx : cx, 
        startangle : startangle,
        angle : 0,
        newangle : 0
    }
}

ItemDynamicGrass.prototype.updateGrass = function(ctx, item, titem, x, y, width, height, scale) {
    var id = item.id;
    if (item.renderupdate == 0) item.renderupdate = random(this.minupdate, this.maxupdate);
    if (item.rendercount++ < item.renderupdate) {
        this.renderGrass(ctx, id, x, y, width, height);
        return;
    }
    item.rendercount = 0;
    item.renderupdate = random(this.minupdate, this.maxupdate);
    this.animateGrass(ctx, item, titem, x, y, width, height, scale);   
}
    
ItemDynamicGrass.prototype.animateGrass = function(ctx, item, titem, x, y, width, height, scale) {
    var id = item.id;
    var grass = this.grass[id];
    if (!grass) return;
    clearRect(grass.ctx, 0, 0, grass.canvas.width, grass.canvas.height);
    
    grass.ctx.beginPath();
    var blades = grass.blades;
    for (var i = 0; i < blades.length; i++) {
        var blade = blades[i];
        
        this.bladepoly.points.length = 0;
        this.bladepoly.setPoints(blade.polygon.getPoints());
        
        if (this.bladepoly.points.length < 3) continue;
        
        var newangle = this.animateGrassBlade(grass, blade, scale, this.bladepoly);
        
        this.grass[id].blades[i].newangle = newangle;
        
        this.grass[id].blades[i].polygon.points.length =  0;
        this.grass[id].blades[i].polygon.setPoints(this.bladepoly.getPoints());
        this.bladepoly.pathSimple(grass.ctx);
    }
    
    grass.ctx.fill();
    this.renderGrass(ctx, id, x, y, width, height);
}

ItemDynamicGrass.prototype.animateGrassBlade = function(grass, blade, scale, poly) {

    var angle = blade.angle;
    var newangle = blade.newangle;
    
    if (newangle == angle) {
        var startangle = blade.startangle;
        var bs = this.bladesway;
        var bladerando = random(1, bs);
        if (newangle >= startangle) bladerando = -bladerando;
        newangle = startangle + bladerando;
    } else {
        var amount = this.swayamount;
        var nba = 0;
        if (newangle < angle) nba = angle - amount;
        else if (newangle > angle) var nba = angle + amount;
        poly.points[1].x = round(blade.startx + (nba * scale));
        blade.angle = nba;
    }
    
    return newangle;
}
    
ItemDynamicGrass.prototype.renderGrass = function(ctx, id, x, y, width, height) {
    var cg = this.grass[id];
    this.image.x = 0;
    this.image.y = 0;
    this.image.width = cg.canvas.width;
    this.image.height = cg.canvas.height;
    this.image.data = cg.canvas;
    this.image.draw(ctx, x, y, width, height);
}