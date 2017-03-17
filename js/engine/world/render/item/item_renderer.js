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

function ItemRenderer(theme, materials) {
    this.theme = theme;
    this.materials = materials;
    
    this.itemrendererdefault = new ItemRendererDefault();
    this.itemrenderertheme = new ItemRendererTheme();

    this.box = geometryfactory.getRectangle(0, 0, 0, 0);
    this.polygon = geometryfactory.getPolygon();
    
    this.p1 = geometryfactory.getPoint(0, 0);
    this.p2 = geometryfactory.getPoint(0, 0);
    this.np1 = geometryfactory.getPoint(0, 0);
    this.np2 = geometryfactory.getPoint(0, 0);
}

ItemRenderer.prototype.reset = function() {
    this.itemrendererdefault = new ItemRendererDefault();
    this.itemrenderertheme = new ItemRendererTheme();
    this.theme = null;
    
    this.polygon.points.length = 0;
    this.box.reset();
}

ItemRenderer.prototype.shouldThemeProject = function(item) {
    if (!this.theme) return;
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) return item.depth;
    if (titem.project === false) return false;
    if (titem.depth === 0) return false;
    if (titem.depth > 0) return titem.depth;
    return item.depth;
}
    
ItemRenderer.prototype.drawItem = function(ctx, color, item, window, x, y, scale) {
    if (item.draw == false) return;
    if (isNaN(x) || isNaN(y)) {
        //console.log("ItemRenderer: null value!!");
        return;
    }
    var titem = this.getItemTheme(item);
    if (!titem) {
        color = color ? color : item.color ? item.color : "magenta";
        this.itemrendererdefault.render(ctx, color, item, window, x, y, scale);
        return;
    }
    if (titem.draw === false) return;
    this.itemrenderertheme.render(ctx, color, item, window, x, y, titem, this.materials, scale);
}

ItemRenderer.prototype.getItemTheme = function(item) {
    if (!this.theme) {
        //console.log("ItemRenderer: null theme!!");
        return null; 
    }
    return this.theme.items[item.itemtype];
}