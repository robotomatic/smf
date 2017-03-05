"use strict";

function StageBuilderColliders() {
}

StageBuilderColliders.prototype.buildColliders = function(stage) {
    this.buildLevelColliders(stage.level);
}

StageBuilderColliders.prototype.buildLevelColliders = function(level) {
    if (!level || !level.layers) return;
    var t = level.layerkeys.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[level.layerkeys[i]];
        this.buildLayerColliders(layer);
        level.colliders = level.colliders.concat(layer.colliders);
    }
}

StageBuilderColliders.prototype.buildLayerColliders = function(layer) {
    if (layer.collide === false || layer.draw === false) return;
    for (var i = 0; i < layer.items.items.length; i++) {
        var item = layer.items.items[i];
        if (item.collide === false) continue;
        if (item.draw === false) continue;
        layer.colliders[layer.colliders.length] = item;
    }
}

