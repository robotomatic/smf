"use strict";

function Item3D() {
    this.rect3d = new Item3DRectangle();
    this.poly3d = new Item3DPolygon();
}

Item3D.prototype.renderItem3D = function(now, ctx, item, renderer, window, x, y, scale, floodlevel) {
    if (!renderer.shouldThemeProject(item)) return;
    if (item.draw == false) return;
    var depth = item.depth * scale;
    if (item.parts) this.poly3d.renderItem3D(now, ctx, item, renderer, window, x, y, depth, scale, floodlevel);
    else this.rect3d.renderItem3D(now, ctx, item, renderer, window, x, y, depth, scale, floodlevel);
}