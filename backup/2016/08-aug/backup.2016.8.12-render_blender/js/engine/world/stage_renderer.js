"use strict"

function StageRenderer() {
    this.renderpad = 25;
    this.renderitems = new Array();
    this.itemcache = new ItemCache();
    this.item3D = new Item3D();
    this.debug = false;
    this.itemdebugger = new ItemDebugger();
}

StageRenderer.prototype.render = function(now, ctx, stage, window, x, y, scale, levelquality, playerquality, first) {

    var level = stage.level;
    var renderer = level.itemrenderer;
    var width = level.width;
    var height = level.height;
    
    if (this.renderitems.length == 0) {
        var t = level.layers.length;
        for (var i = 0; i < t; i++) {
            var layer = level.layers[i];
            if (layer.draw === false) continue;
            this.renderitems = this.renderitems.concat(layer.items.items);
        }
        this.renderitems.sort(sortByZIndex);
    }
    
    var it = this.renderitems.length;
    for (var ii = 0; ii < it; ii++) {
        var item = this.renderitems[ii];
        item.smooth();
        if (item.zindex !== undefined && item.zindex > 999) continue;
        if (!first && !item.isVisible(window, this.renderpad)) continue;
        this.renderItem(now, ctx, window, x, y, width, height, scale, levelquality, renderer, first, item);
    }

    var players = stage.players;
    if (players && players.players) {
        var pt = players.players.length;
        for (var pi = 0; pi < pt; pi++) {
            var rp = players.players[pi];
            players.renderPlayer(now, window, ctx, rp, x, y, scale, playerquality);
        }
    }
    
    for (var iii = 0; iii < it; iii++) {
        var item = this.renderitems[iii];
        if (item.zindex !== undefined && item.zindex <= 999) continue;
        if (!first && !item.isVisible(window, this.renderpad)) continue;
        this.renderItem(now, ctx, window, x, y, width, height, scale, levelquality, renderer, first, item);
    }
    
    if (this.debug) this.debugItems(now, ctx, window, x, y, width, height, scale);
}

StageRenderer.prototype.renderItem = function(now, ctx, window, x, y, width, height, scale, quality, renderer, first, item) {
    item.translate(window, x, y, width, height, scale);
    if (renderer.shouldThemeProject(item)) {
        // todo: calculate projected width & height
        this.item3D.renderItem3D(now, ctx, item, renderer, window, x, y, width, height, scale, quality);
    }
    var c = false;
    if (item.cache !== false) c = this.itemcache.cacheItem(ctx, item, window, renderer, scale, quality);
    if (!c) item.render(now, ctx, window, x, y, scale, renderer);
}

StageRenderer.prototype.debugItems = function(now, ctx, window, x, y, width, height, scale) {
    this.itemdebugger.debugItems(this.renderitems, now, ctx, window, x, y, width, height, scale);
}