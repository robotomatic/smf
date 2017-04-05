"use strict";

function ItemRenderer() {
    
    this.themes = new Array();
    
    this.theme = null;
    this.materials = null;

    this.item3Drenderer = new ItemRenderer3D();
    
    this.box = geometryfactory.getRectangle(0, 0, 0, 0);
    this.polygon = geometryfactory.getPolygon();
    
    this.p1 = geometryfactory.getPoint(0, 0);
    this.p2 = geometryfactory.getPoint(0, 0);
    this.np1 = geometryfactory.getPoint(0, 0);
    this.np2 = geometryfactory.getPoint(0, 0);
}

ItemRenderer.prototype.unloadThemes = function() {
    this.themes = new Array();
    if (this.theme) this.theme.reset();
}


ItemRenderer.prototype.loadMaterials = function(materials) {
    this.materials = materials; 
}
    
ItemRenderer.prototype.loadTheme = function(theme) {
    var add = true;
    for (var i = 0; i < this.themes.length; i++) {
        var thistheme = this.themes[i];
        if (thistheme.name == theme.name) {
            add = false;
            break;
        }
    }
    if (add) this.themes.push(theme);
    if (!this.theme) {
        this.theme = new Theme(); 
        this.theme.background = theme.background;
        this.theme.physics = JSON.parse(JSON.stringify(theme.physics));
        this.theme.items = JSON.parse(JSON.stringify(theme.items));
        return;
    }
    var bg = theme.background;
    if (bg) this.theme.background = bg;
    var keys = Object.keys(theme.items);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var itemname = keys[i];
        var item = theme.items[itemname];
        this.theme.items[itemname] = JSON.parse(JSON.stringify(item));
    }
}
    
ItemRenderer.prototype.reset = function() {
    this.theme.reset();
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
    
ItemRenderer.prototype.renderItem = function(now, renderer, item, gamecanvas, scale, debug, paused) {
    this.item3Drenderer.renderItem3D(now, renderer, item, gamecanvas, scale, debug);
}

ItemRenderer.prototype.getItemTheme = function(item) {
    if (!this.theme) return null; 
    return this.theme.items[item.itemtype];
}