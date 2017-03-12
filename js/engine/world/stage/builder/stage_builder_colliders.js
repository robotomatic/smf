"use strict";

function StageBuilderColliders() {
}

StageBuilderColliders.prototype.buildColliders = function(stage, granularity) {
    this.setBounds(stage, granularity);
    this.buildCollidersColliders(stage)
}

StageBuilderColliders.prototype.setBounds = function(stage, granularity) {
    stage.stagecollider.setGranularity(granularity);
    this.loopStage(stage, function(stage, item) {
        stage.stagecollider.checkBounds(item);        
    });
}

StageBuilderColliders.prototype.buildCollidersColliders = function(stage) {
    this.loopStage(stage, function(stage, item) {
        var newitem = new Item(cloneObject(item.json));
        newitem.depth = item.depth;
        newitem.collide = true;
        newitem.initialize();
        stage.stagecollider.addCollider(newitem);
    });
}

StageBuilderColliders.prototype.loopStage = function(stage, f) {
    var level = stage.level;
    if (!level || !level.layers) return;
    var t = level.layerkeys.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[level.layerkeys[i]];
        this.loopLayer(stage, layer, f);
    }
}

StageBuilderColliders.prototype.loopLayer = function(stage, layer, f) {
    if (layer.collide === false || layer.draw === false) return;
    for (var i = 0; i < layer.items.items.length; i++) {
        var item = layer.items.items[i];
        if (item.collide === false) continue;
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        f(stage, item);
    }
}