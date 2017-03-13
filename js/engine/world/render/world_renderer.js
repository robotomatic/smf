"use strict";

function WorldRenderer() {
    this.renderitems = {
        all : new Array()
    }
    this.itemcache = new ItemCache();
    this.worldrenderer_start = new WorldRendererStart(this.renderitems);
    this.worldrenderer_render = new WorldRendererRender(this.renderitems, this.itemcache);
    this.worldrenderer_debug = new WorldRendererDebug(this.renderitems);
    this.worldrenderer_end = new WorldRendererEnd(this.renderitems);
    this.waterline = new Waterline();
    this.debug = {
        level : {
            render : false,
            level : false,
            hsr : false,
        },
        player : {
            player : false,
            character : false,
            guts : false
        },
        collision : {
            level : false,
            players : false
        }
    };
}

WorldRenderer.prototype.reset = function(now, graphics) {
    this.itemcache.reset();
}

WorldRenderer.prototype.render = function(now, graphics, camera, world, mbr, window) {
    this.clearGraphics(graphics);
    this.waterline.getFlood();
    this.worldrenderer_start.renderStart(mbr, window, graphics, camera, world, this.debug);
    this.worldrenderer_render.renderRender(now, graphics, camera, world, mbr, window, this.debug);
    this.worldrenderer_debug.renderDebug(now, graphics, camera, world, mbr, window, this.debug);
    this.worldrenderer_end.renderEnd(graphics, mbr);
}

WorldRenderer.prototype.clearGraphics = function(graphics) { 
    clearRect(graphics.ctx, 0, 0, graphics.canvas.width, graphics.canvas.height);
    graphics.ctx.beginPath();
}