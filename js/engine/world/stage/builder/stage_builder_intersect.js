"use strict";

function StageBuilderIntersect() {
}

StageBuilderIntersect.prototype.intersectItems = function(stage) { 
    for (var i = 0; i < stage.items.length; i++) {
        var item = stage.items[i];
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        this.intersectItemItems(stage, item, stage.items);
    }
}

StageBuilderIntersect.prototype.intersectItemItems = function(stage, item, items) { 
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        this.intersectItemItem(stage, item, itemc, "intersectItemItemLeftRight");
    }
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        this.intersectItemItem(stage, item, itemc, "intersectItemItemFrontBack");
    }
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        this.intersectItemItem(stage, item, itemc, "intersectItemItemTopBottom");
    }
}

StageBuilderIntersect.prototype.intersectItemItem = function(stage, item, itemc, f) { 
    if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") return;
    if (itemc.y + itemc.height < item.y) return;
    if (itemc.y > item.y + item.height) return;
    if (itemc.z + itemc.depth < item.z) return;
    if (itemc.z > item.z + item.depth) return;
    if (itemc.x + itemc.width < item.x) return;
    if (itemc.x > item.x + item.width) return;
    this[f](stage, item, itemc);
}

StageBuilderIntersect.prototype.intersectItemItemLeftRight = function(stage, item, itemc) { 
    this.intersectItemsItemItemRight(stage, item, itemc);
    this.intersectItemsItemItemLeft(stage, item, itemc);
}

StageBuilderIntersect.prototype.intersectItemItemFrontBack = function(stage, item, itemc) { 
    this.intersectItemsItemItemFront(stage, item, itemc);
    this.intersectItemsItemItemBack(stage, item, itemc);
}

StageBuilderIntersect.prototype.intersectItemItemTopBottom = function(stage, item, itemc) { 
//    this.intersectItemsItemItemTop(stage, item, itemc);
//    this.intersectItemsItemItemBottom(stage, item, itemc);
}


StageBuilderIntersect.prototype.intersectItemsItemItemTop = function(stage, item, itemc) {
//    if (itemc.y <= item.y) {
//        if (itemc.y + itemc.height >= item.y) {
//            
//            if (itemc.z + itemc.depth <= item.z) return;
//            if (itemc.z >= item.z + item.depth) return;
//            if (itemc.x + itemc.width <= item.x) return;
//            if (itemc.x >= item.x + item.width) return;
//
//            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
//                // partial coverage on x axis
//                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
//                    // partial coverage on z axis
//                    console.log(item.id + " === " + itemc.id + " == Top");
//                }
//            }
//        }
//    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemBottom = function(stage, item, itemc) {
//    if (itemc.y <= item.y + item.height) {
//        if (itemc.y + itemc.height >= item.y + item.height) {
//            
//            if (itemc.z + itemc.depth <= item.z) return;
//            if (itemc.z >= item.z + item.depth) return;
//            if (itemc.x + itemc.width <= item.x) return;
//            if (itemc.x >= item.x + item.width) return;
//            
//            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
//                // partial coverage on x axis
//                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
//                    // partial coverage on z axis
//                    console.log(item.id + " === " + itemc.id + " == Bottom");
//                }
//            }
//        }
//    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemLeft = function(stage, item, itemc) {
    if (itemc.x <= item.x) {
        if (itemc.x + itemc.width >= item.x) {
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.z + itemc.depth <= item.z) return;
            if (itemc.z >= item.z + item.depth) return;
            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) <= 0)) {
                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) <= 0)) {
                    var clip = "left";
                    if (item.y + item.height > itemc.y + itemc.height) {
                        this.intersectClip(this.intersectClipBottom, stage, item, itemc, clip, "bottom");
                        return;
                    }
                    if (item.y < itemc.y) {
                        this.intersectClip(this.intersectClipTop, stage, item, itemc, clip, "top");
                        return;
                    }
                }
            }
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemRight = function(stage, item, itemc) {
    if (itemc.x <= item.x + item.width) {
        if (itemc.x + itemc.width >= item.x + item.width) {
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.z + itemc.depth <= item.z) return;
            if (itemc.z >= item.z + item.depth) return;
            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) <= 0)) {
                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) <= 0)) {
                    var clip = "right";
                    if (item.y < itemc.y) {
                        this.intersectClip(this.intersectClipTop, stage, item, itemc, clip, "top");
                        return;
                    }
                    if (item.y + item.height > itemc.y + itemc.height) {
                        this.intersectClip(this.intersectClipBottom, stage, item, itemc, clip, "bottom");
                        return;
                    }
                }
            }
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemFront = function(stage, item, itemc) {
    if (itemc.z <= item.z) {
        if (itemc.z + itemc.depth >= item.z) {
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.x + itemc.width <= item.x) return;
            if (itemc.x >= item.x + item.width) return;
            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) <= 0)) {
                if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                    var clip = "front";
                    if (item.x + item.width > itemc.x + itemc.width) {
                        this.intersectClip(this.intersectClipRight, stage, item, itemc, clip, "right");
                        return;
                    }
                    if (item.x < itemc.x) {
                        this.intersectClip(this.intersectClipLeft, stage, item, itemc, clip, "left");
                        return;
                    }
                    if (item.y < itemc.y) {
                        this.intersectClip(this.intersectClipTop, stage, item, itemc, clip, "top");
                        return;
                    }
                    if (item.y + item.height > itemc.y + itemc.height) {
                        this.intersectClip(this.intersectClipBottom, stage, item, itemc, clip, "bottom");
                        return;
                    }
                }
            }
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemBack = function(stage, item, itemc) {
    if (itemc.z <= item.z + item.depth) {
        if (itemc.z + itemc.depth >= item.z + item.depth) {
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.x + itemc.width <= item.x) return;
            if (itemc.x >= item.x + item.width) return;
            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) <= 0)) {
                if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                    var clip = "back";
                    if (item.x + item.width > itemc.x + itemc.width) {
                        this.intersectClip(this.intersectClipRight, stage, item, itemc, clip, "right");
                        return;
                    }
                    if (item.x < itemc.x) {
                        this.intersectClip(this.intersectClipLeft, stage, item, itemc, clip, "left");
                        return;
                    }
                    if (item.y < itemc.y) {
                        this.intersectClip(this.intersectClipTop, stage, item, itemc, clip, "top");
                        return;
                    }
                    if (item.y + item.height > itemc.y + itemc.height) {
                        this.intersectClip(this.intersectClipBottom, stage, item, itemc, clip, "bottom");
                        return;
                    }
                }
            }
        }
    }
}









