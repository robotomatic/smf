"use strict";

function ItemRenderer() {
    
    this.renderers = {
        "tile"      : new ItemRendererTiles(),
        "clouds"    : new ItemRendererClouds(),
        "fog"       : new ItemRendererClouds(),
        "wave"      : new ItemRendererWaves(),
        "flag"      : new ItemRendererFlag(),
        "scaffold"  : new ItemRendererScaffold(),
        "wood"      : new ItemRendererWood(),
        "ground"    : new ItemRendererGround(),
        "ground-bg" : new ItemRendererGround(),
        "grass"     : new ItemRendererGrass(),
        "rock"      : new ItemRendererRock(),
        "tree"      : new ItemRendererTree(),
        "metal"     : new ItemRendererMetal(),
        "stars"     : new ItemRendererStars()
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
