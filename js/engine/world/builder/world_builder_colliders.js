"use strict";

function WorldBuilderColliders() {
    //
    // TODO: How to save colliders? 
    // - Nice to use collider index for pathfinding, so surface visibility is necessary (after chunk)
    //
    this.indexsize = {
        width: 100,
        height: 100,
        depth : 100
    }
    this.collisionindex = new WorldColliderIndex();
}

WorldBuilderColliders.prototype.reset = function() { 
    this.collisionindex.reset();
}

WorldBuilderColliders.prototype.buildColliders = function(world) {
    var items = world.items;
    this.buildCollidersColliders(world, items)
}

WorldBuilderColliders.prototype.buildCollidersColliders = function(world, items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        if (item.isHidden()) continue;
        if (!item.isbounds) this.collisionindex.checkBounds(item);        
        if (item.draw === false && !item.isbounds) continue;
        var newitem = this.buildCollidersCollidersItem(item);
        if (newitem) {
            world.worldcollider.colliders.push(newitem);
        }
    }
}

WorldBuilderColliders.prototype.buildCollidersCollidersItem = function(item) {
//    var newitem = item.clone();
//    newitem.collide = true;
//    newitem.initialize();
//    if (newitem.geometry.visible.top.visible) newitem.traversable = true;
//    return newitem;
    if (item.geometry.visible.top.visible) item.traversable = true;
    return item;
}
