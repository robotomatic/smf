"use strict";

function ItemRenderer(theme, materials) {
    this.theme = theme;
    this.materials = materials;

    this.box = geometryfactory.getRectangle(0, 0, 0, 0);
    this.polygon = geometryfactory.getPolygon();
    
    this.p1 = geometryfactory.getPoint(0, 0);
    this.p2 = geometryfactory.getPoint(0, 0);
    this.np1 = geometryfactory.getPoint(0, 0);
    this.np2 = geometryfactory.getPoint(0, 0);
}

ItemRenderer.prototype.reset = function() {
    this.theme = null;
    this.polygon.points.length = 0;
    this.box.reset();
}

ItemRenderer.prototype.shouldThemeProject = function(item) {
    if (!this.theme) return true;
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) return true;
    if (titem.project === false) return false;
    if (titem.depth === 0) return false;
    return true;
}
    
ItemRenderer.prototype.drawItem = function(ctx, color, item, window, x, y, scale) {
}

ItemRenderer.prototype.getItemTheme = function(item) {
    if (!this.theme) return null; 
    return this.theme.items[item.itemtype];
}