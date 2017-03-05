"use strict";

function StageRenderer() {
    this.renderitems = {
        all : new Array()
    }
    this.itemcache = new ItemCache();
    this.stagerenderer_start = new StageRendererStart(this.renderitems);
    this.stagerenderer_render = new StageRendererRender(this.renderitems, this.itemcache);
    this.stagerenderer_debug = new StageRendererDebug(this.renderitems);
    this.stagerenderer_end = new StageRendererEnd(this.renderitems);
    this.flood = new StageFlood();
    this.debug = {
        render : false,
        overdraw : false
    };
}

StageRenderer.prototype.reset = function(now, graphics) {
    this.itemcache.reset();
}

StageRenderer.prototype.render = function(now, graphics, camera, stage, mbr, window) {
    this.clearGraphics(graphics);
    this.flood.getFlood();
    this.stagerenderer_start.renderStart(mbr, window, graphics, camera, stage);
    this.stagerenderer_render.renderRender(now, graphics, camera, stage, mbr, window);
    this.stagerenderer_debug.renderDebug(now, graphics, camera, stage, mbr, window, this.debug);
    this.stagerenderer_end.renderEnd(graphics, mbr);
}

StageRenderer.prototype.clearGraphics = function(graphics) { 
    clearRect(graphics.ctx, 0, 0, graphics.canvas.width, graphics.canvas.height);
    graphics.ctx.beginPath();
}