"use strict";

function StageBuilder() {
    this.itembuilder = new StageBuilderItems();
    this.collidebuilder = new StageBuilderColliders();
    this.themebuilder = new StageBuilderTheme();
    this.intersectbuilder = new StageBuilderIntersect();
    this.hsrbuilder = new StageBuilderHSR();
    this.chunkbuilder = new StageBuilderChunk();
}

StageBuilder.prototype.buildStage = function(now, stage) {
    this.itembuilder.buildStage(stage);
    this.collidebuilder.buildColliders(stage);
    stage.items = this.getStageItems(stage);
    this.chunkbuilder.chunk(stage);
    this.themebuilder.buildItems(stage);
    this.intersectbuilder.intersectItems(stage);
    stage.items.sort(sortByY);
    this.hsrbuilder.removeHiddenSurfaces(stage);
}

StageBuilder.prototype.getStageItems = function(stage) {
    var itemsout = new Array();
    var level = stage.level;
    var t = level.layers.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[i];
        if (layer.draw === false) continue;
        itemsout = this.getStageLayerItems(layer, itemsout);
    }
    return itemsout;
}

StageBuilder.prototype.getStageLayerItems = function(layer, itemsout) {
    var t = layer.items.items.length;
    for (var i = 0; i < t; i++) {
        var item = layer.items.items[i];
        if (item.draw == false) continue;
        itemsout.push(item);
    }
    return itemsout;
}
