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
    
    this.playercollisions = new Array();
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
    
    this.items.loadJson(json.items);
    
    return this;
}


Layer.prototype.update = function(now, step) { 
    this.items.update(now, step);
}

Layer.prototype.render = function(now, ctx, window, x, y, width, height, scale, quality, renderer, first) {
    if (this.draw === false) return;
    this.items.render(now, ctx, window, x, y, width, height, scale, quality, renderer, this.cache, this.blur, this.parallax, this.depth, this.top, first);
}























Layer.prototype.collidePlayer = function(player) {
    if (this.collide === false) return;
    
    if (this.playercollisions[player.id]) this.playercollisions[player.id].length = 0;
    else this.playercollisions[player.id] = new Array();
    
    var collided = false;
    if (this.items) {
        for (var i = 0; i < this.items.items.length; i++) {
            var col = false;
            var item = this.items.items[i];
            if (item.collide === false) continue;
            if ((!item.height && !item.width) && item.parts) this.collideItemParts(player, item);
            else this.collideItem(player, item);
        }
    }
}

Layer.prototype.collideItem = function(player, item) {
    
    if (!item.collisions) item.collisions = new Array();
    
    this.box.x = item.x
    this.box.y = item.y;
    this.box.width = item.width;
    this.box.height = item.height;
    this.box.ramp = (item.ramp) ? item.ramp : "";
    this.box.collide = (item.collide) ? item.collide : true;
    this.box.gravity = this.gravity;
    this.box.viscosity = this.viscosity;
    this.box.damage = this.damage;
    this.box.action = item.action;
    
    this.collider.reset();
    this.collider = player.collideWith(this.box, this.collider);
    
    if (this.collider.collided()) {

//        // todo: is mystery
//        var c = new Collider();
//        c.reset();
//        c = player.collideWith(this.box, c);
        
        var dir = null;
        var amt = null;
        if (this.collider.vertical.amount) {
            dir = this.collider.vertical.direction;    
            amt = this.collider.vertical.amount;    
        } else if (this.collider.horizontal.amount) {
            dir = this.collider.horizontal.direction;    
            amt = this.collider.horizontal.amount;    
        }
        
        this.playercollisions[player.id][this.playercollisions[player.id].length] = {
            item : item,
            direction : dir,
            amount : amt
        };
        
        if (item.collisions[player.id]) {
            item.collisions[player.id].part = null;
            item.collisions[player.id].player = player;
            item.collisions[player.id].dx = item.x - player.controller.x;
            item.collisions[player.id].dy = item.y - player.controller.y;
        } else {
            item.collisions[player.id] = {
                player: player,
                dx : item.x - player.controller.x,
                dy : item.y - player.controller.y
            }
        }
        
        return true;
    }
    item.collisions[player.id] = null;
    return false;
}

Layer.prototype.collideItemParts = function(player, item) {
    var out = false;
    if (!item.collisions) item.collisions = new Array();
    for (var i = 0 ; i < item.parts.length; i++) {
        // todo: can collide rough here, but need item mbr
        var col = this.collideItemPart(player, item, item.parts[i]);
        if (col) out = true;
    }
    return out;
}
    
Layer.prototype.collideItemPart = function(player, item, part) {

    if (part.collide === false) return false;
    
    var px = item.x + part.x;
    var py = item.y + part.y;

    this.box.x = px
    this.box.y = py;
    this.box.width = part.width;
    this.box.height = part.height;
    this.box.ramp = (part.ramp) ? part.ramp : "";
    this.box.collide = (part.collide) ? part.collide : true;
    this.box.gravity = this.gravity;
    this.box.viscosity = this.viscosity;
    this.box.damage = this.damage;
    this.box.actions = item.actions;
    
    this.collider.reset();
    this.collider = player.collideWith(this.box, this.collider);
    if (this.collider.collided()) {

        var dir = null;
        var amt = null;
        if (this.collider.vertical.amount) {
            dir = this.collider.vertical.direction;    
            amt = this.collider.vertical.amount;    
        } else if (this.collider.horizontal.amount) {
            dir = this.collider.horizontal.direction;    
            amt = this.collider.horizontal.amount;    
        }
        
        this.playercollisions[player.id][this.playercollisions[player.id].length] = {
            item : item,
            part : part,
            direction : dir,
            amount : amt
        };
        if (item.collisions[player.id]) {
            item.collisions[player.id].part = part;
            item.collisions[player.id].player = player;
            item.collisions[player.id].dx = px - player.controller.x;
            item.collisions[player.id].dy = py - player.controller.y;
        } else {
            item.collisions[player.id] = {
                part : part,
                player : player,
                dx : px - player.controller.x,
                dy : py - player.controller.y
            }
        }
        return true;
    }
    
    item.collisions[player.id] = null;
    return false;
}