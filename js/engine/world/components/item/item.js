"use strict";

function Item(json) {
    
    this.id = "";
    this.name = "";
    this.json = json;

    this.trim = 0;
    this.trimdepth = 0;
    this.trimwidth = 0;
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastZ = 0;
    this.location = new Point(0, 0);
    
    this.traversable = false;
    
    this.bounds = false;
    
    this.item3D = new Item3D();
    this.itemrenderer = new ItemRenderer();
    
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
    
    this.dotheme = true;
    
    this.waterline = false;
    this.underwater = false;
    
    this.mbr = new Rectangle();
    
    this.box = new Rectangle(0, 0, 0, 0);
    
    this.top = false;
    this.polygon = new Polygon();
    
    this.np = new Point(0, 0);
    
    this.pnew = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    
    this.geometry = new ItemGeometry();

    this.projectedmbr = new Rectangle(0, 0, 0, 0);

    this.gamecanvas = new GameCanvas();

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
    
    
    this.damage = {
        hp : 0,
        rate : 0,
        effect : ""
    };
    
    this.properties = {
        friction : 0,
        airfriction : 0,
        density : 0,
        suction : 0
    };
    
    this.watersurface = {
        front : {
            keys : new Array(),
            points: new Points()
        },
        left : {
            keys : new Array(),
            points: new Points()
        },
        right : {
            keys : new Array(),
            points: new Points()
        }
    };
    
    if (json) this.loadJson(json);
}

















Item.prototype.loadJson = function(json) {

    this.json = json;
    
    var name = json.name ? json.name : "default";
    this.name = name;
    
    if (json.trim) this.trim = json.trim;
    
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

    if (json.bounds) this.bounds = json.bounds;
    
    this.radius = json.radius;
    this.ramp = json.ramp;
    this.angle = json.angle;
    
    this.collide = json.collide;
    this.draw = (json.draw !== undefined) ? json.draw : true;
    this.animate = json.animate;

    this.shadow = json.shadow;
    
    this.actions = json.actions;
    this.top = json.top;
    this.bottom = json.bottom;
    
    if (json.damage) this.damage = json.damage;
    if (json.properties) this.properties = json.properties;
    if (json.friction) this.friction = json.friction;
    if (json.airfriction) this.airfriction = json.airfriction;
    
    if (json.geometry) {
        if (json.geometry.visible) {
            if (json.geometry.visible.left !== undefined) this.geometry.visible.left.visible = json.geometry.visible.left;
            if (json.geometry.visible.right !== undefined) this.geometry.visible.right.visible = json.geometry.visible.right;
            if (json.geometry.visible.front !== undefined) this.geometry.visible.front.visible = json.geometry.visible.front;
            if (json.geometry.visible.back !== undefined) this.geometry.visible.back.visible = json.geometry.visible.back;
            if (json.geometry.visible.top !== undefined) this.geometry.visible.top.visible = json.geometry.visible.top;
            if (json.geometry.visible.bottom !== undefined) this.geometry.visible.bottom.visible = json.geometry.visible.bottom;
        }
    }
    
    if (json.addparts != undefined) this.addparts = json.addparts;
    this.parts = json.parts;
}






Item.prototype.clone = function() {
    var newitem = new Item();
    newitem.id = this.id;
    newitem.name = this.name;
    newitem.trim = this.trim;
    newitem.trimdepth = this.trimdepth;
    newitem.trimwidth = this.trimwidth;
    newitem.x = this.x;
    newitem.y = this.y;
    newitem.z = this.z;
    newitem.traversable = this.traversable;
    newitem.extrude = this.extrude;
    newitem.width = this.width;
    newitem.height = this.height;
    newitem.scalefactor = this.scalefactor;
    newitem.depth = this.depth;
    newitem.top = this.top;
    newitem.bottom = this.bottom;
    newitem.invert = this.invert;
    newitem.radius = this.radius;
    newitem.ramp = this.ramp;
    newitem.angle = this.angle;
    newitem.actionnum = this.actionnum;
    newitem.originx = this.originx;
    newitem.originy = this.originy;
    newitem.angle = this.angle;
    newitem.collide = this.collide;
    newitem.draw = this.draw;
    newitem.bounds = this.bounds;
    newitem.animate = this.animate;
    newitem.itemtype = this.itemtype;
    newitem.iteminfo = this.iteminfo;
    newitem.actions = this.actions;
    newitem.addparts = this.addparts;
    newitem.top = this.top;
    newitem.waterline = this.waterline;
    newitem.underwater = this.underwater;
    newitem.parts = cloneObject(this.parts);
    if (newitem.parts) newitem.keys = Object.keys(newitem.parts);
    newitem.dotheme = this.dotheme;
    newitem.damage = cloneObject(this.damage);
    newitem.properties = cloneObject(this.properties);
    newitem.geometry = this.geometry.copy(newitem.geometry);
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
    this.geometry.front.geometry.points.length = 0;
    this.geometry.initialize(this);
    this.traversable = this.geometry.visible.top.visible;
    this.watersurface = {
        front : {
            keys : new Array(),
            points: new Points()
        },
        left : {
            keys : new Array(),
            points: new Points()
        },
        right : {
            keys : new Array(),
            points: new Points()
        }
    };
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
    this.projectedmbr = this.getProjectedGeometryMbr(this.geometry.top, this.projectedmbr);
    this.projectedmbr = this.getProjectedGeometryMbr(this.geometry.bottom, this.projectedmbr);
    this.projectedmbr = this.getProjectedGeometryMbr(this.geometry.left, this.projectedmbr);
    this.projectedmbr = this.getProjectedGeometryMbr(this.geometry.right, this.projectedmbr);
    return this.projectedmbr;
}

