"use strict";

function ItemRenderer() {
    
    this.renderers = {
        "tile" : new ItemRendererTiles(),
        "stars" : new ItemRendererStars(),
        "clouds" : new ItemRendererClouds(),
        "fog" : new ItemRendererClouds(),
        "scaffold" : new ItemRendererScaffold(),
        "wood" : new ItemRendererWood(),
        "grass" : new ItemRendererGrass(),
        "rock" : new ItemRendererRock(),
        "wave" : new ItemRendererWaves(),
        "flag" : new ItemRendererFlag(),
        "tree" : new ItemRendererTree(),
        "ground" : new ItemRendererGround(),
        "ground-bg" : new ItemRendererGround(),
        "metal" : new ItemRendererMetal(),
        "metal-bg" : new ItemRendererMetal(),
        "plastic" : new ItemRendererPlastic(),
        "plastic-bg" : new ItemRendererPlastic()
    }
}

ItemRenderer.prototype.render = function(ctx, color, renderer, item, x, y, width, height, titem, scale, drawdetails) {
    var r = this.renderers[renderer];
    if (r) {
        r.draw(ctx, color, item, x, y, width, height, titem, scale, drawdetails);
        return true;
    }
    return false;
}
