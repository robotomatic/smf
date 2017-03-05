"use strict";

function StageBuilder() {
    this.itembuilder = new StageBuilderItems();
    this.intersectbuilder = new StageBuilderIntersect();
    this.collidebuilder = new StageBuilderColliders();
    this.hsrbuilder = new StageBuilderHSR();
}

StageBuilder.prototype.buildStage = function(now, stage) {
    this.itembuilder.buildStage(stage);
    this.collidebuilder.buildColliders(stage);
    this.intersectbuilder.intersectItems(stage);
    this.hsrbuilder.removeHiddenSurfaces(stage);
}