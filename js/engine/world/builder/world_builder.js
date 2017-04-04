"use strict";

function WorldBuilder() {
    this.itembuilder = new WorldBuilderItems();
    this.trimbuilder = new WorldBuilderTrim();
    this.collidebuilder = new WorldBuilderColliders();
    this.themebuilder = new WorldBuilderTheme();
    this.overlapbuilder = new WorldBuilderOverlap();
    this.intersectbuilder = new WorldBuilderIntersect();
    this.hsrbuilder = new WorldBuilderHSR();
    this.chunkbuilder = new WorldBuilderChunk();
    this.surfacebuilder = new WorldBuilderSurfaces();
    this.environmentbuilder = new WorldBuilderEnvironment();
}

WorldBuilder.prototype.reset = function() {
    this.itembuilder.reset();
    this.collidebuilder.reset();
    this.themebuilder.reset();
    this.overlapbuilder.reset();
    this.intersectbuilder.reset();
    this.hsrbuilder.reset();
    this.chunkbuilder.reset();
    this.surfacebuilder.reset();
    this.environmentbuilder.reset();
}
    
WorldBuilder.prototype.buildWorld = function(now, world) {
    
    this.itembuilder.buildWorld(world);
    benchmark("build world - items");

    this.trimbuilder.buildWorldTrim(world);
    benchmark("build world - trim");

    this.environmentbuilder.buildEnvironment(world);
    benchmark("build world - environment");

    this.overlapbuilder.overlapItems(world);
    benchmark("build world - overlap");

    this.intersectbuilder.intersectItems(world);
    benchmark("build world - intersect");

    this.chunkbuilder.chunk(world);
    benchmark("build world - chunks");

    this.hsrbuilder.removeHiddenSurfaces(world);
    benchmark("build world - HSR");

    //    this.surfacebuilder.buildSurfaces(world);
//    benchmark("build world - surfaces");
    
    
    this.buildWorldTheme(world);
    
}

WorldBuilder.prototype.buildWorldTheme = function(world) {

    this.createRenderItems(world);

    this.themebuilder.buildTheme(world);
    benchmark("build world - theme");

    this.collidebuilder.buildColliders(world);
    benchmark("build world - colliders");
    
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

WorldBuilder.prototype.createRenderItems = function(world) {
    world.renderitems.length = 0;
    var t = world.items.length;
    for (var i = 0; i < t; i++) {
        var worlditem = world.items[i];
        var newitem = worlditem.clone();
        newitem.initialize();
        world.renderitems.push(newitem);
    }
}