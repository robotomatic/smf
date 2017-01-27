"use strict";

function Item() {
    
    this.id = "";

    this.name = "";
    
    this.x = 0;
    this.y = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.location = new Point(0, 0);

    
    this.last_ax = 0;
    this.last_now = 0;
    
    this.width = 0;
    this.height = 0;
    this.depth = 0;

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
}

Item.prototype.loadJson = function(json) {

    var name = json.name ? json.name : "default";
    this.name = name;
    
    var itemtype = json.itemtype ? json.itemtype : "default";
    this.itemtype = itemtype;
    
    this.x = json.x;
    this.y = json.y;
    this.width = json.width;
    this.height = json.height;
    this.depth = json.depth;
    
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
    
    if (!this.width || !this.height) {
        this.getMbr();
        if (this.mbr) {
            this.width = this.mbr.width;
            this.height = this.mbr.height;
        }
    }
    
    this.id = this.name + "_" + this.itemtype + "_" + this.x + "_" + this.y + "_" + this.width + "_" + this.height;
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

Item.prototype.isVisible = function(window) {
    if (this.draw == false) return false;
    if (this.width == "100%" || this.height == "100%") return true;
    // todo: this needs to be quadtree!!!!
    return collideRough(window, this.getMbr());
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

    var pad = this.pad;
    
    var pg = new Polygon();
    var p;
    var np;
    p = top.points[0];
    
    this.np.x = p.x - pad;
    this.np.y = p.y - pad;
    pg.addPoint(this.np);
    
    var simple = false;
    if (top.points.length == 2) {
        simple = true;
        top.points[2] = top.points[1];
        var d = top.points[1].x - top.points[0].x;
        var rd = random(0, d);
        rd = 0;
        top.points[1] = new Point(top.points[0].x + rd, top.points[0].y);
    }
    
    for (var i = 0; i < top.points.length; i++) {
        p = top.points[i];
        
        this.np.x = p.x;
        this.np.y = p.y - pad;
        pg.addPoint(this.np);
    }
    p = top.points[top.points.length - 1];

    this.np.x = p.x + pad;
    this.np.y = p.y - pad;
    pg.addPoint(this.np);
    
    p = top.points[top.points.length - 1];

    this.np.x = p.x + pad;
    this.np.y = p.y;
    pg.addPoint(this.np);
    
    var bpad = pad;
//    if (simple) bpad = pad = random(0, pad);
    for (var i = top.points.length; i > 1; i--) {
        p = top.points[i - 1];
        
        this.np.x = p.x;
        this.np.y = p.y + bpad;
        pg.addPoint(this.np);
    }
    p = top.points[0];

    this.np.x = p.x - pad;
    this.np.y = p.y;
    pg.addPoint(this.np);
    return pg;
}







Item.prototype.update = function(now, delta) { 
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




Item.prototype.translate = function(window, x, y, width, height, scale, parallax) {
    
    var ip = this.getLocation();
    
    var ipx = ip.x;
    var ipy = ip.y;
    
    var dx = ipx - x;
    var dy = ipy - y;

    
    var ix = dx * scale;
    var iy = dy * scale;
    
    if (parallax) {
        
        var rcx = window.x + (window.width / 2);
        var rcy = window.y + (window.height / 2);
        
        var lcx = width / 2;
        var dcx = (lcx - rcx) * scale;
        ix += dcx * parallax;
        
        var lcy = height / 2;
        var dcy = (lcy - rcy) * scale;
        iy += dcy * parallax;
    }

    var iw = this.width * scale;
    if (this.width === "100%") {
        ix = -100;
        iw = width + 200;
    }
    var ih = this.height * scale;
    if (this.height === "100%") {
        iy = 0;
        ih = height;
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

Item.prototype.render = function(now, ctx, window, x, y, scale, renderer, drawdetails) {
    
    
    if (this.action) this.debugAction(now, ctx, window, x, y, scale);
    
    if (renderer) renderer.drawItem(ctx, this.color, this, window, x, y, this.box, scale, drawdetails);
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