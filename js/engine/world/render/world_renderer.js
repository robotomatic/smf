"use strict";

function WorldRenderer() {
    this.renderitems = {
        all : new Array(),
        keys : new Array()
    }
    this.render = {
        world : true,
        players : true,
        items : true,
        particles : true
    }
    this.itemcache = new ItemCache();
    this.itemrenderer = new ItemRenderer();
    this.worldrenderer_start = new WorldRendererStart(this);
    this.worldrenderer_render = new WorldRendererRender(this);
    this.worldrenderer_debug = new WorldRendererDebug(this);
    this.worldrenderer_end = new WorldRendererEnd(this);
    this.debug = {};
}



WorldRenderer.prototype.reset = function(now, graphics) {
    this.itemrenderer.reset();
    this.itemcache.reset();
    this.renderitems.all.length = 0;
    this.renderitems.keys = new Array();
}




WorldRenderer.prototype.getThemes = function() { 
   return this.itemrenderer.getThemes();
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

WorldRenderer.prototype.renderWorld = function(now, graphics, camera, world, mbr, window, paused) {
    this.worldrenderer_start.renderStart(now, mbr, window, graphics, camera, world, world.debug);
    this.worldrenderer_render.renderRender(now, mbr, window, graphics, camera, world, world.debug, this.render, paused);
    this.worldrenderer_debug.renderDebug(now, mbr, window, graphics, camera, world, world.debug);
    this.worldrenderer_end.renderEnd(now, mbr, window, graphics, camera, world, world.debug);
}

WorldRenderer.prototype.removePlayer = function(player) {
    var id = player.name + "-" + player.id;
    var p = this.renderitems.keys[id];
    if (p) {
        this.renderitems.all.splice(p.index, 1);
        delete this.renderitems.keys[id];
    }
}




