"use strict";

function WorldBuilderItems() {
}

WorldBuilderItems.prototype.buildWorld = function(world) {
    var level = world.level;
    if (!level.layers) return;
    for (var i = 0; i < level.layers.length; i++) {
        var layer = level.layers[i];
        var newitems = this.buildWorldLevelLayer(world, level, level.layers[i]);
        if (newitems) world.items = world.items.concat(newitems);
    }
}

WorldBuilderItems.prototype.buildWorldLevelLayer = function(world, level, layer) {
    var newitems = new Array();
    var items = layer.items;
    if (!items.items.length) return newitems;
    for (var i = 0; i < items.items.length; i++) {
        var item = items.items[i];
        var newitem = this.buildWorldLevelLayerItem(world, layer, item);
        if (newitem) newitems.push(newitem);
    }
    return newitems;
}

WorldBuilderItems.prototype.buildWorldLevelLayerItem = function(world, layer, item) { 
    if (!item) return null;
    if (layer.isbounds === true) item.isbounds = true;
    if (layer.collide === false) item.collide = false;
    if (layer.draw === false) item.draw = false;
    if (layer.blur && !item.blur) item.blur = layer.blur;
    if (layer.graphics) item.graphics = layer.graphics;
    if (layer.top === false) item.top = layer.top;
    var theme = world.worldrenderer.itemrenderer.getItemTheme(item);
    if (theme) {
        item.depth = (theme.depth !== undefined) ? theme.depth : (item.depth !== undefined) ? item.depth : layer.depth;
        if (isNaN(item.depth)) item.depth = 1;
        item.cache = (layer.cache !== undefined) ? layer.cache : true;
        if (theme.draw !== undefined) item.draw = theme.draw;
    }
    item.initialize();
    return item;
}