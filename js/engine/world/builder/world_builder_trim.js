"use strict";

function WorldBuilderTrim() {
}

WorldBuilderTrim.prototype.reset = function() { 
}

WorldBuilderTrim.prototype.buildWorldTrim = function(world) {
    var items = world.items;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.parts) continue;
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        if (item.waterline) continue;
        if (item.isbounds) continue;
        items = this.buildWorldTrimItem(items, item);
    }
    world.items = items;
}

WorldBuilderTrim.prototype.buildWorldTrimItem = function(items, item) { 
    if (!item) return items;
    if (!item.trim) return items;
    this.buildWorldTrimItem(items, item);
    return items;
}

WorldBuilderTrim.prototype.buildWorldTrimItem = function(items, item) { 
    
    var trim = item.trim;
    if (!trim) return items;
    item.trimdepth = trim;
    
    if (item.depth > trim) {
        var newitem = this.copyItem(item);
        newitem = this.resizeItemDepth(newitem, 0, trim);
        newitem.initialize();
//        newitem.trim = false;
        newitem.trimdepth = 0;
        newitem.trimdwidth = trim;
        newitem.geometry.visible.back.visible = false;
        items.push(newitem);
        item = this.resizeItemDepth(item, trim, item.depth - trim);
        item.initialize();
        item.trimdepth = trim;
        newitem.trimwidth = trim;
        item.geometry.visible.front.visible = false;
    }
    
    if (item.depth > trim) {
        var newitem = this.copyItem(item);
        newitem = this.resizeItemDepth(newitem, item.depth - trim, trim);
        newitem.initialize();
//        newitem.trim = false;
        newitem.trimdepth = 0;
        newitem.trimdwidth = trim;
        newitem.geometry.visible.front.visible = false;
        items.push(newitem);
        item = this.resizeItemDepth(item, 0, item.depth - trim);
        item.initialize();
        newitem.trimwidth = trim;
        item.geometry.visible.back.visible = false;
    }
    
    if (item.width > trim) {
        var newitem = this.copyItem(item);
        newitem = this.resizeItemHorizontal(newitem, 0, trim);
        newitem.initialize();
        newitem.trim = false;
        newitem.trimwidth = 0;
        newitem.geometry.visible.right.visible = false;
        items.push(newitem);
        item = this.resizeItemHorizontal(item, trim, item.width - trim);
        item.initialize();
        item.trimdepth = trim;
        item.trimwidth = trim;
        item.geometry.visible.left.visible = false;
    }
    
    if (item.width > trim) {
        var newitem = this.copyItem(item);
        newitem = this.resizeItemHorizontal(newitem, item.width - trim, trim);
        newitem.initialize();
        newitem.trim = false;
        newitem.trimwidth = 0;
        newitem.geometry.visible.left.visible = false;
        items.push(newitem);
        item = this.resizeItemHorizontal(item, 0, item.width - trim);
        item.initialize();
        item.trimdepth = trim;
        item.trimwidth = trim;
        item.geometry.visible.right.visible = false;
    }
    
    return items;
}



WorldBuilderTrim.prototype.copyItem = function(item) {
    var newitem = item.clone(false);
    newitem.initialize();
    return newitem;
}


WorldBuilderTrim.prototype.resizeItemHorizontal = function(item, x, width) {
    item.x += x;
    if (item.parts) {
        var t = item.parts.length;
        for (var i = 0; i < t; i++) {
            var part = item.parts[i];
            if (part.width > width) part.width = width;
        }
    }
    return item;
}

WorldBuilderTrim.prototype.resizeItemDepth = function(item, z, depth) {
    item.z += z;
    if (item.depth > depth) item.depth = depth;
    return item;
}
