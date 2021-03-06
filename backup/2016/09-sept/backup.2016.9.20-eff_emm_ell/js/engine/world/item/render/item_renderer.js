"use strict";

/*

    TODO:

    - Fix this ugly fucker!!!
    
    

    - Tops have materials as well
    
    - projection needs to respect craziness and roundness
    
    - Tops need to respect craziness and roundness
    
    
    - Structures..........

    - need graphics class to wrap all canvas calls!!!!!!
    
    - common items
    
    
    
    - strange color change thing WTF
    
    
    - rocks angle
    
    - rocks sometimes double
    
    - add z coordinate option

    - platform shadows on supports....support shdders
    
    - round ends of supports?
    
    - draw through supports (deep depth)

    
    - platforms radius
    
    - platforms craziness
    
    - find a way to clean out memory!!!!!
    
    

    
    
    - after render pass AFTER player render!!!!
    
    - fix shadder mask on platforms
    
    - find a way to render shadders based on zindex
    




    
    - need to consolidate color setter - support animation
    
    - need to consolidate angle
    
    - need to conslidate geomerty creation & iteration
    
    
    

*/



"use strict";

function ItemRenderer(theme) {
    this.theme = theme;
    this.itemrendererdefault = new ItemRendererDefault();
    this.itemrenderertheme = new ItemRendererTheme();
    this.itemrenderertops = new ItemRendererTops();
    this.box = new Rectangle(0, 0, 0, 0);
    
    
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    
    this.polygon = new Polygon();
    
}

ItemRenderer.prototype.shouldThemeProject = function(item) {
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) return item.depth;
    if (titem.depth === 0) return false;
    if (titem.depth > 0) return titem.depth;
    return item.depth;
}
    
ItemRenderer.prototype.drawItem = function(ctx, color, item, window, x, y, scale) {
    if (item.draw == false) return;
    if (isNaN(x) || isNaN(y)) {
        console.log("ItemRenderer: null value!!");
        return;
    }
    var titem = this.getItemTheme(item);
    if (!titem) {
        return;
        color = color ? color : item.color ? item.color : "magenta";
        this.itemrendererdefault.render(ctx, color, item, window, x, y, scale);
        return;
    }
    if (titem.draw === false) return;
    this.itemrenderertheme.render(ctx, color, item, window, x, y, titem, scale);
    this.drawItemTops(ctx, color, item, window, x, y, titem, scale);
}

ItemRenderer.prototype.getItemTheme = function(item) {
    if (!this.theme) {
        console.log("ItemRenderer: null theme!!");
        return null; 
    }
    return this.theme.items[item.itemtype];
}
    
ItemRenderer.prototype.drawItemTops = function(ctx, color, item, window, x, y, titem, scale) {
    if (!titem.top) return;
    this.itemrenderertops.render(ctx, color, item, window, x, y, titem, scale);
}