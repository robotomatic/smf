"use strict";

function StageBuilderItems() {
    this.flood = null;
}

StageBuilderItems.prototype.buildStage = function(stage) {
    return this.buildStageLevel(stage, stage.level);
}

StageBuilderItems.prototype.buildStageLevel = function(stage, level) {
    var out = new Array();
    if (!level.layers) return out;
    for (var i = 0; i < level.layers.length; i++) {
        var layer = level.layers[i];
        if (layer.draw === false) continue;
        var newitems = this.buildStageLevelLayer(stage, level, level.layers[i]);
        out = out.concat(newitems);
    }
    return out;
}

StageBuilderItems.prototype.buildStageLevelLayer = function(stage, level, layer) {
    var newitems = new Array();
    if (layer.draw === false) return newitems;
    var items = layer.items;
    if (!items.items.length) return newitems;
    for (var i = 0; i < items.items.length; i++) {
        var item = items.items[i];
        if (item.draw == false) continue;
        var newitem = this.buildStageLevelLayerItem(stage, level.itemrenderer, layer, item);
        if (newitem) newitems.push(newitem);
    }
    return newitems;
}

StageBuilderItems.prototype.buildStageLevelLayerItem = function(stage, renderer, layer, item) { 
    if (!item || item.draw === false) return null;
    if (item.iteminfo && item.iteminfo.flood) {
        //
        // todo: set flood info based on renderer theme
        //
        stage.stagerenderer.flood.init(item);
    }
    if (layer.collide === false) item.collide = false;
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
    return item;
}