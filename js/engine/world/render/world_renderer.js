"use strict";

function WorldRenderer() {
    this.renderitems = {
        all : new Array()
    }
    this.itemcache = new ItemCache();
    this.itemrenderer = new ItemRenderer();
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
    this.itemrenderer.reset();
    this.itemcache.reset();
}

WorldRenderer.prototype.setTheme = function(themename, theme, materials) { 
    var rt = this.itemrenderer.theme;
    if (!rt) {
        this.itemrenderer.theme = new Theme(themename); 
        this.itemrenderer.materials = materials; 
        this.itemrenderer.theme.background = theme.background;
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