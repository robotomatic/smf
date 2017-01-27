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
    this.blur = false;
    this.opacity = 1;
    this.blend = "";
    this.scale = 1;
    this.cache = false;
    this.animate = false;
    this.lighten = false;
    this.parallax = 0;
    this.offsetx = 0;
    this.outline = false;
    this.outlinewidth = null;
    this.width = "";
    this.items;
    this.lastX;
    this.lastY;
    this.lastW;
    this.lastH;

    this.items = new Array();
    
    this.playercollisions = new Array();

    this.itemcache = new ItemCache();
    
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
        damage : null
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
    this.outline = json.outline;
    this.outlinewidth = json.outlinewidth;
    this.width = json.width;
    
    this.loadItemsJson(json.items);
    
    return this;
}

Layer.prototype.loadItemsJson = function(items) {
    for (var item in items) {
        var it = new Item();
        it.loadJson(items[item]);
        this.items[item] = it;
    }
}

Layer.prototype.update = function(now, step) { 
//    if (this.items) {
//        for (var i = 0; i < this.items.length; i++) {
//            this.updateItem(step, this.items[i]);
//        }
//    }
}

Layer.prototype.updateItem = function(step, item) { 
//    if (!item.actions) return;
//    if (item.parts) {
//        for (var part in item.parts) this.updateItem(step, item.parts[part]);
//    }
}


Layer.prototype.getItems = function() { return this.items; }

Layer.prototype.drawItem = function(ctx, item, x, y, width, height, renderer, scale, cache) {

//    if (this.opacity != 1) ctx.globalAlpha = this.opacity;
//    if (this.blend) ctx.globalCompositeOperation = this.blend;
    
    // todo: this should be like item.draw(ctx, x, y, scale);
    
    if (!cache || !this.itemcache.cacheItem(ctx, item, x, y, width, height, renderer, scale, this.drawdetails)) {
        if (renderer) renderer.drawItem(ctx, item.color, item, x, y, width, height, scale, this.drawdetails);
        else {
            ctx.fillStyle = item.color ? item.color : "red"; 
            drawRect(ctx, x, y, width, height); 
        }
    }
    
//    if (this.opacity != 1) ctx.globalAlpha = 1;
//    if (this.blend) ctx.globalCompositeOperation = "source-over";
}

Layer.prototype.collidePlayer = function(player) {
    if (this.collide === false) return;
    
    if (this.playercollisions[player.id]) this.playercollisions[player.id].length = 0;
    else this.playercollisions[player.id] = new Array();
    
    var collided = false;
    if (this.items) {
        for (var i = 0; i < this.items.length; i++) {
            var col = false;
            var item = this.items[i];
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
            direction : dir,
            amount : amt
        };
        
        if (item.collisions[player.id]) {
            item.collisions[player.id].part = null;
            item.collisions[player.id].player = player;
            item.collisions[player.id].dx = item.x - player.x;
            item.collisions[player.id].dy = item.y - player.y;
        } else {
            item.collisions[player.id] = {
                player: player,
                dx : item.x - player.x,
                dy : item.y - player.y
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
            item.collisions[player.id].dx = px - player.x;
            item.collisions[player.id].dy = py - player.y;
        } else {
            item.collisions[player.id] = {
                part : part,
                player : player,
                dx : px - player.x,
                dy : py - player.y
            }
        }
        return true;
    }
    
    item.collisions[player.id] = null;
    return false;
}