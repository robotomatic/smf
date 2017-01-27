"use strict";

function ItemRenderManager(theme) {
    this.theme = theme;
    this.renderer = new ItemRenderManagerRenderer();
    this.itemrenderer = new ItemRenderer();
}

ItemRenderManager.prototype.drawItem = function(ctx, color, item, window, x, y, width, height, scale, drawdetails) {
    if (item.draw == false) return;
    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) return;
    if (!scale) scale = 1;
    if (!this.theme) {
        var c = color ? color : "blue";
        this.renderer.drawItemDefault(ctx, c, item, x, y, width, height);
        return; 
    }
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) {
        var c = color ? color : item.color ? item.color : "purple";
        this.renderer.drawItemDefault(ctx, c, item, x, y, width, height);
        return; 
    }
    if (titem.draw === false) return;
    titem.angle = (item.angle) ? item.angle : 0;
    titem.ramp = (item.ramp) ? item.ramp : "";
    if (titem.renderer) {
        if (this.itemrenderer.render(ctx, color, titem.renderer, item, window, x, y, width, height, titem, scale, drawdetails)) {
            return;
        }
    }
    this.renderer.drawItemTheme(ctx, color, item, x, y, width, height, scale, titem);
}