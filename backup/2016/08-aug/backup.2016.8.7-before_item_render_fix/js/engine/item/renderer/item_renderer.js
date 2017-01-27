"use strict";

function ItemRenderer() {
    this.renderers = {
        "stars" : new ItemRendererStars(),
        "clouds" : new ItemRendererClouds(),
        "fog" : new ItemRendererClouds(),
        "wave" : new ItemRendererWaves(),
        "flag" : new ItemRendererFlag()
//        "tree" : new ItemRendererTree(),
//        "grass" : new ItemRendererGrass(),
    }
}

ItemRenderer.prototype.render = function(ctx, color, renderer, item, window, x, y, width, height, titem, scale) {
    var r = this.renderers[renderer.name];
    if (!r) return false;
    r.draw(ctx, color, item, window, x, y, width, height, titem, scale);
    return true;
}
