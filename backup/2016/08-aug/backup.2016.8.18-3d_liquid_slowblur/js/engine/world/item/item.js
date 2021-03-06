"use strict";

function Item() {
    
    this.id = "";

    this.name = "";
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.location = new Point(0, 0);

    this.last_ax = 0;
    this.last_now = 0;
    
    this.width = 0;
    this.height = 0;

    this.scalefactor = 1;
    
    this.depth = 0;
    this.zindex = 0;
    this.parallax = 0;
    this.blur = "";
    this.cache = false;
    
    this.top = false;

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
    this.polygon = null;
    this.tops = new Array();
    
    this.pad = 5;
    this.polylines = new Polylines();
    this.polytops = new Array();
    this.np = new Point(0, 0);
    
    this.pnew = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
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
    this.zindex = json.zindex;
    this.parallax = json.parallax;
    
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
    this.parts = json.parts;
    if (this.parts) {
        this.keys = Object.keys(this.parts);
        this.getPolygon();
    }
    this.initialize();
}

Item.prototype.initialize = function() {
    if (!this.width || !this.height) {
        this.getMbr();
        if (this.mbr) {
            this.width = this.mbr.width;
            this.height = this.mbr.height;
        }
    }
    this.id = this.name + "_" + this.itemtype + "_" + this.x + "_" + this.y;
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
    return this.mbr;
}

Item.prototype.isVisible = function(window, pad) {
    if (this.draw == false) return false;
    if (this.width == "100%" || this.height == "100%") return true;
    // todo: this needs to be quadtree!!!!
    return collideRough(window, this.getMbr(), pad);
}





Item.prototype.getPolygon = function() {
    if (this.polygon) return this.polygon;
    this.polygon = new Polygon();
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
    var pad = 10;
    
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







Item.prototype.updateItem = function(depth, renderer) { 
    if (renderer) {
        var titem = renderer.getItemTheme(this);
        if (titem) {
            if (titem.depth !== undefined) {
                this.depth = titem.depth;
                return;
            }
        }
    }
    this.depth = depth;
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

    
//    this.lastX = this.x;
//    this.lastY = this.y;
//    
//    return;
    
    
    if (!this.action) return;
    
    if (!this.lastX) this.lastX = this.x;
    var dx = (this.x - this.lastX) / 2;
    if (dx) this.lastX = round(this.lastX + dx);
    else this.lastX = this.x;

    if (!this.lastY) this.lastY = this.y;
    var dy = (this.y - this.lastY) / 2;
    if (dy) this.lastY = round(this.lastY + dy);
    else this.lastY = this.y;
}

Item.prototype.getLocation = function() {
    if (this.action) {
        this.location.x = this.lastX;
        this.location.y = this.lastY;
    } else {
        this.location.x = this.x;
        this.location.y = this.y;
    }
    return this.location;   
}




Item.prototype.translate = function(window, x, y, width, height, scale) {
    
    var ip = this.getLocation();
    
    var ipx = ip.x;
    var ipy = ip.y;
    
    var dx = ipx - x;
    var dy = ipy - y;

    
    var ix = dx * scale;
    var iy = dy * scale;
    
    var iw = this.width * scale;
    var ih = this.height * scale;

    if (this.width === "100%") {
        ix = -200;
        iw = width + 400;
    }
    if (this.height === "100%") {
        iy = -200;
        ih = height + 200;
    }
    
    if (this.z) {
        
        var z = this.z;
        //if (this.blur) z *= 2; 
        
        var bw = iw;
        var zscale = z * scale;
        var wc = window.getCenter();
        this.pnew.x = ix;
        this.pnew.y = iy + ih;
        this.np1 = projectPoint3D(this.pnew, zscale, scale, x, y, wc, this.np1);
        this.pnew.x = ix + iw;
        this.pnew.y = iy + ih;
        this.np2 = projectPoint3D(this.pnew, zscale, scale, x, y, wc, this.np2);
        var nw = this.np2.x - this.np1.x;
        var dw = nw / iw;
        iw = nw;
        ih *= dw;
        ix = this.np1.x;
        iy = this.np1.y - ih;
        this.scalefactor = iw / bw;
    }

    if (this.width === "100%") {
        ix = -200;
        iw = width + 400;
    }
    if (this.height === "100%") {
        iy = -200;
        ih = height + 200;
    }
    
    ix = round(ix);
    iy = round(iy);
    iw = round(iw);
    ih = round(ih);
    
    this.box.x = ix;
    this.box.y = iy;
    this.box.width = iw;
    this.box.height = ih;
}

Item.prototype.render = function(now, ctx, window, x, y, scale, renderer) {
    if (this.action) this.debugAction(now, ctx, window, x, y, scale);
    if (renderer) renderer.drawItem(ctx, this.color, this, window, x, y, scale);
    else {
        ctx.fillStyle = item.color ? item.color : "red"; 
        this.box.draw(ctx);
    }
}

Item.prototype.debugAction = function(now, ctx, window, x, y, scale) {
    
    return;
    
    var a = this.action;

    var t = round(now - this.last_now);
    
    var d = round(x - this.last_ax);

    var dir = "---";
    if (a.x > 0) dir = "-->";
    else if (a.x < 0) dir = "<--";

    var d = Math.abs(this.box.x - this.last_ax);
    
    if (dir != this.dir) console.log(dir + " -- turn");
    else if (a.x > 0 && this.box.x < this.last_ax)  console.log(dir + " --> here  " + this.box.x + "  -- " + this.last_ax);
    else if (a.x < 0 && this.box.x > this.last_ax)  console.log(dir + " <-- here");
    else console.log(d + "  ==  " + this.box.x);
    
    this.last_ax = this.box.x;
    

//    console.log(dir + " X " + this.x + " == " + d + " == " + t);
    
    
    this.last_now = now;   
    this.dir = dir;
}