StageBuilderIntersect.prototype.intersectClip = function(f, stage, item, itemc, clip, dir) {
    var newitem = item.clone();
    if (!newitem ) return;
    f(item, itemc, newitem);
    item.initialize();
    newitem.initialize();
    stage.items.push(newitem);
//    console.log(item.id + " === " + itemc.id + " ==> " + clip + " - " + dir);
}









StageBuilderIntersect.prototype.intersectClipRight = function(item, itemc, newitem) {
    var dw = (item.x + item.width) - (itemc.x + itemc.width);
    var dx = item.x + item.width - itemc.x;
    item.x = itemc.x + itemc.width;
    var t = item.parts.length;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var pw = p.width;
        if (pw > dw) p.width = dw;
    }
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var pw = p.width;
        if (pw > dx) p.width = dx;
    }
}

StageBuilderIntersect.prototype.intersectClipLeft = function(item, itemc, newitem) {
    var dw = itemc.x - item.x;
    var dx = item.x + item.width - itemc.x;
    var t = item.parts.length;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var pw = p.width;
        if (pw > dw) p.width = dw;
    }
    newitem.x = itemc.x;
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var pw = p.width;
        if (pw > dx) p.width = dx;
    }
}







StageBuilderIntersect.prototype.intersectClipTop = function(item, itemc, newitem) {
    var dh = itemc.y - item.y;
    var dy = item.y + item.height - itemc.y;
    var t = item.parts.length;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var ph = p.height;
        if (ph > dh) p.height = dh;
    }
    newitem.y = itemc.y;
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var ph = p.height;
        if (ph > dy) p.height = dy;
    }
}

StageBuilderIntersect.prototype.intersectClipBottom = function(item, itemc, newitem) {
    var dh = itemc.y - item.y + itemc.height;
    var dy = (item.y + item.height) - (itemc.y + itemc.height);
    var t = item.parts.length;
    item.y = itemc.y + itemc.height;
    for (var i = 0; i < t; i++) {
        var p = item.parts[i];
        var ph = p.height;
        if (ph > dy) p.height = dy;
    }
    for (var i = 0; i < t; i++) {
        var p = newitem.parts[i];
        var ph = p.height;
        if (ph > dh) p.height = dh;
    }
}
