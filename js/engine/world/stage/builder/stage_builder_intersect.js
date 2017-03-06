"use strict";

function StageBuilderIntersect() {
}

StageBuilderIntersect.prototype.intersectItems = function(stage) { 
    for (var i = 0; i < stage.items.length; i++) {
        this.intersectItemItems(stage, stage.items[i], stage.items);
    }
}

StageBuilderIntersect.prototype.intersectItemItems = function(stage, item, items) { 
    if (item.width == "100%" || item.height == "100%" || item.depth == "100%") return;
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc == item) continue;
        this.intersectItemItem(stage, item, itemc);
    }
}

StageBuilderIntersect.prototype.intersectItemItem = function(stage, item, itemc) { 

    if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") return;
    
    if (itemc.y + itemc.height < item.y) return;
    if (itemc.y > item.y + item.height) return;
    if (itemc.z + itemc.depth < item.z) return;
    if (itemc.z > item.z + item.depth) return;
    if (itemc.x + itemc.width < item.x) return;
    if (itemc.x > item.x + item.width) return;
    
    this.intersectItemsItemItemTop(stage, item, itemc);
    this.intersectItemsItemItemBottom(stage, item, itemc);
    this.intersectItemsItemItemLeft(stage, item, itemc);
    this.intersectItemsItemItemRight(stage, item, itemc);
    this.intersectItemsItemItemFront(stage, item, itemc);
    this.intersectItemsItemItemBack(stage, item, itemc);
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
//    if (itemc.x <= item.x) {
//        if (itemc.x + itemc.width >= item.x) {
//            
//            if (itemc.y + itemc.height <= item.y) return;
//            if (itemc.y >= item.y + item.height) return;
//            if (itemc.z + itemc.depth <= item.z) return;
//            if (itemc.z >= item.z + item.depth) return;
//
//            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
//                // partial coverage on y axis
//                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) <= 0)) {
//                    // partial coverage on z axis
//                    console.log(item.id + " === " + itemc.id + " == Left");
//                }
//            }
//        }
//    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemRight = function(stage, item, itemc) {
//    if (itemc.x <= item.x + item.width) {
//        if (itemc.x + itemc.width >= item.x + item.width) {
//            
//            if (itemc.y + itemc.height <= item.y) return;
//            if (itemc.y >= item.y + item.height) return;
//            if (itemc.z + itemc.depth <= item.z) return;
//            if (itemc.z >= item.z + item.depth) return;
//
//            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
//                // partial coverage on y axis
//                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) <= 0)) {
//                    // partial coverage on z axis
//                    console.log(item.id + " === " + itemc.id + " == Right");
//                }
//            }
//        }
//    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemFront = function(stage, item, itemc) {
    if (itemc.z <= item.z) {
        if (itemc.z + itemc.depth >= item.z) {
            
            if (itemc.y + itemc.height <= item.y) return;
            if (itemc.y >= item.y + item.height) return;
            if (itemc.x + itemc.width <= item.x) return;
            if (itemc.x >= item.x + item.width) return;

            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) <= 0)) {
                // partial coverage on x axis
                if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                    // partial coverage on y axis
                    
                    var newitem = new Item(cloneObject(item.json));
                    newitem.depth = item.depth;
                    
                    if (item.x + item.width > itemc.x + itemc.width) {
                        // clip right
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
                        console.log(item.id + " === " + itemc.id + " == Front - Right");
                        newitem.initialize();
                        stage.items.push(newitem);
                    } else if (item.x < itemc.x) {
                        // clip left
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
                        console.log(item.id + " === " + itemc.id + " == Front - Left");
                        newitem.initialize();
                        stage.items.push(newitem);
                    } else if (item.y + item.height > itemc.y + itemc.height) {
                        // clip bottom
                        var dh = (item.y + item.height) - (itemc.y + itemc.height);
                        item.y = itemc.y + itemc.height;
                        var t = item.parts.length;
                        for (var i = 0; i < t; i++) {
                            var p = item.parts[i];
                            var ph = p.height;
                            if (ph > dh) p.height = dh;
                        }

                        console.log(item.id + " === " + itemc.id + " == Front - Bottom");
                    
                    } else if (item.y < itemc.y) {
                        // clip top
                        var dh = itemc.y - item.y;
                        var t = item.parts.length;
                        for (var i = 0; i < t; i++) {
                            var p = item.parts[i];
                            var ph = p.height;
                            if (ph > dh) p.height = dh;
                        }

                        console.log(item.id + " === " + itemc.id + " == Front - Top");
                    
                    }
                    item.initialize();
                }
            }
        }
    }
}

StageBuilderIntersect.prototype.intersectItemsItemItemBack = function(stage, item, itemc) {
//    if (itemc.z <= item.z + item.depth) {
//        if (itemc.z + itemc.depth >= item.z + item.depth) {
//            
//            if (itemc.y + itemc.height <= item.y) return;
//            if (itemc.y >= item.y + item.height) return;
//            if (itemc.x + itemc.width <= item.x) return;
//            if (itemc.x >= item.x + item.width) return;
//
//            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) <= 0)) {
//                // partial coverage on x axis
//                if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
//                    // partial coverage on y axis
//                    console.log(item.id + " === " + itemc.id + " == Back");
//                }
//            }
//        }
//    }
}