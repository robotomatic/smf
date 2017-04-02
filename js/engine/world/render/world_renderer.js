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

WorldRenderer.prototype.setTheme = function(themename, theme, materials) { 
    var rt = this.itemrenderer.theme;
    if (!rt) {
        this.itemrenderer.theme = new Theme(themename); 
        this.itemrenderer.materials = materials; 
        this.itemrenderer.theme.background = theme.background;
        this.itemrenderer.theme.physics = JSON.parse(JSON.stringify(theme.physics));
        this.itemrenderer.theme.items = JSON.parse(JSON.stringify(theme.items));
        return;
    }
    var bg = theme.background;
    if (bg) rt.background = bg;
    var keys = Object.keys(theme.items);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var itemname = keys[i];
        var item = theme.items[itemname];
        rt.items[itemname] = JSON.parse(JSON.stringify(item));
    }
}

WorldRenderer.prototype.render = function(now, graphics, camera, world, mbr, window, render) {
    this.waterline.getFlood();
    this.worldrenderer_start.renderStart(now, mbr, window, graphics, camera, world, world.debug);
    this.worldrenderer_render.renderRender(now, mbr, window, graphics, camera, world, world.debug, render);
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
