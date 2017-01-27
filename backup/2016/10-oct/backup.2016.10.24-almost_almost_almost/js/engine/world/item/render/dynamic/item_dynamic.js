"use strict";

function ItemDynamic() {
    this.renderers = {
        "stars" : new ItemDynamicStars(),
        "clouds" : new ItemDynamicClouds(),
        "fog" : new ItemDynamicClouds(),
//        "wave" : new ItemDynamicWaves(),
        "flag" : new ItemDynamicFlag(),
        "grass" : new ItemDynamicGrass()
//        "tree" : new ItemDynamicTree(),
    }
}

ItemDynamic.prototype.render = function(ctx, color, renderer, item, window, x, y, width, height, titem, scale, name) {
    var r = this.renderers[renderer.name];
    if (!r) return false;
    r.draw(ctx, color, item, window, x, y, width, height, titem, scale, name);
    return true;
}
