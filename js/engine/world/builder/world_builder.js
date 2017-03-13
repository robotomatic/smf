"use strict";

function WorldBuilder() {
    
    
    this.chunksize = {
        x : 300,
        y : 300,
        z : 300
    }
    
    this.indexsize = {
        width: 100,
        height: 100,
        depth : 100
    }
    
    this.itembuilder = new WorldBuilderItems();
    this.collidebuilder = new WorldBuilderColliders();
    this.themebuilder = new WorldBuilderTheme();
    this.intersectbuilder = new WorldBuilderIntersect();
    this.hsrbuilder = new WorldBuilderHSR();
    this.chunkbuilder = new WorldBuilderChunk();
}

WorldBuilder.prototype.buildWorld = function(now, world) {
    world.items = this.itembuilder.buildWorld(world);
    world.worldcollider.colliders = this.collidebuilder.buildColliders(world.items, this.indexsize);
    world.items = this.themebuilder.buildTheme(world.items, world.worldrenderer.itemrenderer);
    world.items = this.chunkbuilder.chunk(world.items, this.chunksize);
    world.items = this.intersectbuilder.intersectItems(world.items);
    world.items = this.hsrbuilder.removeHiddenSurfaces(world.items);
}