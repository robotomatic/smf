"use strict";

function WorldBuilderEnvironment() {
}

WorldBuilderEnvironment.prototype.buildEnvironment = function(world) {
    var itemrenderer = world.worldrenderer.itemrenderer;
    var items = world.items;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        this.buildEnvironmentItem(world, itemrenderer, item);
    }
    world.items = items;
}

WorldBuilderEnvironment.prototype.buildEnvironmentItem = function(world, itemrenderer, item) {
    var theme = itemrenderer.getItemTheme(item);
    if (!theme) return;
    var m = theme.material;
    if (!m) return;
    var material = itemrenderer.materials.materials[m];
    if (!material) return;
    
    var damage = material.damage;
    if (damage) {
        item.damage.hp = damage.hp;
        item.damage.rate = damage.rate;
        item.damage.effect = damage.effect;
    }
    
    var properties = material.properties;
    if (properties) {
        item.properties.density = properties.density;
        item.properties.suction = properties.suction;
    }
    
    var waterline = material.waterline;
    if (waterline) {
        world.worldrenderer.waterline.y = item.y;
        world.worldrenderer.waterline.z = item.z;
        if (!waterline.flow) return;
        world.worldrenderer.waterline.amount = waterline.amount;
        world.worldrenderer.waterline.miny = waterline.miny;
        world.worldrenderer.waterline.maxy = waterline.maxy;
        world.worldrenderer.waterline.flow = true;
    }
}