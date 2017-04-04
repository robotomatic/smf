"use strict";

function WorldBuilderOverlap() {
}

WorldBuilderOverlap.prototype.reset = function() { 
}

WorldBuilderOverlap.prototype.overlapItems = function(world) { 
    var items = world.items;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        if (item.isHidden()) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        if (item.waterline) continue;
        var newitems = this.overlapItemItems(item, items);
        if (newitems) {
            items = items.concat(newitems);
        }
    }
    world.items = items;
}

WorldBuilderOverlap.prototype.overlapItemItems = function(item, items) { 
    var newitems = new Array();
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc.isHidden()) continue;
        if (itemc == item) continue;
        if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") continue;
        if (itemc.waterline) continue;
        newitems = this.overlapItemItem(item, itemc, newitems);
    }
    return newitems;
}

WorldBuilderOverlap.prototype.overlapItemItem = function(item, itemc, newitems) { 
    if (!item.overlaps(itemc)) return newitems;
    newitems = this.overlapItemItemHorizontal(item, itemc, newitems);
    newitems = this.overlapItemItemVertical(item, itemc, newitems);
    newitems = this.overlapItemItemDepth(item, itemc, newitems);
    return newitems;
}

WorldBuilderOverlap.prototype.overlapItemItemHorizontal = function(item, itemc, newitems) { 
    if (item.x < itemc.x) {
        newitems = this.overlapClip(this.overlapClipLeft, item, itemc, newitems);
    }
    if (item.x + item.width > itemc.x + itemc.width) {
        newitems = this.overlapClip(this.overlapClipRight, item, itemc, newitems);
    }
    return newitems;
}

WorldBuilderOverlap.prototype.overlapItemItemVertical = function(item, itemc, newitems) { 
    if (item.y < itemc.y) {
        newitems = this.overlapClip(this.overlapClipTop, item, itemc, newitems);
    }
    if (item.y + item.height > itemc.y + itemc.height) {
        newitems = this.overlapClip(this.overlapClipBottom, item, itemc, newitems);
    }
    return newitems;
}

WorldBuilderOverlap.prototype.overlapItemItemDepth = function(item, itemc, newitems) { 
    if (item.z < itemc.z) {
        newitems = this.overlapClip(this.overlapClipFront, item, itemc, newitems);
    }
    if (item.z + item.depth > itemc.z + itemc.depth) {
        newitems = this.overlapClip(this.overlapClipBack, item, itemc, newitems);
    }
    return newitems;
}










WorldBuilderOverlap.prototype.overlapClip = function(f, item, itemc, newitems) {
    var newitem = item.clone();
    if (!newitem ) return newitems;
    f(item, itemc, newitem);
    item.initialize();
    newitem.initialize();
    newitems.push(newitem);
    return newitems;
}









WorldBuilderOverlap.prototype.overlapClipLeft = function(item, itemc, newitem) {
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



WorldBuilderOverlap.prototype.overlapClipRight = function(item, itemc, newitem) {
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



WorldBuilderOverlap.prototype.overlapClipTop = function(item, itemc, newitem) {
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

WorldBuilderOverlap.prototype.overlapClipBottom = function(item, itemc, newitem) {
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



WorldBuilderOverlap.prototype.overlapClipFront = function(item, itemc, newitem) {
    var dz = itemc.z - item.z;
    var dd = item.depth - dz;
    item.z = itemc.z;
    if (item.depth > dd) item.depth = dd;
    newitem.depth = dz;
}

WorldBuilderOverlap.prototype.overlapClipBack = function(item, itemc, newitem) {
    var dz = (item.z + item.depth) - (itemc.z + itemc.depth);
    var dd = item.depth - dz;
    if (item.depth > dd) item.depth = dd;
    newitem.z = itemc.z + dd;
    newitem.depth = dz;
}

