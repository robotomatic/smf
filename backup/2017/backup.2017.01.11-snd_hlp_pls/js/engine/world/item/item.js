"use strict";

function Item() {
    
    this.id = "";

    this.name = "";
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;
    this.location = new Point(0, 0);
    
    
    this.item3D = new Item3D(this);
    this.projectedlocation = new Point(0, 0);

    this.extrude = 0;
    
    this.last_ax = 0;
    this.last_now = 0;
    
    this.width = 0;
    this.height = 0;

    this.scalefactor = 1;

    this.graphics = "main";
    
    this.depth = 0;
    this.parallax = 0;
    this.blur = "";
    this.cache = false;
    
    this.top = false;
    this.bottom = false;
    this.invert = false;

    this.rendercount = 0;
    this.renderupdate = 0;
    
    this.radius = "";
    this.ramp = "";
    this.angle = "";

    this.actionnum = 0;
    this.originx = 0;
    this.originy = 0;
    this.velX = 0;
    this.velY = 0;
    this.angle = 0;
    
    this.collide = "";
    this.draw = true;
    this.animate = false;
    
    this.itemtype = "";
    this.iteminfo = "";

    this.shadow = false;

    this.animator = null;
    this.collisions = new Array(); 
    
    this.actions = null;
    this.action = null;
    this.parts = null;
    this.keys = null;
    
    this.mbr = new Rectangle();
    
    this.box = new Rectangle(0, 0, 0, 0);
    
    this.top = false;
    this.polygon = new Polygon();
    this.tops = new Array();
    
    this.pad = 5;
    this.polylines = new Polylines();
    this.polytops = new Array();
    this.np = new Point(0, 0);
    
    this.pnew = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    
    this.geometry = {
        projected : new Polygon(),
        fronts : new Array(),
        tops : new Array(),
        sides : new Array(),
        bottoms : new Array()
    }
    this.projectedmbr = new Rectangle(0, 0, 0, 0);

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d")
    this.image = new Image(null, 0, 0, 0, 0);
    this.imagepad = 10;
}

Item.prototype.loadJson = function(json) {

    var name = json.name ? json.name : "default";
    this.name = name;
    
    var itemtype = json.itemtype ? json.itemtype : "default";
    this.itemtype = itemtype;
    this.iteminfo = json.iteminfo;
    
    this.x = json.x;
    this.y = json.y;
    this.z = json.z;
    this.width = json.width;
    this.height = json.height;
    this.depth = json.depth;

    if (json.graphics) this.graphics = json.graphics;
    this.blur = json.blur;
    
    this.radius = json.radius;
    this.ramp = json.ramp;
    this.angle = json.angle;
    
    this.collide = json.collide;
    this.draw = json.draw;
    this.animate = json.animate;

    this.shadow = json.shadow;
    
    this.actions = json.actions;
    this.top = json.top;
    this.bottom = json.bottom;
    this.parts = json.parts;
}





Item.prototype.initialize = function() {
    if (this.parts) {
        this.keys = Object.keys(this.parts);
        this.getPolygon();
    }
    if (!this.width || !this.height) {
        this.getMbr();
        if (this.mbr) {
            this.width = this.mbr.width;
            this.height = this.mbr.height;
        }
    }
    this.id = this.name + "_" + this.itemtype + "_" + this.x + "_" + this.y + "_" + this.z;
}






    
    
Item.prototype.getMbr = function() {
    var ip = this.getLocation();
    this.mbr.x = ip.x;
    this.mbr.y = ip.y;
    if (this.parts) {
        var maxx = 0;
        var maxy = 0;
        for (var i = 0; i < this.parts.length; i++) {
            var part = this.parts[i];
            if (maxx == 0 || maxx < part.x + part.width) maxx = part.x + part.width;
            if (maxy == 0 || maxy < part.y + part.height) maxy = part.y + part.height;
        }
        this.mbr.width = maxx;
        this.mbr.height = maxy;
    } else {
        this.mbr.width = this.width;
        this.mbr.height = this.height;
    }
    this.mbr.z = this.z;
    this.mbr.depth = this.depth;
    return this.mbr;
}

