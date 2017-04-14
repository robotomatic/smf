"use strict";

function WorldBuilderColliders() {
}

WorldBuilderColliders.prototype.reset = function(world) { 
    world.worldcollider.reset();
}

WorldBuilderColliders.prototype.buildColliders = function(world) {
    world.worldcollider.colliders.length = 0;
    var items = world.renderitems;
    this.buildCollidersColliders(world, items)
}

WorldBuilderColliders.prototype.buildCollidersColliders = function(world, items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        if (item.isHidden()) continue;
        if (item.geometry.visible.top.visible) item.traversable = true;
        world.worldcollider.addCollider(item);
    }
    world.setBounds();
}