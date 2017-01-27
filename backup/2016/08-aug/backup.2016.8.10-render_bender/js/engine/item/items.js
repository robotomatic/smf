"use strict";

function Items() {
    this.items = new Array();
    this.itemcache = new ItemCache();
    this.item3D = new Item3D();
    this.debug = false;
    this.itemdebugger = new ItemDebugger();
}

Items.prototype.loadJson = function(items, collide) {
    for (var item in items) {
        var it = new Item();
        it.loadJson(items[item]);
        if (it.collide != false && it.collide != "top") {
            it.collide = collide;
        }
        this.addItem(item, it);
    }
}

Items.prototype.addItem = function(key, item) { 
    this.items[key] = item;
}


Items.prototype.update = function(now, delta) { 
    if (!this.items.length) return;
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        this.items[i].update(now, delta);
    }
}

Items.prototype.renderStart = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first) {
}

Items.prototype.render = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first) {
    if (!this.items) return;
    
    var pad = 50;
    
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        var item = this.items[i];
        item.smooth();
        
        if (!first && !item.isVisible(window, pad)) continue;
        
        item.translate(window, x, y, width, height, scale, parallax);
        this.renderItem3D(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item);
        this.renderItem(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item);
    }
    if (this.debug) this.debugItems(now, ctx, window, x, y, width, height, scale, parallax);
}

Items.prototype.renderItem3D = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item) {
    depth = (item.depth === 0) ? 0 : depth;
    if (!depth) return;
    var td = renderer.shouldThemeProject(item, depth);
    if (!td) return;
    // todo: calculate projected width & height
    this.item3D.renderItem3D(now, ctx, item, renderer, window, x, y, width, height, scale, depth, top, quality, parallax);
}

Items.prototype.renderItem = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item) {
    var c = false;
    if (cache && item.cache !== false) c = this.itemcache.cacheItem(ctx, item, window, renderer, scale, quality, blur, parallax);
    if (!c) item.render(now, ctx, window, x, y, scale, renderer);
}

Items.prototype.debugItems = function(now, ctx, window, x, y, width, height, scale, parallax) {
    if (!this.items) return;
    this.itemdebugger.debugItems(this.items, now, ctx, window, x, y, width, height, scale, parallax);
}

Items.prototype.renderEnd = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first) {
}

