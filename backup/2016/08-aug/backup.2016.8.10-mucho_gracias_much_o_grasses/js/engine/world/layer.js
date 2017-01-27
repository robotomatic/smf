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

Layer.prototype.buildItems = function(renderer) { 
    if (!this.items.items.length) return;
    var newitems = new Array();
    var t = this.items.items.length;
    for (var i = 0; i < t; i++) {
        this.buildItem(renderer, this.items.items[i], i, newitems);
    }
    for (var ii = 0; ii < newitems.length; ii++) {
        this.items.addItem(this.items.items.length, newitems[ii]);
    }
    this.items.items.sort(sortByZIndex);
}


Layer.prototype.buildItem = function(renderer, item, index, newitems) { 
    item.depth = this.depth;
    var theme = renderer.getItemTheme(item);
    if (!theme) return;
    var z = (item.zindex) ? item.zindex : 0;
    item.zindex = ((theme.zindex !== undefined) ? theme.zindex : this.zindex) + index + z;
    if (theme.depth !== undefined) item.depth = theme.depth;
    if (theme.draw !== undefined) item.draw = theme.draw;
    if (theme.before) this.buildItemItems(renderer, theme, item, item.zindex - 1, "before", theme.before, newitems);
    if (theme.after) this.buildItemItems(renderer, theme, item, item.zindex + 1, "after", theme.after, newitems);
    if (theme.top && theme.top.before) this.buildItemTopItems(renderer, theme, item, item.zindex - 1, item.depth, "before", theme.top.before, newitems);
    if (theme.top && theme.top.after) this.buildItemTopItems(renderer, theme, item, item.zindex + 1, 0, "after", theme.top.after, newitems);
}

Layer.prototype.buildItemItems = function(renderer, theme, item, zindex, name, items, newitems) { 
    for (var i = 0; i < items.length; i++) this.buildItemItemsItem(renderer, theme, item, zindex, name + "_" + i, items[i], newitems);
}

Layer.prototype.buildItemItemsItem = function(renderer, theme, item, zindex, name, itemitem, newitems) { 
    
    var newitem = new Item();
    newitem.name = item.id + "_" + name + "_" + zindex;

    newitem.x = item.x + itemitem.x;
    newitem.y = item.y + itemitem.y;
    newitem.z = item.z;
    if (itemitem.z !== undefined) newitem.z += itemitem.z;
    
    if (itemitem.align !== undefined) {
        var align = itemitem.align;
        if (align.x !== undefined) {
            var ax = 0;
            if (align.x == "left") ax = 0;
            else if (align.x == "center") ax = item.width / 2; 
            else if (align.x == "right") ax = item.width; 
            newitem.x += ax;
        }
        if (align.y !== undefined) {
            var ay = 0;
            if (align.y == "top") ay = 0;
            else if (align.y == "center") ay = item.height / 2; 
            else if (align.y == "bottom") ay = item.height; 
            newitem.y += ay;
        }
    }
    
    newitem.x = round(newitem.x);
    newitem.y = round(newitem.y);
    newitem.width = round(itemitem.width);
    newitem.height = round(itemitem.height);
    newitem.angle = 0;
    newitem.cache = false;
    
    if (itemitem.itemtype !== undefined) newitem.itemtype = itemitem.itemtype;
    if (itemitem.iteminfo !== undefined) newitem.iteminfo = itemitem.iteminfo;

    newitem.depth = (itemitem.depth !== undefined) ? itemitem.depth : 0;
    newitem.collide = (itemitem.collide !== undefined) ? itemitem.collide : false;
    newitem.zindex = zindex;

    newitem.initialize();
    newitems.push(newitem);
}

Layer.prototype.buildItemTopItems = function(renderer, theme, item, zindex, depth, name, items, newitems) { 
    var sp = new Point(0, 0);
    for (var i = 0; i < items.length; i++) {
        var poly = item.getPolygon();
        if (poly) {
            var tops = item.polytops;
            for (var ii = 0; ii < tops.length; ii++) {
                var top = tops[ii];
                var pt = clamp(top.points.length / 2);
                sp.x = 0;
                sp.y = 0;
                if (items[i].align !== undefined) {
                    var align = items[i].align;
                    if (align.x !== undefined) {
                        if (align.x == "left") {
                            sp.x = top.points[0].x;
                            sp.y = top.points[0].y;
                        } else if (align.x == "center") {
                            sp.x = (top.points[pt].x - top.points[0].x) / 2;
                            sp.y = (top.points[pt].y - top.points[0].y) / 2;
                        } else if (align.x == "right") {
                            sp.x = top.points[pt].x;
                            sp.y = top.points[pt].y;
                        }
                    }
                }
                var newitem = {
                    id : item.id + "_" + i + "_" + depth,
                    x : item.x + sp.x,
                    y : item.y + sp.y,
                    z : depth
                }
                this.buildItemTopItemsItem(renderer, theme, newitem, zindex, name + "_" + i, items[i], newitems);
            }
        } else {
            this.buildItemItemsItem(renderer, theme, item, zindex, name + "_" + i, items[i], newitems);
        }
    }
}

Layer.prototype.buildItemTopItemsItem = function(renderer, theme, item, zindex, name, itemitem, newitems) { 
    
    var newitem = new Item();
    newitem.name = item.id + "_" + name + "_" + zindex + "_" + itemitem.itemtype;

    newitem.x = item.x + itemitem.x;
    newitem.y = item.y + itemitem.y;
    newitem.z = item.z;
    if (itemitem.z !== undefined) newitem.z += itemitem.z;
    
    newitem.x = round(newitem.x);
    newitem.y = round(newitem.y);
    newitem.width = round(itemitem.width);
    newitem.height = round(itemitem.height);
    newitem.angle = 0;
    newitem.cache = false;
    
    if (itemitem.itemtype !== undefined) newitem.itemtype = itemitem.itemtype;
    if (itemitem.iteminfo !== undefined) newitem.iteminfo = itemitem.iteminfo;

    newitem.depth = (itemitem.depth !== undefined) ? itemitem.depth : 0;
    newitem.collide = (itemitem.collide !== undefined) ? itemitem.collide : false;
    if (itemitem.zindex !== undefined) zindex += itemitem.zindex;
    newitem.zindex = zindex;

    newitem.initialize();
    newitems.push(newitem);
}




    

Layer.prototype.update = function(now, delta, renderer) { 
    this.items.update(now, delta, renderer, this.depth);
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
    this.box.z = item.z;
    this.box.width = part.width;
    this.box.height = part.height;
    
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