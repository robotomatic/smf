"use strict";

function WorldBuilderIntersect() {
}

WorldBuilderIntersect.prototype.reset = function() { 
}

WorldBuilderIntersect.prototype.intersectItems = function(world) { 
    var items = world.items;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        if (item.isHidden()) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        if (item.waterline) continue;
        if (item.isbounds) continue;
        var newitems = this.intersectItemItems(item, items);
        if (newitems) {
            items = items.concat(newitems);
        }
    }
    world.items = items;
}

WorldBuilderIntersect.prototype.intersectItemItems = function(item, items) { 
    var newitems = new Array();
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc.isHidden()) continue;
        if (itemc == item) continue;
        if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") continue;
        if (itemc.waterline) continue;
        if (itemc.isbounds) continue;
        newitems = this.intersectItemItem(item, itemc, newitems);
    }
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItem = function(item, itemc, newitems, f) { 
    if (!item.touches(itemc)) return newitems;
    newitems = this.intersectItemItemHorizontal(item, itemc, newitems);
    newitems = this.intersectItemItemVertical(item, itemc, newitems);
    newitems = this.intersectItemItemDepth(item, itemc, newitems);
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItemHorizontal = function(item, itemc, newitems) { 
    if (itemc.y >= item.y + item.height) return newitems;
    if (itemc.y + itemc.height <= item.y) return newitems;
    if (itemc.z >= item.z + item.depth) return newitems;
    if (itemc.z + itemc.depth <= item.z) return newitems;
    if (item.y < itemc.y) {
        newitems = this.intersectClip(this.intersectClipTop, item, itemc, newitems);
    }
    if (item.y + item.height > itemc.y + itemc.height) {        
        newitems = this.intersectClip(this.intersectClipBottom, item, itemc, newitems);
    }
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItemVertical = function(item, itemc, newitems) { 
    if (itemc.x >= item.x + item.width) return newitems;
    if (itemc.x + itemc.width <= item.x) return newitems;
    if (itemc.z >= item.z + item.depth) return newitems;
    if (itemc.z + itemc.depth <= item.z) return newitems;
    if (item.z < itemc.z) {
        newitems = this.intersectClip(this.intersectClipFront, item, itemc, newitems);
    }
    if (item.z + item.depth > itemc.z + itemc.depth) {        
        newitems = this.intersectClip(this.intersectClipBack, item, itemc, newitems);
    }
    if (item.x < itemc.x) {
        newitems = this.intersectClip(this.intersectClipLeft, item, itemc, newitems);
    }
    if (item.x + item.width > itemc.x + itemc.width) {        
        newitems = this.intersectClip(this.intersectClipRight, item, itemc, newitems);
    }
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItemDepth = function(item, itemc, newitems) { 
    if (itemc.x >= item.x + item.width) return newitems;
    if (itemc.x + itemc.width <= item.x) return newitems;
    if (itemc.y >= item.y + item.height) return newitems;
    if (itemc.y + itemc.height <= item.y) return newitems;
    if (item.x < itemc.x) {
        newitems = this.intersectClip(this.intersectClipLeft, item, itemc, newitems);
    }
    if (item.x + item.width > itemc.x + itemc.width) {        
        newitems = this.intersectClip(this.intersectClipRight, item, itemc, newitems);
    }
    if (item.y < itemc.y) {
        newitems = this.intersectClip(this.intersectClipTop, item, itemc, newitems);
    }
    if (item.y + item.height > itemc.y + itemc.height) {        
        newitems = this.intersectClip(this.intersectClipBottom, item, itemc, newitems);
    }
    return newitems;
}










WorldBuilderIntersect.prototype.intersectClip = function(f, item, itemc, newitems) {
    var newitem = item.clone(false);
    if (!newitem ) return newitems;
    f(item, itemc, newitem);
    item.initialize();
    newitem.initialize();
    newitems.push(newitem);
    return newitems;
}









WorldBuilderIntersect.prototype.intersectClipLeft = function(item, itemc, newitem) {
    var dx = itemc.x - item.x;
    var dw = item.width - dx;
    item.x = itemc.x;
    var t = item.parts.length;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var pw = p.width;
        if (pw > dw) p.width = dw;
    }
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var pw = p.width;
        if (pw > dx) p.width = dx;
    }
}



WorldBuilderIntersect.prototype.intersectClipRight = function(item, itemc, newitem) {
    var dx = (item.x + item.width) - (itemc.x + itemc.width);
    var dw = item.width - dx;
    var t = item.parts.length;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var pw = p.width;
        if (pw > dw) p.width = dw;
    }
    newitem.x = item.x + dw;
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var pw = p.width;
        if (pw > dx) p.width = dx;
    }
}



WorldBuilderIntersect.prototype.intersectClipTop = function(item, itemc, newitem) {
    var dy = itemc.y - item.y;
    var dh = item.height - dy;
    item.y = itemc.y;
    item.dotheme = false;
    var t = item.parts.length;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var ph = p.height;
        if (ph > dh) p.height = dh;
    }
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var ph = p.height;
        if (ph > dh) p.height = dy;
    }
}

WorldBuilderIntersect.prototype.intersectClipBottom = function(item, itemc, newitem) {
    var dy = (item.y + item.height) - (itemc.y + itemc.height);
    var dh = item.height - dy;
    var t = item.parts.length;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var ph = p.height;
        if (ph > dh) p.height = dh;
    }
    newitem.y = itemc.y + dh;
    newitem.dotheme = false;
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var ph = p.height;
        if (ph > dh) p.height = dy;
    }
}



WorldBuilderIntersect.prototype.intersectClipFront = function(item, itemc, newitem) {
    var dz = itemc.z - item.z;
    var dd = item.depth - dz;
    item.z = itemc.z;
    if (item.depth > dd) item.depth = dd;
    newitem.depth = dz;
}

WorldBuilderIntersect.prototype.intersectClipBack = function(item, itemc, newitem) {
    var dz = (item.z + item.depth) - (itemc.z + itemc.depth);
    var dd = item.depth - dz;
    if (item.depth > dd) item.depth = dd;
    newitem.z = itemc.z + dd;
    newitem.depth = dz;
}

