"use strict";

function WorldRenderer() {
    this.renderitems = {
        all : new Array(),
        keys : new Array()
    }
    this.itemcache = new ItemCache();
    this.itemrenderer = new ItemRenderer();
    this.worldrenderer_start = new WorldRendererStart(this.renderitems);
    this.worldrenderer_render = new WorldRendererRender(this.renderitems, this.itemcache);
    this.worldrenderer_debug = new WorldRendererDebug(this.renderitems);
    this.worldrenderer_end = new WorldRendererEnd(this.renderitems);
    this.waterline = new Waterline();
    this.debug = {};
}

WorldRenderer.prototype.reset = function(now, graphics) {
    this.itemrenderer.reset();
    this.itemcache.reset();
    this.renderitems.all.length = 0;
    this.renderitems.keys = new Array();
}

WorldRenderer.prototype.unloadThemes = function() { 
    this.itemrenderer.unloadThemes();
}

WorldRenderer.prototype.loadMaterials = function(materials) { 
    this.itemrenderer.loadMaterials(materials);
}

WorldRenderer.prototype.loadTheme = function(theme) { 
    this.itemrenderer.loadTheme(theme);
}

WorldRenderer.prototype.render = function(now, graphics, camera, world, mbr, window) {
    this.waterline.getFlood();
    this.worldrenderer_start.renderStart(now, mbr, window, graphics, camera, world, world.debug);
    this.worldrenderer_render.renderRender(now, mbr, window, graphics, camera, world, world.debug);
    this.worldrenderer_debug.renderDebug(now, mbr, window, graphics, camera, world, world.debug);
    this.worldrenderer_end.renderEnd(graphics, mbr);
}

WorldRenderer.prototype.removePlayer = function(player) {
    var id = player.name + "-" + player.id;
    var p = this.renderitems.keys[id];
    if (p) {
        this.renderitems.all.splice(p.index, 1);
        delete this.renderitems.keys[id];
    }
}
