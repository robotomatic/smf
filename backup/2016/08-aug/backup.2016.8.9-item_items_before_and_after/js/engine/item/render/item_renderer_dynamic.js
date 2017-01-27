"use strict";

function ItemRendererDynamic() {
    this.itemdynamic = new ItemDynamic();
}

ItemRendererDynamic.prototype.render = function(ctx, color, item, window, x, y, width, height, titem, scale) { 
    if (!titem || !titem.renderer) return false;
    return this.itemdynamic.render(ctx, color, titem.renderer, item, window, x, y, width, height, titem, scale);
}