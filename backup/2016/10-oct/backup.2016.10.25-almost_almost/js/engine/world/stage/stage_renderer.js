"use strict";

function StageRenderer() {
    this.renderitems = {
        centerbottom : 0,
        all : new Array(),
        first : new Array(),
        above : {
            all : new Array(),
            y : new Array()
        },
        center : {
            all : new Array(),
            z : new Array()
        },
        below : {
            all : new Array(),
            y : new Array()
        }
    }
    this.stagerenderer_start = new StageRendererStart(this.renderitems);
    this.stagerenderer_render = new StageRendererRender(this.renderitems);
    this.stagerenderer_debug = new StageRendererDebug(this.renderitems);
    this.stagerenderer_end = new StageRendererEnd(this.renderitems);
    this.debug = false;
}

StageRenderer.prototype.reset = function(now) {
    this.renderitems.all.length = 0;
    this.renderitems.z = new Array();
    this.itemcache.reset();
}

StageRenderer.prototype.render = function(now, graphics, stage, mbr, window, levelquality, playerquality) {
    this.clearGraphics(graphics);
    this.stagerenderer_start.renderStart(mbr, window, graphics, stage);
    this.stagerenderer_render.renderRender(now, graphics, stage, mbr, window, levelquality, playerquality);
    if (this.debug) this.stagerenderer_debug.renderDebug(now, graphics, stage, mbr, window);
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
