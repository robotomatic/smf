"use strict";

function StageBuilderColliders() {
}

StageBuilderColliders.prototype.buildColliders = function(stage) {
    var level = stage.level;
    if (!level || !level.layers) return;
    var t = level.layerkeys.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[level.layerkeys[i]];
        this.buildLayerColliders(stage, layer);
    }
}

StageBuilderColliders.prototype.buildLayerColliders = function(stage, layer) {
    if (layer.collide === false || layer.draw === false) return;
    for (var i = 0; i < layer.items.items.length; i++) {
        var item = layer.items.items[i];
        if (item.collide === false) continue;
        if (item.draw === false) continue;
        var newitem = new Item(cloneObject(item.json));
        newitem.depth = item.depth;
        newitem.collide = true;
        newitem.initialize();
        stage.stagecollider.colliders[stage.stagecollider.colliders.length] = newitem;
    }
}

