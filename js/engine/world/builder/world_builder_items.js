"use strict";

function WorldBuilderItems() {
    this.waterline = null;
}

WorldBuilderItems.prototype.buildWorld = function(world) {
    return this.buildWorldLevel(world, world.level);
}

WorldBuilderItems.prototype.buildWorldLevel = function(world, level) {
    var out = new Array();
    if (!level.layers) return out;
    for (var i = 0; i < level.layers.length; i++) {
        var layer = level.layers[i];
        if (layer.draw === false) continue;
        var newitems = this.buildWorldLevelLayer(world, level, level.layers[i]);
        out = out.concat(newitems);
    }
    return out;
}

WorldBuilderItems.prototype.buildWorldLevelLayer = function(world, level, layer) {
    var newitems = new Array();
    if (layer.draw === false) return newitems;
    var items = layer.items;
    if (!items.items.length) return newitems;
    for (var i = 0; i < items.items.length; i++) {
        var item = items.items[i];
        if (item.draw == false) continue;
        var newitem = this.buildWorldLevelLayerItem(world, layer, item);
        if (newitem) newitems.push(newitem);
    }
    return newitems;
}

WorldBuilderItems.prototype.buildWorldLevelLayerItem = function(world, layer, item) { 
    if (!item || item.draw === false) return null;
    if (item.iteminfo && item.iteminfo.waterline) {
        //
        // todo: set waterline info based on renderer theme
        //
        world.worldrenderer.waterline.init(item);
    }
    if (layer.collide === false) item.collide = false;
    if (layer.blur && !item.blur) item.blur = layer.blur;
    if (layer.graphics) item.graphics = layer.graphics;
    if (layer.top === false) item.top = layer.top;
    var theme = world.worldrenderer.itemrenderer.getItemTheme(item);
    if (!theme) return;
    item.depth = (theme.depth !== undefined) ? theme.depth : (item.depth !== undefined) ? item.depth : layer.depth;
    if (isNaN(item.depth)) item.depth = 1;
    item.cache = (layer.cache !== undefined) ? layer.cache : true;
    if (theme.draw !== undefined) item.draw = theme.draw;
    item.initialize();
    return item;
}