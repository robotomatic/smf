"use strict";

function WorldBuilder() {
    this.itembuilder = new WorldBuilderItems();
    this.collidebuilder = new WorldBuilderColliders();
    this.themebuilder = new WorldBuilderTheme();
    this.intersectbuilder = new WorldBuilderIntersect();
    this.hsrbuilder = new WorldBuilderHSR();
    this.chunkbuilder = new WorldBuilderChunk();
    this.surfacebuilder = new WorldBuilderSurfaces();
    this.environmentbuilder = new WorldBuilderEnvironment();
}

WorldBuilder.prototype.buildWorld = function(now, world) {
    
    this.itembuilder.buildWorld(world);
    benchmark("build world - items");
    
    this.themebuilder.buildTheme(world);
    benchmark("build world - theme");

    this.environmentbuilder.buildEnvironment(world);
    benchmark("build world - environment");
    
    this.collidebuilder.buildColliders(world);
    benchmark("build world - colliders");
    
    this.chunkbuilder.chunk(world);
    benchmark("build world - chunks");
    
    this.intersectbuilder.intersectItems(world);
    benchmark("build world - intersect");
    
    this.hsrbuilder.removeHiddenSurfaces(world);
    benchmark("build world - HSR");
    
    this.surfacebuilder.buildSurfaces(world);
    benchmark("build world - surfaces");
    
    //
    // TODO: Need to handle extruded trim!!!
    //      - Needs to extrude VISIBLE edges outward on X and Z axes
    //      - Nice to be able to add extruded Y axis trim this way too
    // - Trim need to be added to colliders
    //

    //
    // TODO: Build render stack here too?
    //
    
}