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

WorldBuilderColliders.prototype.buildColliders = function(world) {
    var items = world.items;
    this.setBounds(items);
    this.buildCollidersColliders(world, items)
}

WorldBuilderColliders.prototype.setBounds = function(items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        this.collisionindex.checkBounds(item);        
    }
}

WorldBuilderColliders.prototype.buildCollidersColliders = function(world, items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        var newitem = this.buildCollidersCollidersItem(item);
        if (newitem) {
            world.worldcollider.colliders.push(newitem);
        }
    }
}

WorldBuilderColliders.prototype.buildCollidersCollidersItem = function(item) {
    var newitem = item.clone();
    newitem.collide = true;
    newitem.initialize();
    return newitem;
}