Item.prototype.getProjectedMbr = function() {
    this.projectedmbr.x = this.box.x;
    this.projectedmbr.y = this.box.y;
    this.projectedmbr.width = this.box.width;
    this.projectedmbr.height = this.box.height;
    this.projectedmbr = this.getProjectedGeometryMbr(this.geometry.tops, this.projectedmbr);
    this.projectedmbr = this.getProjectedGeometryMbr(this.geometry.bottoms, this.projectedmbr);
    this.projectedmbr = this.getProjectedGeometryMbr(this.geometry.sides, this.projectedmbr);
    return this.projectedmbr;
}

Item.prototype.getProjectedGeometryMbr = function(geometry, mbr) {
    var t = geometry.length;
    for (var i = 0; i < t; i++) {
        var g = geometry[i];
        var gmbr =  g.getMbr();
        if (gmbr.x < mbr.x) {
            var d = mbr.x - gmbr.x;
            mbr.x = gmbr.x;
            mbr.width += d;
        }
        if (gmbr.y < mbr.y) {
            var d = mbr.y - gmbr.y;
            mbr.y = gmbr.y;
            mbr.height += d;
        }
        if ((gmbr.x + gmbr.width) >= mbr.x + mbr.width) mbr.width = gmbr.x + gmbr.width - mbr.x;
        if ((gmbr.y + gmbr.height) >= mbr.y + mbr.height) mbr.height = gmbr.y + gmbr.height - mbr.y;
    }
    mbr.z = this.z;
    mbr.depth = this.depth;
    return mbr;
}



Item.prototype.isVisible = function(w, wmbr, pad = 0) {
    if (this.draw == false) return false;
    var mbr = this.getProjectedMbr();
    if (this.width != "100%") {
        if (mbr.x > (w.x + w.width + pad)) return false;
        if ((mbr.x + mbr.width) < w.x - pad) return false;
    }
    if (this.height != "100%") {
        if (mbr.y > (w.y + w.height + pad)) return false;
        if ((mbr.y + mbr.height) < w.y - pad) return false;
    }
    if (this.depth != "100%") {
        if (mbr.z + mbr.depth < w.z - pad) return false;
    }
    return true;
}





Item.prototype.getPolygon = function() {
    if (this.polygon.points.length) return this.polygon;
    this.polygon.points.length = 0;
    if (this.parts) this.polygon.createPolygon(this.parts);
    else this.polygon.createPolygon([this.getMbr()]);
    this.tops = this.polygon.tops;
    this.createPolygonTops();
    return this.polygon;
}

Item.prototype.createPolygonTops = function() {
    this.polylines.createPolylines(this.tops);
    for (var i = 0; i < this.polylines.polylines.length; i++) this.polytops[i] = this.createPolygonTop(this.polylines.polylines[i]);
}

Item.prototype.createPolygonTop = function(top) {
    // todo: this is part of the theme
    var pad = 1;
    var pg = new Polygon();
    var p;
    var np;
    for (var i = 0; i < top.points.length; i++) {
        p = top.points[i];
        this.np.x = p.x;
        this.np.y = p.y;
        pg.addPoint(this.np);
    }
    for (var i = top.points.length; i > 0; i--) {
        p = top.points[i - 1];
        this.np.x = p.x;
        this.np.y = p.y + pad;
        pg.addPoint(this.np);
    }
    return pg;
}







Item.prototype.update = function(now, delta) { 
    this.move(now, delta);
}



Item.prototype.move = function(now, delta) { 
    if (!this.actions) return;
    if (this.draw == false) return;
    if (!this.animator) this.animator = new ItemAnimator();
    this.animator.animate(now, this, delta);
}

Item.prototype.smooth = function() { 
    if (!this.action) return;
    if (!this.lastX) this.lastX = this.x;
    var dx = (this.x - this.lastX) / 2;
    if (dx) this.lastX = round(this.lastX + dx);
    else this.lastX = this.x;
    if (!this.lastY) this.lastY = this.y;
    var dy = (this.y - this.lastY) / 2;
    if (dy) this.lastY = round(this.lastY + dy);
    else this.lastY = this.y;
    if (!this.lastZ) this.lastZ = this.z;
    var dz = (this.z - this.lastZ) / 2;
    if (dz) this.lastZ = round(this.lastZ + dz);
    else this.lastZ = this.z;
}

