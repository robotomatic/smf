"use strict";

function StageBuilderTheme() {
    this.addparts = true;
}

StageBuilderTheme.prototype.buildItems = function(stage) { 
    if (!this.addparts) return;
    if (!stage.items.length) return;
    var newitems = new Array();
    for (var i = 0; i < stage.items.length; i++) {
        this.buildItemItems(stage, stage.level.itemrenderer, stage.items[i], newitems);
    }
    for (var ii = 0; ii < newitems.length; ii++) {
        stage.items.push(newitems[ii]);
    }
}

StageBuilderTheme.prototype.buildItemItems = function(stage, renderer, item, newitems) {
    var theme = renderer.getItemTheme(item);
    if (!theme) return;
    if (theme.items) {
        for (var i = 0; i < theme.items.length; i++) {
            this.buildItemItem(renderer, theme, item, theme.items[i], newitems);
        }
    }
}

StageBuilderTheme.prototype.buildItemItem = function(renderer, theme, item, itemitem, newitems) { 

    var newitem = new Item();
    var name = item.name + "-" + itemitem.name;
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
    
    if (itemitem.join) {
        if (itemitem.join == "subtract") {
            var sub = itemitem.height;
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
            item.initialize();
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