"use strict";

function ItemMaterial() {
    this.materials = {
        "plastic" : new ItemMaterialPlastic(),
        "wood" : new ItemMaterialWood(),
        "rock" : new ItemMaterialRock(),
        "metal" : new ItemMaterialMetal(),
        "stone" : new ItemMaterialStone(),
        "ground" : new ItemMaterialGround()
    }
}

ItemMaterial.prototype.render = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale, drawdetails, ox, oy) {
    var m = this.materials[material.name];
    if (m) {
        m.draw(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale, drawdetails, ox, oy);
        return true;
    }
    return false;
}
