"use strict";

function StageHSR() {
    this.ready = false;
}

StageHSR.prototype.removeItemsHiddenSurfaces = function(items) { 
    for (var i = 0; i < items.length; i++) {
        this.removeItemsItemHiddenSurfaces(items[i], items);
    }
}

StageHSR.prototype.removeItemsItemHiddenSurfaces = function(item, items) { 
    if (item.width == "100%" || item.height == "100%" || item.depth == "100%") return;
    for (var i = 0; i < items.length; i++) {
        var itemc = items[i];
        if (itemc == item) continue;
        this.removeItemsItemItemHiddenSurfaces(item, itemc);
    }
}

StageHSR.prototype.removeItemsItemItemHiddenSurfaces = function(item, itemc) { 

    if (itemc.width == "100%" || itemc.height == "100%" || itemc.depth == "100%") return;
    
    if (itemc.y + itemc.height < item.y) return;
    if (itemc.y > item.y + item.height) return;
    if (itemc.z + itemc.depth < item.z) return;
    if (itemc.z > item.z + item.depth) return;
    if (itemc.x + itemc.width < item.x) return;
    if (itemc.x > item.x + item.width) return;
    
    
    this.removeItemsItemHiddenSurfacesTop(item, itemc);
    this.removeItemsItemHiddenSurfacesBottom(item, itemc);
    this.removeItemsItemHiddenSurfacesLeft(item, itemc);
    this.removeItemsItemHiddenSurfacesRight(item, itemc);
    this.removeItemsItemHiddenSurfacesFront(item, itemc);
    this.removeItemsItemHiddenSurfacesBack(item, itemc);
}

StageHSR.prototype.removeItemsItemHiddenSurfacesTop = function(item, itemc) {
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

StageHSR.prototype.removeItemsItemHiddenSurfacesBottom = function(item, itemc) {
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

StageHSR.prototype.removeItemsItemHiddenSurfacesLeft = function(item, itemc) {
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

StageHSR.prototype.removeItemsItemHiddenSurfacesRight = function(item, itemc) {
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

StageHSR.prototype.removeItemsItemHiddenSurfacesFront = function(item, itemc) {
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

StageHSR.prototype.removeItemsItemHiddenSurfacesBack = function(item, itemc) {
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