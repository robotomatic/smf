"use strict";

function StageBuilderIntersect() {
}

StageBuilderIntersect.prototype.intersectItems = function(stage) { 
    var items = this.getStageItems(stage);
    for (var i = 0; i < items.length; i++) {
        this.intersectItemItems(items[i], items);
    }
}

StageBuilderIntersect.prototype.getStageItems = function(stage) {
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

StageBuilderIntersect.prototype.getStageLayerItems = function(layer, itemsout) {
    var t = layer.items.items.length;
    for (var i = 0; i < t; i++) {
        var item = layer.items.items[i];
        if (item.draw == false) continue;
        itemsout.push(item);
    }
    return itemsout;
}




StageBuilderIntersect.prototype.intersectItemItems = function(item, items) { 
    if (item.width == "100%" || item.height == "100%" || item.depth == "100%") return;
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc == item) continue;
        this.intersectItemItem(item, itemc);
    }
}

StageBuilderIntersect.prototype.intersectItemItem = function(item, itemc) { 
    
    
    return;
    

    if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") return;
    
    if (itemc.y + itemc.height < item.y) return;
    if (itemc.y > item.y + item.height) return;
    if (itemc.z + itemc.depth < item.z) return;
    if (itemc.z > item.z + item.depth) return;
    if (itemc.x + itemc.width < item.x) return;
    if (itemc.x > item.x + item.width) return;
    
    
    this.intersectItemsItemItemTop(item, itemc);
    this.intersectItemsItemItemBottom(item, itemc);
    this.intersectItemsItemItemLeft(item, itemc);
    this.intersectItemsItemItemRight(item, itemc);
    this.intersectItemsItemItemFront(item, itemc);
    this.intersectItemsItemItemBack(item, itemc);
}

StageBuilderIntersect.prototype.intersectItemsItemItemTop = function(item, itemc) {
    if (itemc.y <= item.y) {
        if (itemc.y + itemc.height >= item.y) {
            
            if (itemc.z + itemc.depth <= item.z) return;
            if (itemc.z >= item.z + item.depth) return;
            if (itemc.x + itemc.width <= item.x) return;
            if (itemc.x >= item.x + item.width) return;

            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
                // partial coverage on x axis
                return;
            }
            if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
                // partial coverage on z axis
                return;
            }
            
            item.geometry.visible.top = false;
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemBottom = function(item, itemc) {
    if (itemc.y <= item.y + item.height) {
        if (itemc.y + itemc.height >= item.y + item.height) {
            
            if (itemc.z + itemc.depth <= item.z) return;
            if (itemc.z >= item.z + item.depth) return;
            if (itemc.x + itemc.width <= item.x) return;
            if (itemc.x >= item.x + item.width) return;
            
            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
                // partial coverage on x axis
                return;
            }
            if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
                // partial coverage on z axis
                return;
            }
            
            item.geometry.visible.bottom = false;
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemLeft = function(item, itemc) {
    if (itemc.x <= item.x) {
        if (itemc.x + itemc.width >= item.x) {
            
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.z + itemc.depth <= item.z) return;
            if (itemc.z >= item.z + item.depth) return;

            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                // partial coverage on y axis
                return;
            }
            if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
                // partial coverage on z axis
                return;
            }
            
            item.geometry.visible.left = false;
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemRight = function(item, itemc) {
    if (itemc.x <= item.x + item.width) {
        if (itemc.x + itemc.width >= item.x + item.width) {
            
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.z + itemc.depth <= item.z) return;
            if (itemc.z >= item.z + item.depth) return;

            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                // partial coverage on y axis
                return;
            }
            if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
                // partial coverage on z axis
                return;
            }
            
            item.geometry.visible.right = false;
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemFront = function(item, itemc) {
    if (itemc.z <= item.z) {
        if (itemc.z + itemc.depth >= item.z) {
            
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.x + itemc.width <= item.x) return;
            if (itemc.x >= item.x + item.width) return;

            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
                // partial coverage on x axis
                return;
            }
            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                // partial coverage on y axis
                return;
            }
            
            item.geometry.visible.front = false;
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemBack = function(item, itemc) {
    if (itemc.z <= item.z + item.depth) {
        if (itemc.z + itemc.depth >= item.z + item.depth) {
            
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.x + itemc.width <= item.x) return;
            if (itemc.x >= item.x + item.width) return;

            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
                // partial coverage on x axis
                return;
            }
            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                // partial coverage on y axis
                return;
            }

            item.geometry.visible.back = false;
        }
    }
}