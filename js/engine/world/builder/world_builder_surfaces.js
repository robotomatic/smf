"use strict";

function WorldBuilderSurfaces() {
}

WorldBuilderSurfaces.prototype.reset = function() { 
}

WorldBuilderSurfaces.prototype.buildSurfaces = function(world) {
    //
    // TODO: Need to rebuild contiguous geometries!!!!
    //
    return world.items;
}