Item.prototype.getLocation = function() {
    if (this.action) {
        this.location.x = this.lastX;
        this.location.y = this.lastY;
        this.location.z = this.lastZ;
    } else {
        this.location.x = this.x;
        this.location.y = this.y;
        this.location.z = this.z;
    }
    return this.location;   
}




Item.prototype.translate = function(window, width, height) {
    
    var wc = window.getCenter();
    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale;
    
    var ip = this.getLocation();
    
    var ix = (ip.x - x) * scale;
    var iy = (ip.y - y) * scale;
    var iz = (ip.z - z) * scale;
    
    var iw = this.width * scale;
    var ih = this.height * scale;
    var id = this.depth * scale;

    if (this.width === "100%") {
        ix = -200;
        iw = width + 400;
    }
    if (this.height === "100%") {
        iy = -200;
        ih = height + 200;
    }
    var bw = iw;
    var dwh = ih / iw;

    if (iz < -(__fov - 1)) {
        var nz = __fov - 1;
        id -= Math.abs(iz) - Math.abs(nz);
        iz = -nz;
    }
    var dwd = id / iw;
    
    this.pnew.x = ix;
    this.pnew.y = iy + ih;
    this.np1 = projectPoint3D(this.pnew, iz, scale, x, y, wc, this.np1);

    this.pnew.x = ix + iw;
    this.pnew.y = iy + ih;
    this.np2 = projectPoint3D(this.pnew, iz, scale, x, y, wc, this.np2);

    var nw = Math.abs(this.np2.x - this.np1.x);
    iw = nw;

    this.scalefactor = iw / bw;

    var nh = iw * dwh;
    ih = nh;
    
    var nd = id * this.scalefactor;
    id = nd;

    ix = this.np1.x;
    iy = this.np1.y - ih;
    
    this.box.x = round(ix);
    this.box.y = round(iy);
    this.box.z = round(iz);
    this.box.width = round(iw);
    this.box.height = round(ih);
    this.box.depth = round(id);
 }




Item.prototype.render = function(now, renderer, width, height) {
    this.renderStart(now, width, height);
    this.renderRender(now, renderer);
    this.renderEnd(now);
}

Item.prototype.renderStart = function(now, width, height) {
    clearRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);
    var imbr = this.getProjectedMbr();
    this.projectedlocation.x = imbr.x;
    this.projectedlocation.y = imbr.y;
    var iwidth = imbr.width;
    var iheight = imbr.height;
    if (this.projectedlocation.x < 0) {
        iwidth += this.projectedlocation.x;
        this.projectedlocation.x = 0;
    }
    if (this.projectedlocation.y < 0) {
        iheight += this.projectedlocation.y;
        this.projectedlocation.y = 0;
    }
    if (this.projectedlocation.x + iwidth > width) iwidth = width - this.projectedlocation.x;
    if (this.projectedlocation.y + iheight > height) iheight = height - this.projectedlocation.y;
    
    this.projectedlocation.x -= this.imagepad;
    this.projectedlocation.y -= this.imagepad;
    var doublepad = this.imagepad * 2;
    this.canvas.width = iwidth + doublepad;
    this.canvas.height = iheight + doublepad;
}

Item.prototype.renderRender = function(now, renderer) {
    this.item3D.renderItem3D(now, this.ctx, renderer);
}

Item.prototype.renderEnd = function(when) {
    this.image.x = 0;
    this.image.y = 0;
    this.image.width = this.canvas.width;
    this.image.height = this.canvas.height;
    this.image.data = this.canvas;
}

Item.prototype.drawImage = function(ctx) {
    this.image.draw(ctx, this.projectedlocation.x, this.projectedlocation.y, this.canvas.width, this.canvas.height);
}

Item.prototype.drawImageAtPoint = function(ctx, x, y) {
    this.image.draw(ctx, x, y, this.canvas.width, this.canvas.height);
}

Item.prototype.patchImage = function(ctx, x, y, w, h) {
    this.image.patch(ctx, x, y, w, h);
}


