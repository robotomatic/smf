"use strict";

function WorldBuilderColliders() {
    this.collisionindex = new WorldColliderIndex();
}

WorldBuilderColliders.prototype.buildColliders = function(items, indexsize) {
    this.setBounds(items, indexsize);
    return this.buildCollidersColliders(items)
}

WorldBuilderColliders.prototype.setBounds = function(items, indexsize) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        this.collisionindex.checkBounds(item);        
    }
}

WorldBuilderColliders.prototype.buildCollidersColliders = function(items) {
    var newitems = new Array();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        var newitem = this.buildCollidersCollidersItem(item);
        if (newitem) newitems.push(newitem);
    }
    return newitems;
}

WorldBuilderColliders.prototype.buildCollidersCollidersItem = function(item) {
    var newitem = new Item(cloneObject(item.json));
    newitem.depth = item.depth;
    newitem.collide = true;
    newitem.initialize();
    return newitem;
}
