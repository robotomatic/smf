"use strict";

function WorldColliderIndex() {

    this.bounds = {
        min : {
            x : null,
            y : 0,
            z : null
        },
        max : {
            x : null,
            y : null,
            z : null
        }
    };
    
    this.size = {
        width : 0,
        height : 0,
        depth : 0
    }
}

WorldColliderIndex.prototype.reset = function() { 
    this.bounds.min.x = null;
    this.bounds.min.y = null;
    this.bounds.min.z = null;
    this.bounds.max.x = null;
    this.bounds.max.y = null;
    this.bounds.max.z = null;
    this.size.width = 0;
    this.size.height = 0;
    this.size.depth = 0;
}

WorldColliderIndex.prototype.checkBounds = function(c) {
    if (c.width == "100%" || c.height == "100%" || c.depth == "100%") return;
    
    if (this.bounds.min.x == null || c.x < this.bounds.min.x) this.bounds.min.x = c.x;
    if (this.bounds.max.x == null || c.x + c.width > this.bounds.max.x) this.bounds.max.x = c.x + c.width;
    
    if (c.y < this.bounds.min.y) this.bounds.min.y = c.y;
    if (this.bounds.max.y == null || c.y + c.height > this.bounds.max.y) this.bounds.max.y = c.y + c.height;
    
    if (this.bounds.min.z == null || c.z < this.bounds.min.z) this.bounds.min.z = c.z;
    if (this.bounds.max.z == null || c.z + c.depth > this.bounds.max.z) this.bounds.max.z = c.z + c.depth;
}


