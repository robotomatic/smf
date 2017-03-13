"use strict";

function StageBuilder() {
    
    
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
    
    this.itembuilder = new StageBuilderItems();
    this.collidebuilder = new StageBuilderColliders();
    this.themebuilder = new StageBuilderTheme();
    this.intersectbuilder = new StageBuilderIntersect();
    this.hsrbuilder = new StageBuilderHSR();
    this.chunkbuilder = new StageBuilderChunk();
}

StageBuilder.prototype.buildStage = function(now, stage) {
    stage.items = this.itembuilder.buildStage(stage);
    stage.stagecollider.colliders = this.collidebuilder.buildColliders(stage.items, this.indexsize);
    stage.items = this.themebuilder.buildTheme(stage.items, stage.level.itemrenderer);
    stage.items = this.chunkbuilder.chunk(stage.items, this.chunksize);
    stage.items = this.intersectbuilder.intersectItems(stage.items);
    stage.items = this.hsrbuilder.removeHiddenSurfaces(stage.items);
}