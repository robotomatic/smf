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

Items.prototype.render = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first) {

    if (!this.items) return;
    
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        
        var item = this.items[i];

        item.smooth();
        
        if (!first && !item.isVisible(window)) continue;
        
        
        item.translate(window, x, y, width, height, scale, parallax);
        
        if (depth) this.item3D.renderItem3D(now, ctx, item, renderer, window, x, y, width, height, scale, depth, top, quality, parallax);
        
        var d = false;
        if (cache) d = this.itemcache.cacheItem(ctx, item, window, renderer, scale, this.drawdetails, quality, blur, parallax);
        if (!d) item.render(now, ctx, window, x, y, scale, renderer, this.drawdetails);
        if (this.debug) this.itemdebugger.debugItem(item, now, ctx, window, x, y, width, height, scale, parallax);
    }
}

Items.prototype.debugItems = function(now, ctx, window, x, y, width, height, scale, parallax) {
    if (!this.items) return;
    this.itemdebugger.debugItems(this.items, now, ctx, window, x, y, width, height, scale, parallax);
}