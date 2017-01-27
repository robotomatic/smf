"use strict";

function ItemRendererDynamic() {
    this.itemdynamic = new ItemDynamic();
}

ItemRendererDynamic.prototype.render = function(ctx, color, item, window, x, y, titem, scale) { 
    if (!titem || !titem.renderer) return false;
    
    var box = item.box;
    var width = box.width;
    var height = box.height;
    
    return this.itemdynamic.render(ctx, color, titem.renderer, item, window, x, y, width, height, titem, scale);
}