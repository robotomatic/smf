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


Layer.prototype.update = function(now, delta) { 
    this.items.update(now, delta);
}

Layer.prototype.render = function(now, ctx, window, x, y, width, height, scale, quality, renderer, first) {
    if (this.draw === false) return;
    this.items.render(now, ctx, window, x, y, width, height, scale, quality, renderer, this.cache, this.blur, this.parallax, this.depth, this.top, first);
}

Layer.prototype.debugLayer = function(now, ctx, window, x, y, width, height, scale, quality, renderer, first) {
    if (this.draw === false) return;
    this.items.debugItems(now, ctx, window, x, y, width, height, scale, quality, renderer, this.cache, this.blur, this.parallax, this.depth, this.top, first);
}























Layer.prototype.collidePlayer = function(player) {

    if (!player) return;
    if (this.collide === false) return;
    if (!this.items) return;
    
//    if (!this.playercollisions[player.id]) this.playercollisions[player.id] = new Array();
//    else this.playercollisions[player.id].length = 0;
    
    for (var i = 0; i < this.items.items.length; i++) {
        var item = this.items.items[i];

        if (item.collide === false) continue;
        if (item.draw === false) continue;
        
        // todo: check if renderer overrides draw

        if (item.parts) this.collideItemParts(player, item);
        else this.collideItem(player, item);
    }
}

Layer.prototype.collideItem = function(player, item) {
//    if (!item.collisions) item.collisions = new Array();
    return this.collideItemPart(player, item, item);
}

Layer.prototype.collideItemParts = function(player, item) {
    var out = false;
//    if (!item.collisions) item.collisions = new Array();
    
    for (var i = 0 ; i < item.parts.length; i++) {
        // todo: can collide rough here, but need item mbr
        var col = this.collideItemPart(player, item, item.parts[i]);
        if (col) out = true;
    }
    
    return out;
}
    
Layer.prototype.collideItemPart = function(player, item, part) {

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
    this.box.width = part.width;
    this.box.height = part.height;
    this.box.depth = this.depth;
    this.box.ramp = (part.ramp) ? part.ramp : "";
    this.box.collide = (part.collide) ? part.collide : true;
    this.box.gravity = this.gravity;
    this.box.viscosity = this.viscosity;
    this.box.damage = this.damage;
    this.box.action = item.action;
    
    this.collider.reset();
    this.collider = player.collideWith(this.box, this.collider);
    
//    if (!this.collider.collided()) {
//        item.collisions[player.id] = null;
//        return false;
//    }
//
//    var dir = null;
//    var amt = null;
//    if (this.collider.vertical.direction) {
//        dir = this.collider.vertical.direction;    
//        amt = this.collider.vertical.amount;    
//    } else if (this.collider.horizontal.direction) {
//        dir = this.collider.horizontal.direction;    
//        amt = this.collider.horizontal.amount;    
//    }
//
//    this.playercollisions[player.id][this.playercollisions[player.id].length] = {
//        item : item,
//        part : part,
//        direction : dir,
//        amount : amt
//    };
//
//    var xx = px - player.controller.x;
//    var yy = py - player.controller.y;
//
//    if (item.collisions[player.id]) {
//        item.collisions[player.id].part = part;
//        item.collisions[player.id].player = player;
//        item.collisions[player.id].dx = xx;
//        item.collisions[player.id].dy = yy;
//    } else {
//        item.collisions[player.id] = {
//            part : part,
//            player : player,
//            dx : xx,
//            dy : yy
//        }
//    }
    
    return true;
}