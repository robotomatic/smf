"use strict";

function WorldBuilderIntersect() {
}

WorldBuilderIntersect.prototype.intersectItems = function(world) { 
    var items = world.items;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        var newitems = this.intersectItemItems(item, items);
        if (newitems) {
            items = items.concat(newitems);
        }
    }
    world.items = items;
}

WorldBuilderIntersect.prototype.intersectItemItems = function(item, items) { 
    var newitems = new Array();
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        newitems = this.intersectItemItem(item, itemc, newitems, "intersectItemItemLeftRight");
    }
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        newitems = this.intersectItemItem(item, itemc, newitems, "intersectItemItemFrontBack");
    }
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        newitems = this.intersectItemItem(item, itemc, newitems, "intersectItemItemTopBottom");
    }
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItem = function(item, itemc, newitems, f) { 
    if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") return newitems;
    if (itemc.y + itemc.height < item.y) return newitems;
    if (itemc.y > item.y + item.height) return newitems;
    if (itemc.z + itemc.depth < item.z) return newitems;
    if (itemc.z > item.z + item.depth) return newitems;
    if (itemc.x + itemc.width < item.x) return newitems;
    if (itemc.x > item.x + item.width) return newitems;
    newitems = this[f](item, itemc, newitems);
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItemLeftRight = function(item, itemc, newitems) { 
    this.intersectItemsItemItemRight(item, itemc, newitems);
    this.intersectItemsItemItemLeft(item, itemc, newitems);
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItemFrontBack = function(item, itemc, newitems) { 
    this.intersectItemsItemItemFront(item, itemc, newitems);
    this.intersectItemsItemItemBack(item, itemc, newitems);
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemItemTopBottom = function(item, itemc, newitems) { 
// todo!        
//    this.intersectItemsItemItemTop(item, itemc, newitems);
//    this.intersectItemsItemItemBottom(item, itemc, newitems);
    return newitems;
}


WorldBuilderIntersect.prototype.intersectItemsItemItemTop = function(item, itemc, newitems) {
//    if (itemc.y <= item.y) {
//        if (itemc.y + itemc.height >= item.y) {
//            
//            if (itemc.z + itemc.depth <= item.z) return newitems;
//            if (itemc.z >= item.z + item.depth) return newitems;
//            if (itemc.x + itemc.width <= item.x) return newitems;
//            if (itemc.x >= item.x + item.width) return newitems;
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
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemsItemItemBottom = function(item, itemc, newitems) {
//    if (itemc.y <= item.y + item.height) {
//        if (itemc.y + itemc.height >= item.y + item.height) {
//            
//            if (itemc.z + itemc.depth <= item.z) return newitems;
//            if (itemc.z >= item.z + item.depth) return newitems;
//            if (itemc.x + itemc.width <= item.x) return newitems;
//            if (itemc.x >= item.x + item.width) return newitems;
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
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemsItemItemLeft = function(item, itemc, newitems) {
    if (itemc.x <= item.x) {
        if (itemc.x + itemc.width >= item.x) {
            if (itemc.y + itemc.height <= item.y) return newitems;
            if (itemc.y >= item.y + item.height) return newitems;
            if (itemc.z + itemc.depth <= item.z) return newitems;
            if (itemc.z >= item.z + item.depth) return newitems;
            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) <= 0)) {
                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) <= 0)) {
                    var clip = "left";
                    
                    // todo: front / back
                    
                    if (item.y + item.height > itemc.y + itemc.height) {
                        newitems = this.intersectClip(this.intersectClipBottom, item, itemc, newitems, clip, "bottom");
                        return newitems;
                    }
                    if (item.y < itemc.y) {
                        newitems = this.intersectClip(this.intersectClipTop, item, itemc, newitems, clip, "top");
                        return newitems;
                    }
                }
            }
        }
    }
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemsItemItemRight = function(item, itemc, newitems) {
    if (itemc.x <= item.x + item.width) {
        if (itemc.x + itemc.width >= item.x + item.width) {
            if (itemc.y + itemc.height <= item.y) return newitems;
            if (itemc.y >= item.y + item.height) return newitems;
            if (itemc.z + itemc.depth <= item.z) return newitems;
            if (itemc.z >= item.z + item.depth) return newitems;
            if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) <= 0)) {
                if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) <= 0)) {
                    var clip = "right";
                    
                    // todo: front / back
                    
                    if (item.y < itemc.y) {
                        newitems = this.intersectClip(this.intersectClipTop, item, itemc, newitems, clip, "top");
                        return newitems;
                    }
                    if (item.y + item.height > itemc.y + itemc.height) {
                        newitems = this.intersectClip(this.intersectClipBottom, item, itemc, newitems, clip, "bottom");
                        return newitems;
                    }
                }
            }
        }
    }
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemsItemItemFront = function(item, itemc, newitems) {
    if (itemc.z <= item.z) {
        if (itemc.z + itemc.depth >= item.z) {
            if (itemc.y + itemc.height <= item.y) return newitems;
            if (itemc.y >= item.y + item.height) return newitems;
            if (itemc.x + itemc.width <= item.x) return newitems;
            if (itemc.x >= item.x + item.width) return newitems;
            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) <= 0)) {
                if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                    var clip = "front";
                    if (item.x + item.width > itemc.x + itemc.width) {
                        newitems = this.intersectClip(this.intersectClipRight, item, itemc, newitems, clip, "right");
                        return newitems;
                    }
                    if (item.x < itemc.x) {
                        newitems = this.intersectClip(this.intersectClipLeft, item, itemc, newitems, clip, "left");
                        return newitems;
                    }
                    if (item.y < itemc.y) {
                        newitems = this.intersectClip(this.intersectClipTop, item, itemc, newitems, clip, "top");
                        return newitems;
                    }
                    if (item.y + item.height > itemc.y + itemc.height) {
                        newitems = this.intersectClip(this.intersectClipBottom, item, itemc, newitems, clip, "bottom");
                        return newitems;
                    }
                }
            }
        }
    }
    return newitems;
}

