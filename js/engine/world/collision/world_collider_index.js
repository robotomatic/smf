"use strict";

function WorldColliderIndex() {

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

WorldColliderIndex.prototype.reset = function() { 
    this.bounds.min.x = 0;
    this.bounds.min.y = 0;
    this.bounds.min.z = 0;
    this.bounds.max.x = 0;
    this.bounds.max.y = 0;
    this.bounds.max.z = 0;
    this.size.width = 0;
    this.size.height = 0;
    this.size.depth = 0;
}

WorldColliderIndex.prototype.checkBounds = function(c) {
    if (c.width == "100%" || c.height == "100%" || c.depth == "100%") return;
    
    if (!this.bounds.min.x || c.x < this.bounds.min.x) this.bounds.min.x = c.x;
    if (!this.bounds.max.x || c.x + c.width > this.bounds.max.x) this.bounds.max.x = c.x + c.width;
    
    if (!this.bounds.min.y || c.y < this.bounds.min.y) this.bounds.min.y = c.y;
    if (!this.bounds.max.y || c.y + c.height > this.bounds.max.y) this.bounds.max.y = c.y + c.height;
    
    if (!this.bounds.min.z || c.z < this.bounds.min.z) this.bounds.min.z = c.z;
    if (!this.bounds.max.z || c.z + c.depth > this.bounds.max.z) this.bounds.max.z = c.z + c.depth;
}


