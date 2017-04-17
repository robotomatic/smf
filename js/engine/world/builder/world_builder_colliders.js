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
        if (item.draw === false && !item.bounds) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        if (item.isHidden()) continue;
        
        var args = {
            top : item.geometry.visible.top.visible,
            bottom : item.geometry.visible.bottom.visible,
            left : item.geometry.visible.left.visible,
            right : item.geometry.visible.right.visible,
            front : item.geometry.visible.front.visible,
            back : item.geometry.visible.back.visible
        };
        
        world.worldcollider.addCollider(item, args);
    }
    world.setBounds();
}