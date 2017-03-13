"use strict";

function StageColliderIndex() {

    this.bounds = {
        min : {
            x : 0,
            y : 0,
            z : 0
        },
        max : {
            x : 0,
            y : 0,
            z : 0
        }
    };
    
    this.size = {
        width : 0,
        height : 0,
        depth : 0
    }
}

StageColliderIndex.prototype.checkBounds = function(c) {
    if (c.width == "100%" || c.height == "100%" || c.depth == "100%") return;
    if (!this.bounds.minx || c.x < this.bounds.minx) this.bounds.minx = c.x;
    if (!this.bounds.maxx || c.x > this.bounds.maxx) this.bounds.maxx = c.x;
    if (!this.bounds.miny || c.y < this.bounds.miny) this.bounds.miny = c.y;
    if (!this.bounds.maxy || c.y > this.bounds.maxy) this.bounds.maxy = c.y;
    if (!this.bounds.minz || c.z < this.bounds.minz) this.bounds.minz = c.z;
    if (!this.bounds.maxz || c.z > this.bounds.maxz) this.bounds.maxz = c.z;
}


