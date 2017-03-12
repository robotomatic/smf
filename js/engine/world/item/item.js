"use strict";

function Item(json) {
    
    this.id = "";

    this.name = "";
    
    this.json = json;
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;
    this.location = new Point(0, 0);
    
    
    this.item3D = new Item3D(this);
    this.projectedlocation = new Point(0, 0);
    this.projectedlocation_backup = new Point(0, 0);
    
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
    
    
    this.addparts = true;
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
    
    this.geometry = new ItemGeometry();

    this.projectedmbr = new Rectangle(0, 0, 0, 0);

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d")
    this.image = new Image(null, 0, 0, 0, 0);
    this.imagepad = 50;
    
    this.showing = false;
    
    this.debug = {
        level : false,
        render : false,
        hsr : false
    }
    this.debugtemp = {
        level : false,
        render : false,
        hsr : false
    }
    
    if (json) this.loadJson(json);
}

Item.prototype.loadJson = function(json) {

    this.json = json;
    
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
    
    if (json.addparts != undefined) this.addparts = json.addparts;
    this.parts = json.parts;
}

Item.prototype.clone = function() {
    // todo: need a better way to clone Items --> manual is bestest?
    var newitem = new Item(cloneObject(this.json));
    if (!newitem) return null;
    newitem.x = this.x;
    newitem.y = this.y;
    newitem.z = this.z;
    newitem.width = this.width;
    newitem.height = this.height;
    newitem.depth = this.depth;
    return newitem;
}
    
Item.prototype.initialize = function() {
    this.polygon.points.length = 0;
    if (this.parts) {
        this.keys = Object.keys(this.parts);
        this.getPolygon();
    }
    this.getMbr();
    if (this.mbr) {
        this.width = this.mbr.width;
        this.height = this.mbr.height;
    }
    this.geometry.initialize(this);
    this.id = this.name + "_" + this.itemtype + "_" + this.x + "_" + this.y + "_" + this.z + "_" + this.width + "_" + this.height + "_" +  this.depth;
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
    this.projectedmbr.z = this.box.z;
    this.projectedmbr.width = this.box.width;
    this.projectedmbr.height = this.box.height;
    this.projectedmbr.depth = this.box.depth;
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
        if (mbr.z + mbr.depth < w.z - 100 - pad) return false;
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
        id -= abs(iz) - abs(nz);
        iz = -nz;
    }
    var dwd = id / iw;
    
    this.pnew.x = ix;
    this.pnew.y = iy + ih;
    this.np1 = projectPoint3D(this.pnew, iz, scale, x, y, wc, this.np1);

    this.pnew.x = ix + iw;
    this.pnew.y = iy + ih;
    this.np2 = projectPoint3D(this.pnew, iz, scale, x, y, wc, this.np2);

    var nw = abs(this.np2.x - this.np1.x);
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
    this.scale = this.box.width / this.width;
 }





Item.prototype.render = function(now, renderer, width, height, ctx, scale = 1, debug) {

    this.debugtemp.level = false;
    this.debugtemp.render = false;
    this.debugtemp.hsr = false;
    if (debug) {
        this.debugtemp.level = this.debug.level ? true : debug.level;
        this.debugtemp.render = this.debug.render ? true : debug.render;
        this.debugtemp.hsr = this.debug.hsr ? true : debug.hsr;
    }
    
    if (!ctx) {
        this.renderStart(now, width, height, scale);
        this.renderRender(now, renderer, this.ctx, scale, this.debugtemp);
        this.renderEnd(now);
    } else {
        this.renderRender(now, renderer, ctx, 1, this.debugtemp);
    }
}

Item.prototype.renderStart = function(now, width, height, scale = 1) {

    this.projectedlocation_backup.x = this.projectedlocation.x;
    this.projectedlocation_backup.y = this.projectedlocation.y;
    
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

    var sip = this.imagepad;
    var doublepad = sip * 2;
    
    iwidth *= scale;
    iheight *= scale;
    this.projectedlocation.x *= scale;
    this.projectedlocation.y *= scale;
    
    this.projectedlocation.x -= sip;
    this.projectedlocation.y -= sip;
    
    this.canvas.width = iwidth + doublepad;
    this.canvas.height = iheight + doublepad;
}

Item.prototype.renderRender = function(now, renderer, ctx, scale = 1, debug) {
    this.item3D.renderItem3D(now, renderer, ctx, scale, debug);
}

Item.prototype.renderEnd = function(when) {
    this.image.x = 0;
    this.image.y = 0;
    this.image.width = this.canvas.width;
    this.image.height = this.canvas.height;
    this.image.data = this.canvas;
}

Item.prototype.drawImage = function(ctx, scale = 1, offset = 0) {
    
    var px = this.projectedlocation.x * scale;
    var py = this.projectedlocation.y * scale;
    var cw = this.canvas.width * scale;
    var ch = this.canvas.height * scale;
    
    this.image.draw(ctx, px + offset, py + offset, cw - (offset * 2), ch);

    this.projectedlocation.x = this.projectedlocation_backup.x;
    this.projectedlocation.y = this.projectedlocation_backup.y;
}