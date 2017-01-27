"use strict";

function LayerBuilder() {}


LayerBuilder.prototype.buildItems = function(items, renderer, layer) { 
    if (!items.items.length) return;
    var newitems = new Array();
    var t = items.items.length;
    for (var i = 0; i < t; i++) this.buildItem(renderer, items.items[i], i, newitems, layer);
    for (var ii = 0; ii < newitems.length; ii++) items.addItem(items.items.length, newitems[ii]);
}


LayerBuilder.prototype.buildItem = function(renderer, item, index, newitems, layer) { 
    var theme = renderer.getItemTheme(item);
    if (layer.parallax) item.parallax = layer.parallax;
    if (layer.blur) item.blur = layer.blur;
    if (layer.cache) item.cache = layer.cache;
    if (layer.top) item.top = layer.top;
    if (!theme) {
        if (layer.zindex) item.zindex = layer.zindex;
        return;
    }
    var z = (item.zindex) ? item.zindex : 0;
    item.zindex = ((theme.zindex !== undefined) ? theme.zindex : layer.zindex) + index + z;
    item.depth = (theme.depth !== undefined) ? theme.depth : layer.depth;
    if (theme.draw !== undefined) item.draw = theme.draw;
    if (theme.before) this.buildItemItems(renderer, theme, item, item.zindex - 1, "before", theme.before, newitems);
    if (theme.after) this.buildItemItems(renderer, theme, item, item.zindex + 1, "after", theme.after, newitems);
    if (theme.top && theme.top.before) this.buildItemTopItems(renderer, theme, item, item.zindex - 1, item.depth, "before", theme.top.before, newitems);
    if (theme.top && theme.top.after) this.buildItemTopItems(renderer, theme, item, item.zindex + 1, 0, "after", theme.top.after, newitems);
}

LayerBuilder.prototype.buildItemItems = function(renderer, theme, item, zindex, name, items, newitems) { 
    for (var i = 0; i < items.length; i++) this.buildItemItemsItem(renderer, theme, item, zindex, name + "_" + i, items[i], newitems);
}

LayerBuilder.prototype.buildItemItemsItem = function(renderer, theme, item, zindex, name, itemitem, newitems) { 
    
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

LayerBuilder.prototype.buildItemTopItems = function(renderer, theme, item, zindex, depth, name, items, newitems) { 
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

LayerBuilder.prototype.buildItemTopItemsItem = function(renderer, theme, item, zindex, name, itemitem, newitems) { 
    
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

