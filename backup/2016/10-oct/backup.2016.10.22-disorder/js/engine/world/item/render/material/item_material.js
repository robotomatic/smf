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

ItemMaterial.prototype.render = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {
    var m = this.materials[material.name];
    if (!m) return false;
    m.draw(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale);
    return true;
}