Item.prototype.getProjectedGeometryMbr = function(geometry, mbr) {
    if (!geometry.showing) return mbr;
    var gmbr = geometry.geometry.getMbr();
    if (gmbr.x < mbr.x) {
        var d = mbr.x - gmbr.x;
        mbr.x = gmbr.x;
        mbr.width += d;
    }
    if ((gmbr.x + gmbr.width) >= mbr.x + mbr.width) {
        mbr.width = gmbr.x + gmbr.width - mbr.x;
    }
    if (gmbr.y < mbr.y) {
        var d = mbr.y - gmbr.y;
        mbr.y = gmbr.y;
        mbr.height += d;
    }
    if ((gmbr.y + gmbr.height) >= mbr.y + mbr.height) {
        mbr.height = gmbr.y + gmbr.height - mbr.y;
    }
    if (gmbr.z != 0 && gmbr.z < mbr.z) {
        var d = mbr.z - gmbr.z;
        mbr.z = gmbr.z;
        mbr.depth += d;
    }
    if (gmbr.z != 0 && (gmbr.z + gmbr.depth) >= mbr.z + mbr.depth) {
        mbr.depth = gmbr.z + gmbr.depth - mbr.z;
    }
    return mbr;
}


Item.prototype.isHidden = function() {
    if (!this.geometry.visible.top.visible &&
        !this.geometry.visible.bottom.visible &&
        !this.geometry.visible.left.visible &&
        !this.geometry.visible.right.visible &&
        !this.geometry.visible.front.visible &&
        !this.geometry.visible.back.visible) {
        return true;
    }
    return false;
}


Item.prototype.isVisible = function(w, pad = 0) {

    var mbr = this.getProjectedMbr();
    
   var wz = w.z;
   var wd = w.depth;
   if (this.depth != "100%") {
       if (mbr.z + mbr.depth < wz - pad) {
           return false;
       }
   }
   
   var wy = w.y;
   var wh = w.height;
   if (this.height != "100%") {
//        if (mbr.y > (wy + wh + pad)) {
//            return false;
//        }
       if ((mbr.y + mbr.height) < wy - pad) {
           return false;
       }
   }
    
    var wx = w.x;
    var ww = w.width;
    if (this.width != "100%") {
        if (mbr.x > (wx + ww + pad)) {
            return false;
        }
        if ((mbr.x + mbr.width) < wx - pad) {
            return false;
        }
    }
    
    return true;
}




Item.prototype.touches = function(otheritem) {
    if (otheritem.x == this.x + this.width) return true;
    if (otheritem.x + otheritem.width == this.x) return true;
    if (otheritem.y == this.y + this.height) return true;
    if (otheritem.y + otheritem.height == this.y) return true;
    if (otheritem.z == this.z + this.depth) return true;
    if (otheritem.z + otheritem.depth == this.z) return true;
    return false;
}



Item.prototype.overlaps = function(otheritem) {
    if (otheritem.x >= this.x + this.width) return false;
    if (otheritem.x + otheritem.width <= this.x) return false;
    if (otheritem.y >= this.y + this.height) return false;
    if (otheritem.y + otheritem.height <= this.y) return false;
    if (otheritem.z >= this.z + this.depth) return false;
    if (otheritem.z + otheritem.depth <= this.z) return false;
    return true;
}



Item.prototype.getPolygon = function() {
    this.polygon.createPolygon(this.getMbr());
    return this.polygon;
}






Item.prototype.update = function(now, delta, paused) { 
//    this.move(now, delta);
    this.smooth();
}



Item.prototype.move = function(now, delta) { 
//    if (!this.actions) return;
//    if (this.draw == false) return;
//    if (!this.animator) this.animator = new ItemAnimator();
//    this.animator.animate(now, this, delta);
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
    
    var itemheight = this.height;
    
    var iw = this.width * scale;
    var ih = itemheight * scale;
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





Item.prototype.render = function(now, world, renderer, width, height, gamecanvas, scale, debug, paused) {

    this.debugtemp.level = false;
    this.debugtemp.render = false;
    this.debugtemp.hsr = false;
    if (debug) {
        this.debugtemp.level = this.debug.level ? true : debug.level;
        this.debugtemp.render = this.debug.render ? true : debug.render;
        this.debugtemp.hsr = this.debug.hsr ? true : debug.hsr;
    }

    if (!gamecanvas) {
        this.renderStart(now, width, height, scale);
        this.renderRender(now, world, renderer, this.gamecanvas, scale, this.debugtemp, paused);
        this.renderEnd(now);
    } else {
        this.renderRender(now, world, renderer, gamecanvas, scale, this.debugtemp, paused);
    }
}

Item.prototype.renderStart = function(now, width, height, scale) {

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
    
    this.gamecanvas.setSize(width = iwidth + doublepad, iheight + doublepad);
}

Item.prototype.renderRender = function(now, world, renderer, gamecanvas, scale, debug, paused) {
    this.itemrenderer.renderItem(now, world, renderer, this, gamecanvas, scale, debug, paused);
}

Item.prototype.renderEnd = function(when) {
    this.image.x = 0;
    this.image.y = 0;
    this.image.width = this.gamecanvas.width;
    this.image.height = this.gamecanvas.height;
    this.image.data = this.gamecanvas;
}

Item.prototype.drawImage = function(gamecanvas, scale = 1, offset = 0) {
    
    var px = this.projectedlocation.x * scale;
    var py = this.projectedlocation.y * scale;
    var cw = this.gamecanvas.width * scale;
    var ch = this.gamecanvas.height * scale;
    
    this.image.draw(gamecanvas, px + offset, py + offset, cw - (offset * 2), ch);

    this.projectedlocation.x = this.projectedlocation_backup.x;
    this.projectedlocation.y = this.projectedlocation_backup.y;
}