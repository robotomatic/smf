"use strict";

function ItemRendererMaterial() {
    this.box = new Rectangle();
    this.polygon = new Polygon();
    this.itemmaterals = new ItemMaterial();
}

ItemRendererMaterial.prototype.render = function(ctx, item, titem, x, y, width, height, color, scale) { 
    if (!titem.material) return false;
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
    return this.itemmaterals.render(ctx, color, titem.material, item, this.polygon, window, x, y, width, height, titem, scale);
}
