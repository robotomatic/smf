"use strict";

function WorldBuilderEnvironment() {
}

WorldBuilderEnvironment.prototype.reset = function(world) { 
    world.waterline.reset();
}

WorldBuilderEnvironment.prototype.buildEnvironment = function(world) {
    world.waterline.reset();
    var itemrenderer = world.worldrenderer.itemrenderer;
    var items = world.renderitems;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        this.buildEnvironmentItem(world, itemrenderer, item);
    }
    world.renderitems = items;
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
        item.properties.friction = properties.friction;
        item.properties.airfriction = properties.airfriction;
        item.properties.density = properties.density;
        item.properties.suction = properties.suction;
    }
    
    var waterline = material.waterline;
    if (waterline) {
        world.waterline.y = item.y;
        world.waterline.z = item.z;
        if (!waterline.flow) {
            world.waterline.flow = false;    
            return;
        }
        world.waterline.amount = waterline.amount;
        world.waterline.miny = waterline.miny;
        world.waterline.maxy = waterline.maxy;
        world.waterline.flow = true;
        
        if (waterline.surface) {
            world.waterline.surface.size = waterline.surface.size;
            world.waterline.surface.depth = waterline.surface.depth;
            world.waterline.surface.height = waterline.surface.height;
            world.waterline.surface.frequency = waterline.surface.frequency;
        }
        world.waterline.setItem(item);
        item.waterline = true;
    }
}

WorldBuilderEnvironment.prototype.buildWaterline = function(world) {
    world.waterline.buildWaterline(world);
}
