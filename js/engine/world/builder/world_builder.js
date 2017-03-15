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
    benchmark("build world - start", "build");
    this.itembuilder.buildWorld(world);
    benchmark("build world - items");
    this.collidebuilder.buildColliders(world);
    benchmark("build world - colliders");
    this.chunkbuilder.chunk(world);
    benchmark("build world - chunks");
    this.themebuilder.buildTheme(world);
    benchmark("build world - theme");
    this.intersectbuilder.intersectItems(world);
    benchmark("build world - intersect");
    this.hsrbuilder.removeHiddenSurfaces(world);
    benchmark("build world - surfaces");
    this.surfacebuilder.buildSurfaces(world);
    benchmark("build world - end", "build");
}