WorldBuilderIntersect.prototype.intersectItemsItemItemBack = function(item, itemc, newitems) {
    if (itemc.z <= item.z + item.depth) {
        if (itemc.z + itemc.depth >= item.z + item.depth) {
            if (itemc.y + itemc.height <= item.y) return newitems;
            if (itemc.y >= item.y + item.height) return newitems;
            if (itemc.x + itemc.width <= item.x) return newitems;
            if (itemc.x >= item.x + item.width) return newitems;
            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) <= 0)) {
                if ((itemc.y > item.y && itemc.height < item.height) || ((itemc.y + itemc.height) - (item.y + item.height) < 0)) {
                    var clip = "back";
                    if (item.x + item.width > itemc.x + itemc.width) {
                        newitems = this.intersectClip(this.intersectClipRight, item, itemc, newitems, clip, "right");
                        return newitems;
                    }
                    if (item.x < itemc.x) {
                        newitems = this.intersectClip(this.intersectClipLeft, item, itemc, newitems, clip, "left");
                        return newitems;
                    }
                    if (item.y < itemc.y) {
                        newitems = this.intersectClip(this.intersectClipTop, item, itemc, newitems, clip, "top");
                        return newitems;
                    }
                    if (item.y + item.height > itemc.y + itemc.height) {
                        newitems = this.intersectClip(this.intersectClipBottom, item, itemc, newitems, clip, "bottom");
                        return newitems;
                    }
                }
            }
        }
    }
    return newitems;
}









WorldBuilderIntersect.prototype.intersectClip = function(f, item, itemc, newitems, clip, dir) {
    var newitem = item.clone();
    if (!newitem ) return newitems;
    f(item, itemc, newitem);
    item.initialize();
    newitem.initialize();
    newitems.push(newitem);
//    console.log(item.id + " === " + itemc.id + " ==> " + clip + " - " + dir);
    return newitems;
}









WorldBuilderIntersect.prototype.intersectClipRight = function(item, itemc, newitem) {
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

WorldBuilderIntersect.prototype.intersectClipLeft = function(item, itemc, newitem) {
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

WorldBuilderIntersect.prototype.intersectClipTop = function(item, itemc, newitem) {
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

WorldBuilderIntersect.prototype.intersectClipBottom = function(item, itemc, newitem) {
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
