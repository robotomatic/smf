"use strict";

function WorldBuilder() {
    this.itembuilder = new WorldBuilderItems();
    this.collidebuilder = new WorldBuilderColliders();
    this.themebuilder = new WorldBuilderTheme();
    this.intersectbuilder = new WorldBuilderIntersect();
    this.hsrbuilder = new WorldBuilderHSR();
    this.chunkbuilder = new WorldBuilderChunk();
    this.surfacebuilder = new WorldBuilderSurfaces();
}

WorldBuilder.prototype.buildWorld = function(now, world) {
    this.itembuilder.buildWorld(world);
    this.collidebuilder.buildColliders(world);
    this.themebuilder.buildTheme(world);
    this.chunkbuilder.chunk(world);
    this.intersectbuilder.intersectItems(world);
    this.hsrbuilder.removeHiddenSurfaces(world);
    this.surfacebuilder.buildSurfaces(world);
}