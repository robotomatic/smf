"use strict";

function ItemRenderManager(theme) {
    this.theme = theme;
    this.renderer = new ItemRenderManagerRenderer();
}

ItemRenderManager.prototype.drawItem = function(ctx, color, item, window, ox, oy, box, scale, drawdetails) {
    if (item.draw == false) return;

    var x = box.x;
    var y = box.y;
    var width = box.width;
    var height = box.height;
    
    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        console.log("ItemRenderManager: null value!!");
        return;
    }
    if (!this.theme) {
        console.log("ItemRenderManager: null theme!!");
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
    if (!scale) scale = 1;
    this.renderer.drawItemTheme(ctx, color, item, window, x, y, width, height, titem, scale, drawdetails, ox, oy);
}