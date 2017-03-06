"use strict";

function StageBuilderItems() {
    this.flood = null;
}

StageBuilderItems.prototype.buildStage = function(stage) {
    this.buildStageLevel(stage, stage.level);
}

StageBuilderItems.prototype.buildStageLevel = function(stage, level) {
    if (!level.layers) return;
    for (var i = 0; i < level.layers.length; i++) this.buildStageLevelLayer(stage, level, level.layers[i]);
}

StageBuilderItems.prototype.buildStageLevelLayer = function(stage, level, layer) {
    if (layer.draw === false) return;
    var items = layer.items;
    if (!items.items.length) return;
    var newitems = new Array();
    for (var i = 0; i < items.items.length; i++) {
        this.buildStageLevelLayerItem(stage, level.itemrenderer, layer, items.items[i], i, newitems);
    }
}

StageBuilderItems.prototype.buildStageLevelLayerItem = function(stage, renderer, layer, item, index, newitems) { 
    if (!item || item.draw === false) return;
    if (item.iteminfo && item.iteminfo.flood) {
        // todo: set flood info based on renderer theme
        stage.stagerenderer.flood.init(item);
    }
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
}