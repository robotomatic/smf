"use strict";

function Item3D() {

    // todo: blurrrr
    // todo: handle floating of rocks and players and things
    // todo: handle roundness and craziness
        // -> craziness is part of renderer?
    // todo: glom polys together, filter inner points & draw crazy round 
    // todo: intersect with liquid(!)

    this.rect3d = new Item3DRectangle();
    this.poly3d = new Item3DPolygon();
}

Item3D.prototype.renderItem3D = function(now, ctx, item, renderer, window, x, y, width, height, scale, quality) {
    if (item.draw == false) return;
    var depth = item.depth * scale;
    if (item.parts) this.poly3d.renderItem3D(now, ctx, item, renderer, window, x, y, width, height, depth, scale);
    else this.rect3d.renderItem3D(now, ctx, item, renderer, window, x, y, width, height, depth, scale);
}