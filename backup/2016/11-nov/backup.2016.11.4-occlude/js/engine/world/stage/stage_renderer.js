"use strict";

function StageRenderer() {
    this.renderitems = {
        all : new Array(),
        overlap : {
            front_top : new Array(),
            front_front : new Array(),
            front_bottom : new Array(),
            side_top : new Array(),
            side_side : new Array(),
            side_bottom : new Array(),
            items : new Array()
        }
    }
    this.itemcache = new ItemCache();
    this.stagerenderer_start = new StageRendererStart(this.renderitems, this.itemcache);
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

StageRenderer.prototype.render = function(now, graphics, stage, mbr, window, levelquality, playerquality) {
    this.clearGraphics(graphics);
    this.getFlood(stage);
    this.stagerenderer_start.renderStart(mbr, window, graphics, stage, this.flood);
    this.stagerenderer_render.renderRender(now, graphics, stage, mbr, window, this.flood, levelquality, playerquality);
    this.stagerenderer_debug.renderDebug(now, graphics, stage, mbr, window, this.debug);
    this.stagerenderer_end.renderEnd(graphics, mbr);
}

StageRenderer.prototype.clearGraphics = function(graphics) { 
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        clearRect(g.ctx, 0, 0, g.canvas.width, g.canvas.height);
        g.ctx.beginPath();
    }
}

StageRenderer.prototype.getFlood = function(stage) {
    this.flood.doflood = false;
    var level = stage.level;
    if (level.flood) {
        this.flood.init(level.flood.y);
        this.flood.doflood = true;
    }
}

