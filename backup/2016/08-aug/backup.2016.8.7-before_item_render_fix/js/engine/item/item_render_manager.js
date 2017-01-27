"use strict";

function ItemRenderManager(theme) {
    this.theme = theme;
    this.renderer = new ItemRenderManagerRenderer();
}

ItemRenderManager.prototype.shouldThemeProject = function(item, p) {
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) return p;
    if (titem.depth === 0) return false;
    if (titem.depth > 0) return titem.depth;
    return p;
}
    
ItemRenderManager.prototype.drawItem = function(ctx, color, item, window, ox, oy, box, scale) {

    
    /*
    
    
    item can have parts
    
        - parts can have parts
        
        - theme can have parts
        
        - parts can have materials
        
        - parts can have dynamic renderers...?
    
        basically, each part of item passes through same render pipe
        
        - need to make sure grouping is respected
    
    
    
    need to make grouped parts definition in item not theme
    
    
    */
    
    
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
    
    var titem = this.theme.items[item.itemtype];
    if (!titem) {
        var c = color ? color : item.color ? item.color : "green";
        
        
        
        this.renderer.drawItemDefault(ctx, c, item, x, y, width, height);
        return; 
    }

    if (this.renderer.drawItemRenderer(ctx, color, item, window, x, y, width, height, titem, scale)) return;
    
    this.renderer.drawItemTheme(ctx, color, item, window, x, y, width, height, titem, scale);
    
    
}