"use strict";

function StageBuilderColliders() {
    this.collisionindex = new StageColliderIndex();
}

StageBuilderColliders.prototype.buildColliders = function(items, indexsize) {
    this.setBounds(items, indexsize);
    return this.buildCollidersColliders(items)
}

StageBuilderColliders.prototype.setBounds = function(items, indexsize) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        this.collisionindex.checkBounds(item);        
    }
}

StageBuilderColliders.prototype.buildCollidersColliders = function(items) {
    var newitems = new Array();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.collide === false) continue;
        var newitem = this.buildCollidersCollidersItem(item);
        if (newitem) newitems.push(newitem);
    }
    return newitems;
}

StageBuilderColliders.prototype.buildCollidersCollidersItem = function(item) {
    var newitem = new Item(cloneObject(item.json));
    newitem.depth = item.depth;
    newitem.collide = true;
    newitem.initialize();
    return newitem;
}
