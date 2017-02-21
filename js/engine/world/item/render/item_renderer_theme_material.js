"use strict";

function ItemRendererThemeMaterial() {
    this.materials = null;
    this.box = geometryfactory.getRectangle();
    this.polygon = geometryfactory.getPolygon();
    this.itemmaterals = new ItemMaterial();
}

ItemRendererThemeMaterial.prototype.render = function(ctx, item, titem, x, y, color, scale) { 
    
    if (!titem.material) return false;
    
    if (!this.materials) return;
    var material = this.materials.materials[titem.material];
    if (!material) return;

    var box = item.box;
    var width = box.width;
    var height = box.height;
    
    if (item.z) {
        var s = width / item.width;
    }
    
    this.box.x = x;
    this.box.y = y;
    this.box.width = width;
    this.box.height = height;
    
    ctx.fillStyle = color;
    if (titem.itemtype == "group") {
        this.polygon.points.length = 0;
        this.polygon.setPoints(item.polygon.getPoints());
        this.polygon.translate(x, y, scale);
    } else {
        this.polygon.points.length = 0;
        this.polygon.setPoints(this.box.getPoints());
    }

    return this.itemmaterals.render(ctx, color, material, item, this.polygon, window, x, y, width, height, titem, scale);
}
