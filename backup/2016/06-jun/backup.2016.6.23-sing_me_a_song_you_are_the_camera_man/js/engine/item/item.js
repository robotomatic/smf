"use strict";

function Item() {
    
    this.id = "";

    this.name = "";
    
    this.x = 0;
    this.y = 0;
    this.lastX = 0;
    this.lastY = 0;
    
    this.width = 0;
    this.height = 0;
    this.depth = 0;

    this.radius = "";
    this.ramp = "";
    this.angle = "";

    this.actionnum = 0;
    this.originx = 0;
    this.originy = 0;
    this.velx = 0;
    this.vely = 0;
    this.angle = 0;
    
    this.action = null;
    
    this.collide = "";
    this.draw = true;
    this.animate = false;
    
    this.itemtype = "";

    this.shadow = false;

    this.animator = new ItemAnimator(this);
    this.collisions = new Array(); 
    
    this.actions = null;
    this.parts = null;
    this.keys = null;
    
    this.mbr = new Rectangle();
    
    this.top = false;
    this.polygon = null;
    this.tops = null;
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
    
    this.id = this.name + "_" + this.itemtype + "_" + this.x + "_" + this.y + "_" + this.width + "_" + this.height;
}


Item.prototype.getMbr = function() {
    this.mbr.x = this.x;
    this.mbr.y = this.y;
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

Item.prototype.getPolygon = function() {
    this.polygon = new Polygon();
    this.polygon.createPolygon(this.parts);
    this.tops = this.polygon.tops;
}

Item.prototype.update = function(now, delta) { 
    if (!this.actions) return;
    if (this.draw == false) return;
    this.animator.animate(now, delta);
}
