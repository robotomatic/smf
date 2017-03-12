"use strict";

function StageBuilderHSR() {
    this.foo = false;
    this.bar = false;
}

StageBuilderHSR.prototype.removeHiddenSurfaces = function(stage) { 
    this.foo = false;
    for (var i = 0; i < stage.items.length; i++) {
        var item = stage.items[i];
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        
        if (item.x == 2100 && item.z == 2000) {
//        if (item.x == 2100 && item.y == 900 && item.z == 2000) {
//            console.log("foo: " + item.y + " // " + item.height);
            this.foo = true;
        } else this.foo = false;
        
        this.removeItemItemsHiddenSurfaces(item, stage.items);
    }
}

StageBuilderHSR.prototype.removeItemItemsHiddenSurfaces = function(item, items) { 
    this.bar = false;
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc.draw === false) continue;
        if (itemc == item) continue;
        if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") continue;

        if (this.foo && itemc.z == 2000 && itemc.x == 1500) {
            this.bar = true;
        } else this.bar = false;

        this.removeItemsItemItemHiddenSurfaces(item, itemc);
    }
}

StageBuilderHSR.prototype.removeItemsItemItemHiddenSurfaces = function(item, itemc) { 
    if (itemc.y + itemc.height < item.y) return;
    if (itemc.y > item.y + item.height) return;
    if (itemc.z + itemc.depth < item.z) return;
    if (itemc.z > item.z + item.depth) return;
    if (itemc.x + itemc.width < item.x) return;
    if (itemc.x > item.x + item.width) return;
    this.removeItemsItemHiddenSurfacesLeft(item, itemc);
    this.removeItemsItemHiddenSurfacesRight(item, itemc);
    this.removeItemsItemHiddenSurfacesFront(item, itemc);
    this.removeItemsItemHiddenSurfacesBack(item, itemc);
    this.removeItemsItemHiddenSurfacesTop(item, itemc);
    this.removeItemsItemHiddenSurfacesBottom(item, itemc);
}





StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesLeft = function(item, itemc) {
    
    if (!item.geometry.visible.left.visible) return;
    
    if (itemc.x + itemc.width < item.x) return;
    if (itemc.x > item.x) return;
    
    if (item.geometry.visible.left.coverage.height > 0) {
        if (itemc.y + itemc.height <= item.geometry.visible.left.coverage.y) return;
        if (itemc.y >= item.geometry.visible.left.coverage.y + item.geometry.visible.left.coverage.height) return;
    }
    
    if (item.geometry.visible.left.coverage.depth > 0) {
        if (itemc.z + itemc.depth <= item.geometry.visible.left.coverage.z) return;
        if (itemc.z >= item.geometry.visible.left.coverage.z + item.geometry.visible.left.coverage.depth) return;
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
    
    if (item.geometry.visible.left.coverage.height > 0 || item.geometry.visible.left.coverage.depth > 0) return;
    item.geometry.visible.left.visible = false;
}








StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesRight = function(item, itemc) {

    if (!item.geometry.visible.right.visible) return;
    
    if (itemc.x + itemc.width < item.x + item.width) return;
    if (itemc.x > item.x + item.width) return;
    
    if (item.geometry.visible.right.coverage.height > 0) {
        if (itemc.y + itemc.height <= item.geometry.visible.right.coverage.y) return;
        if (itemc.y >= item.geometry.visible.right.coverage.y + item.geometry.visible.right.coverage.height) return;
    }
    
    if (item.geometry.visible.right.coverage.depth > 0) {
        if (itemc.z + itemc.depth <= item.geometry.visible.right.coverage.z) return;
        if (itemc.z >= item.geometry.visible.right.coverage.z + item.geometry.visible.right.coverage.depth) return;
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
    
    if (item.geometry.visible.right.coverage.height > 0 || item.geometry.visible.right.coverage.depth > 0) return;
    item.geometry.visible.right.visible = false;
}






StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesFront = function(item, itemc) {
    
    if (!item.geometry.visible.front.visible) return;
    
    if (itemc.z + itemc.depth < item.z) return;
    if (itemc.z + itemc.depth > item.z + item.depth) return;

    if (item.geometry.visible.front.coverage.width > 0) {
        if (itemc.x + itemc.width <= item.geometry.visible.front.coverage.x) return;
        if (itemc.x >= item.geometry.visible.front.coverage.x + item.geometry.visible.front.coverage.width) return;
    }

    if (item.geometry.visible.front.coverage.height > 0) {
        if (itemc.y + itemc.height <= item.geometry.visible.front.coverage.y) return;
        if (itemc.y >= item.geometry.visible.front.coverage.y + item.geometry.visible.front.coverage.height) return;
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
    
    if (item.geometry.visible.front.coverage.width > 0 || item.geometry.visible.front.coverage.height> 0) return;
    item.geometry.visible.front.visible = false;
}

StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesBack = function(item, itemc) {
    
    if (!item.geometry.visible.back.visible) return;
    
    if (itemc.z + itemc.depth < item.z + item.depth) return;
    if (itemc.z > item.z + item.depth) return;
    
    if (itemc.x + itemc.width <= item.geometry.visible.back.coverage.x) return;
    if (itemc.x >= item.geometry.visible.back.coverage.x + item.geometry.visible.back.coverage.width) return;
    if (itemc.y + itemc.height <= item.geometry.visible.back.coverage.y) return;
    if (itemc.y >= item.geometry.visible.back.coverage.y + item.geometry.visible.back.coverage.height) return;

    if (itemc.x <= item.geometry.visible.back.coverage.x && itemc.width >= item.geometry.visible.back.coverage.width) {
            item.geometry.visible.back.coverage.width = 0;
    }
    
    if (itemc.y <= item.geometry.visible.back.coverage.y && itemc.height >= item.geometry.visible.back.coverage.height) {
        item.geometry.visible.back.coverage.height = 0;
    }
    
    if (item.geometry.visible.back.coverage.width > 0 || item.geometry.visible.back.coverage.height> 0) return;
    item.geometry.visible.back.visible = false;
}



StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesTop = function(item, itemc) {

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
            item.geometry.visible.top.visible = false;
        }
    }
}

StageBuilderHSR.prototype.removeItemsItemHiddenSurfacesBottom = function(item, itemc) {
    

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
            item.geometry.visible.bottom.visible = false;
        }
    }
}
