"use strict";

function Layer() {
    this.name;

    this.collide = false;
    
    this.physics = false;
    this.gravity = null;
    this.viscosity = null;
    this.damage = null;
    
    this.draw = true;
    this.drawdetails = true;

    this.preview = false;

    this.zindex = 0;
    
    this.blur = 0;
    this.opacity = 1;
    this.blend = "";

    this.scale = 1;

    this.cache = false;

    this.animate = false;
    this.lighten = false;

    this.parallax = 0;
    this.offsetx = 0;
    
    this.depth = 0;
    this.top = false;

    this.outline = false;
    this.outlinewidth = null;

    this.lastX;
    this.lastY;
    this.lastW;
    this.lastH;

    this.items = new Items();
    this.layerCache = new Array();
    this.image = new Image(null, 0, 0, 0, 0);
    
//    this.playercollisions = new Array();
    this.collider = new Collider();

    this.box = {
        x : null,
        y : null,
        width : null,
        height : null,
        ramp : null,
        collide : null,
        gravity : null,
        viscosity : null,
        damage : null,
        action : null
    };        

    this.flood = null;
}

Layer.prototype.loadJson = function(json) {
    this.name = json.name;
    this.collide = json.collide;
    this.physics = json.physics;
    this.gravity = json.gravity;
    this.viscosity = json.viscosity;
    this.damage = json.damage;
    this.draw = json.draw;
    this.drawdetails = (json.drawdetails === false) ? false : true;;
    this.zindex = json.zindex;
    this.preview = json.preview;
    this.blur = json.blur;
    this.opacity = json.opacity;
    this.blend = json.blend;
    this.scale = (json.scale) ? json.scale : 1;
    this.cache = (json.cache === true) ? true : false;
    this.animate = json.animate;
    this.lighten = json.lighten;
    this.parallax = json.parallax;
    this.offsetx = json.offsetx;
    this.depth = json.depth;
    this.top = json.top;
    this.outline = json.outline;
    this.outlinewidth = json.outlinewidth;
    
    this.items.loadJson(json.items, this.collide);

    return this;
}

Layer.prototype.buildItems = function(renderer) { 
    var layerbuilder = new LayerBuilder();
    layerbuilder.buildItems(this.items, renderer, this);
    this.flood = layerbuilder.flood;
}

Layer.prototype.update = function(now, delta, renderer) { 
    this.items.update(now, delta, renderer, this.depth);
}























Layer.prototype.collidePlayer = function(player, width, height) {

    if (!player) return;
    if (this.collide === false) return;
    if (!this.items) return;
    
    for (var i = 0; i < this.items.items.length; i++) {
        var item = this.items.items[i];

        if (item.collide === false) continue;
        if (item.draw === false) continue;
        
        // todo: check if renderer overrides draw

        if (item.parts) this.collideItemParts(player, item, width, height);
        else this.collideItem(player, item, width, height);
    }
}

Layer.prototype.collideItem = function(player, item, width, height) {
//    if (!item.collisions) item.collisions = new Array();
    return this.collideItemPart(player, item, item, width, height);
}

Layer.prototype.collideItemParts = function(player, item, width, height) {
    var out = false;
    
    for (var i = 0 ; i < item.parts.length; i++) {
        // todo: can collide rough here, but need item mbr
        var col = this.collideItemPart(player, item, item.parts[i], width, height);
        if (col) out = true;
    }
    
    return out;
}
    
Layer.prototype.collideItemPart = function(player, item, part, width, height) {

    if (part.collide === false) return false;

    var ip = item.getLocation();
    var ix = ip.x;
    var iy = ip.y;
    
    var px = ix;
    var py = iy;
    if (part.x != ix && part.y != iy) {
        px += part.x;
        py += part.y;
    }

    this.box.x = px
    this.box.y = py;
    this.box.z = item.z;
    this.box.width = part.width == "100%" ? width : part.width;
    this.box.height = part.height == "100%" ? height : part.height;
    
    this.box.depth = item.depth;
    
    this.box.id = item.id;
    this.box.ramp = (part.ramp) ? part.ramp : "";
    this.box.collide = (part.collide) ? part.collide : true;
    this.box.gravity = this.gravity;
    this.box.viscosity = this.viscosity;
    this.box.damage = this.damage;
    this.box.action = item.action;
    
    this.collider.reset();
    this.collider = player.collideWith(this.box, this.collider);
    
    return true;
}