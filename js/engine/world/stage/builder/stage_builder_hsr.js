"use strict";

function StageBuilderHSR() {
}

StageBuilderHSR.prototype.removeHiddenSurfaces = function(items) { 
    items.sort(sortByY);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        item = this.removeItemItemsHiddenSurfaces(item, items);
    }
    return items;
}

StageBuilderHSR.prototype.removeItemItemsHiddenSurfaces = function(item, items) { 
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") continue;
        item = this.removeItemsItemItemHiddenSurfaces(item, itemc);
    }
    return item;
}

StageBuilderHSR.prototype.removeItemsItemItemHiddenSurfaces = function(item, itemc) { 
    if (itemc.y + itemc.height < item.y) return item;
    if (itemc.y > item.y + item.height) return item;
    if (itemc.z + itemc.depth < item.z) return item;
    if (itemc.z > item.z + item.depth) return item;
    if (itemc.x + itemc.width < item.x) return item;
    if (itemc.x > item.x + item.width) return item;
    item = this.removeItemsItemHiddenSurfacesLeft(item, itemc);
    item = this.removeItemsItemHiddenSurfacesRight(item, itemc);
    item = this.removeItemsItemHiddenSurfacesFront(item, itemc);
    item = this.removeItemsItemHiddenSurfacesBack(item, itemc);
    item = this.removeItemsItemHiddenSurfacesTop(item, itemc);
    item = this.removeItemsItemHiddenSurfacesBottom(item, itemc);
    return item;
}





StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesLeft = function(item, itemc) {
    
    if (!item.geometry.visible.left.visible) return item;
    
    if (itemc.x + itemc.width < item.x) return item;
    if (itemc.x > item.x) return item;
    
    if (item.geometry.visible.left.coverage.height > 0) {
        if (itemc.y + itemc.height <= item.geometry.visible.left.coverage.y) return item;
        if (itemc.y >= item.geometry.visible.left.coverage.y + item.geometry.visible.left.coverage.height) return item;
    }
    
    if (item.geometry.visible.left.coverage.depth > 0) {
        if (itemc.z + itemc.depth <= item.geometry.visible.left.coverage.z) return item;
        if (itemc.z >= item.geometry.visible.left.coverage.z + item.geometry.visible.left.coverage.depth) return item;
    }
    
    if (itemc.y <= item.geometry.visible.left.coverage.y && itemc.height >= item.geometry.visible.left.coverage.height) {
        item.geometry.visible.left.coverage.height = 0;
    } else {
        if (itemc.y < item.geometry.visible.left.coverage.y) {
            var dy = itemc.y + itemc.height - item.geometry.visible.left.coverage.y + item.geometry.visible.left.coverage.height;
            item.geometry.visible.left.coverage.y = itemc.y + itemc.height - dy;
            item.geometry.visible.left.coverage.height = dy;
        } else {
            var dy = (item.geometry.visible.left.coverage.y + item.geometry.visible.left.coverage.height) - itemc.y;
            item.geometry.visible.left.coverage.y = itemc.y;
            item.geometry.visible.left.coverage.height -= dy;
        }
    }

    if (itemc.z <= item.geometry.visible.left.coverage.z && itemc.depth >= item.geometry.visible.left.coverage.depth) {
            item.geometry.visible.left.coverage.depth = 0;
    } else {
        if (itemc.z < item.geometry.visible.left.coverage.z) {
            var dz = itemc.z + itemc.depth - item.geometry.visible.left.coverage.z + item.geometry.visible.left.coverage.depth;
            item.geometry.visible.left.coverage.z = itemc.z + itemc.depth - dz;
            item.geometry.visible.left.coverage.depth = dz;
        } else {
            var dz = itemc.z - item.geometry.visible.right.coverage.z;
            item.geometry.visible.left.coverage.depth -= dz;
        }
    }
    
    if (item.geometry.visible.left.coverage.height > 0 || item.geometry.visible.left.coverage.depth > 0) return item;
    item.geometry.visible.left.visible = false;
    return item;
}








StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesRight = function(item, itemc) {

    if (!item.geometry.visible.right.visible) return item;
    
    if (itemc.x + itemc.width < item.x + item.width) return item;
    if (itemc.x > item.x + item.width) return item;
    
    if (item.geometry.visible.right.coverage.height > 0) {
        if (itemc.y + itemc.height <= item.geometry.visible.right.coverage.y) return item;
        if (itemc.y >= item.geometry.visible.right.coverage.y + item.geometry.visible.right.coverage.height) return item;
    }
    
    if (item.geometry.visible.right.coverage.depth > 0) {
        if (itemc.z + itemc.depth <= item.geometry.visible.right.coverage.z) return item;
        if (itemc.z >= item.geometry.visible.right.coverage.z + item.geometry.visible.right.coverage.depth) return item;
    }
    
    if (itemc.y <= item.geometry.visible.right.coverage.y && itemc.height >= item.geometry.visible.right.coverage.height) {
        item.geometry.visible.right.coverage.height = 0;
    } else {
        if (itemc.y < item.geometry.visible.right.coverage.y) {
            var dy = itemc.y + itemc.height - item.geometry.visible.right.coverage.y + item.geometry.visible.right.coverage.height;
            item.geometry.visible.right.coverage.y = itemc.y + itemc.height - dy;
            item.geometry.visible.right.coverage.height = dy;
        } else {
            var dy = (item.geometry.visible.right.coverage.y + item.geometry.visible.right.coverage.height) - itemc.y;
            item.geometry.visible.right.coverage.y = itemc.y;
            item.geometry.visible.right.coverage.height -= dy;
        }
    }
        
    if (itemc.z <= item.geometry.visible.right.coverage.z && itemc.depth >= item.geometry.visible.right.coverage.depth) {
            item.geometry.visible.right.coverage.depth = 0;
    } else {
        if (itemc.z < item.geometry.visible.right.coverage.z) {
            var dz = itemc.z + itemc.depth - item.geometry.visible.right.coverage.z + item.geometry.visible.right.coverage.depth;
            item.geometry.visible.right.coverage.z = itemc.z + itemc.depth - dz;
            item.geometry.visible.right.coverage.depth = dz;
        } else {
            var dz = itemc.z - item.geometry.visible.right.coverage.z;
            item.geometry.visible.right.coverage.depth -= dz;
        }
    }
    
    if (item.geometry.visible.right.coverage.height > 0 || item.geometry.visible.right.coverage.depth > 0) return item;
    item.geometry.visible.right.visible = false;
    return item;
}






StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesFront = function(item, itemc) {
    
    if (!item.geometry.visible.front.visible) return item;
    
    if (itemc.z + itemc.depth < item.z) return item;
    if (itemc.z + itemc.depth > item.z + item.depth) return item;

    if (item.geometry.visible.front.coverage.width > 0) {
        if (itemc.x + itemc.width <= item.geometry.visible.front.coverage.x) return item;
        if (itemc.x >= item.geometry.visible.front.coverage.x + item.geometry.visible.front.coverage.width) return item;
    }

    if (item.geometry.visible.front.coverage.height > 0) {
        if (itemc.y + itemc.height <= item.geometry.visible.front.coverage.y) return item;
        if (itemc.y >= item.geometry.visible.front.coverage.y + item.geometry.visible.front.coverage.height) return item;
    }
    
    if (itemc.x <= item.geometry.visible.front.coverage.x && itemc.width >= item.geometry.visible.front.coverage.width) {
            item.geometry.visible.front.coverage.width = 0;
    } else {
        var dx = (itemc.x + itemc.width) - (item.geometry.visible.front.coverage.x + item.geometry.visible.front.coverage.width);
        if (itemc.x < item.geometry.visible.front.coverage.x) {
            item.geometry.visible.front.coverage.x = itemc.x + itemc.width - dx;
            item.geometry.visible.front.coverage.width = dx;
        } else {
            item.geometry.visible.front.coverage.width -= dx;
        }
    }
    
    if (itemc.y <= item.geometry.visible.front.coverage.y && itemc.height >= item.geometry.visible.front.coverage.height) {
        item.geometry.visible.front.coverage.height = 0;
    } else {
        if (itemc.y == item.geometry.visible.front.coverage.y) {
            item.geometry.visible.front.coverage.y += itemc.height;
            item.geometry.visible.front.coverage.height -= itemc.height;    
        } else if (itemc.y < item.geometry.visible.front.coverage.y) {
            var dy = itemc.y - item.geometry.visible.front.coverage.y;
            var dh = item.geometry.visible.front.coverage.height - itemc.height - dy;
            item.geometry.visible.front.coverage.y += (item.geometry.visible.front.coverage.height+ dh);
            item.geometry.visible.front.coverage.height = dh;
        } else {
            var dy = (item.geometry.visible.front.coverage.y + item.geometry.visible.front.coverage.height) - itemc.y;
            item.geometry.visible.front.coverage.y = itemc.y;
            item.geometry.visible.front.coverage.height -= dy;
        }
    }
    
    if (item.geometry.visible.front.coverage.width > 0 || item.geometry.visible.front.coverage.height> 0) return item;
    item.geometry.visible.front.visible = false;
    return item;
}

StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesBack = function(item, itemc) {
    
    if (!item.geometry.visible.back.visible) return item;
    
    if (itemc.z + itemc.depth < item.z + item.depth) return item;
    if (itemc.z > item.z + item.depth) return item;
    
    if (itemc.x + itemc.width <= item.geometry.visible.back.coverage.x) return item;
    if (itemc.x >= item.geometry.visible.back.coverage.x + item.geometry.visible.back.coverage.width) return item;
    if (itemc.y + itemc.height <= item.geometry.visible.back.coverage.y) return item;
    if (itemc.y >= item.geometry.visible.back.coverage.y + item.geometry.visible.back.coverage.height) return item;

    if (itemc.x <= item.geometry.visible.back.coverage.x && itemc.width >= item.geometry.visible.back.coverage.width) {
            item.geometry.visible.back.coverage.width = 0;
    }
    
    if (itemc.y <= item.geometry.visible.back.coverage.y && itemc.height >= item.geometry.visible.back.coverage.height) {
        item.geometry.visible.back.coverage.height = 0;
    }
    
    if (item.geometry.visible.back.coverage.width > 0 || item.geometry.visible.back.coverage.height> 0) return item;
    item.geometry.visible.back.visible = false;
    return item;
}



StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesTop = function(item, itemc) {
    if (itemc.y <= item.y) {
        if (itemc.y + itemc.height >= item.y) {
            if (itemc.z + itemc.depth <= item.z) return item;
            if (itemc.z >= item.z + item.depth) return item;
            if (itemc.x + itemc.width <= item.x) return item;
            if (itemc.x >= item.x + item.width) return item;
            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
                // partial coverage on x axis
                return item;
            }
            if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
                // partial coverage on z axis
                return item;
            }
            item.geometry.visible.top.visible = false;
        }
    }
    return item;
}

StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesBottom = function(item, itemc) {
    if (itemc.y <= item.y + item.height) {
        if (itemc.y + itemc.height >= item.y + item.height) {
            if (itemc.z + itemc.depth <= item.z) return item;
            if (itemc.z >= item.z + item.depth) return item;
            if (itemc.x + itemc.width <= item.x) return item;
            if (itemc.x >= item.x + item.width) return item;
            if ((itemc.x > item.x && itemc.width < item.width) || ((itemc.x + itemc.width) - (item.x + item.width) < 0)) {
                // partial coverage on x axis
                return item;
            }
            if ((itemc.z > item.z && itemc.depth < item.depth) || ((itemc.z + itemc.depth) - (item.z + item.depth) < 0)) {
                // partial coverage on z axis
                return item;
            }
            item.geometry.visible.bottom.visible = false;
        }
    }
    return item;
}
