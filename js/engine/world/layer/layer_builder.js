"use strict";

function LayerBuilder() {
    this.flood = null;
}

LayerBuilder.prototype.buildItems = function(items, renderer, layer) {
    if (!items.items.length) return;
    var newitems = new Array();
    var t = items.items.length;
    for (var i = 0; i < t; i++) this.buildItem(renderer, layer, items.items[i], i, newitems);
    for (var ii = 0; ii < newitems.length; ii++) items.addItem(items.items.length, newitems[ii]);
}


LayerBuilder.prototype.buildItem = function(renderer, layer, item, index, newitems) { 

    if (item.draw === false) return;

    if (item.iteminfo && item.iteminfo.flood) this.flood = item;

    if (layer.blur && !item.blur) item.blur = layer.blur;
    if (layer.graphics) item.graphics = layer.graphics;
    if (layer.top === false) item.top = layer.top;
    
    var theme = renderer.getItemTheme(item);
    if (!theme) return;
    
    item.depth = (theme.depth !== undefined) ? theme.depth : (item.depth !== undefined) ? item.depth : layer.depth;
    if (isNaN(item.depth)) item.depth = 1;
    
    item.cache = (layer.cache !== undefined) ? layer.cache : true;
    if (theme.draw !== undefined) item.draw = theme.draw;

    item.initialize();
    
    if (theme.items) {
        for (var i = 0; i < theme.items.length; i++) {
            this.buildItemItem(renderer, theme, item, theme.items[i], newitems);
        }
    }
}

LayerBuilder.prototype.buildItemItem = function(renderer, theme, item, itemitem, newitems) { 

    var name = item.name + "-" + itemitem.name;
    var newitem = new Item();
    newitem.name = item.id + "_" + name + "_" + item.z;

    newitem.cache = item.cache;
    newitem.collide = item.collide;
    newitem.draw = true;
    newitem.top = true;
    newitem.bottom = itemitem.bottom;
    if (itemitem.bottom === false) newitem.bottom = false;
    newitem.collide = (itemitem.collide !== undefined) ? itemitem.collide : item.collide;

    if (itemitem.itemtype !== undefined) newitem.itemtype = itemitem.itemtype;
    if (itemitem.iteminfo !== undefined) newitem.iteminfo = itemitem.iteminfo;

    
    
    
    
    // align  : left, right, top, bottom
    // iteminfo
    // itemtype
    
    var ix = itemitem.x ? itemitem.x : 0;
    var iy = itemitem.y ? itemitem.y : 0;
    var iz = itemitem.z ? itemitem.z : 0;
    
    newitem.x = item.x + ix;
    newitem.y = item.y + iy;
    newitem.z = item.z + iz;

    if (item.parts) {
        newitem.parts = JSON.parse(JSON.stringify(item.parts));
        newitem.keys = Object.keys(newitem.parts);
        for (var i = 0; i < newitem.keys.length; i++) {
            var ppp = newitem.parts[newitem.keys[i]];
            if (!ppp.ramp) ppp.height = itemitem.height;
        }
    } else {
        newitem.width = itemitem.width == "100%" ? item.width : itemitem.width ? itemitem.width : item.width;
        newitem.height = itemitem.height == "100%" ? item.height : itemitem.height ? itemitem.height : item.height;
    }
    newitem.depth = itemitem.depth == "100%" ? item.depth : itemitem.depth ? itemitem.depth : item.depth;

    
    

    
    
    if (itemitem.extrude) {
//        itemitem.extrude = 1;
        newitem.x -= itemitem.extrude;
        if (newitem.parts) {
            var keys = Object.keys(newitem.parts);
            newitem.parts[keys[0]].width += itemitem.extrude;
            for (var i = 1; i < keys.length; i++) {
                newitem.parts[keys[i]].x += itemitem.extrude;
            }
            newitem.parts[keys[keys.length - 1]].width += itemitem.extrude;
        } else {
            newitem.width += itemitem.extrude * 2;
        }
        newitem.z -= itemitem.extrude;
        newitem.depth += itemitem.extrude * 2;
        newitem.extrude = itemitem.extrude;
    }
    
//    newitem.bottom = false;
    
    if (itemitem.join) {
        if (itemitem.join == "subtract") {
            
            var sub = itemitem.height;
//            sub = 0;
            
            if (item.parts) {
                for (var i = 0; i < item.keys.length; i++) {
                    var ppp = item.parts[item.keys[i]];
                    ppp.height -= sub;
                }
                item.y += sub;
                item.height -= sub;
            } else {
                item.height -= sub;
                item.y += sub;
            }
            item.top = false;
            item.polygon.points.length = 0;
            item.getPolygon();
        }
    }
    
    
    
    

    
    newitem.initialize();
    newitems.push(newitem);
    
    if (itemitem.items) {
        for (var titem in itemitem.items) {
            this.buildItemItem(renderer, theme, itemitem, titem, newitems);
        }
    }
}