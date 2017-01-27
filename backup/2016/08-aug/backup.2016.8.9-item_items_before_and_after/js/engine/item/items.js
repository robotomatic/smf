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

Items.prototype.updateItems = function(depth, renderer) { 
    if (!this.items.length) return;
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        this.items[i].updateItem(depth, renderer);
    }
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
        this.renderItem(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, this.items[i]);
    }
}

Items.prototype.renderItem = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item) {
    item.smooth();
    if (!first && !item.isVisible(window)) return;
    item.translate(window, x, y, width, height, scale, parallax);
    depth = (item.depth === 0) ? 0 : depth;
    item.renderBefore(now, ctx, window, x, y, scale, renderer);
    var td = renderer.shouldThemeProject(item, depth);
    if (td) {
        // todo: calculate projected width & height
        this.item3D.renderItem3D(now, ctx, item, renderer, window, x, y, width, height, scale, depth, top, quality, parallax);
    }
    var c = false;
    if (cache) {
        c = this.itemcache.cacheItem(ctx, item, window, renderer, scale, quality, blur, parallax);
    }
    if (c) {
        item.renderCache(ctx, window, x, y, item.box, scale, false, renderer);
    } else item.render(now, ctx, window, x, y, scale, renderer);
}

Items.prototype.renderAfter = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, players) {
    if (!this.items) return;
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        this.renderUncollidedItemAfter(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, this.items[i], players);
    }
}

Items.prototype.renderUncollidedItemAfter = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item, players) {
    if (players && players.players) {
        var t = players.players.length;
        for (var i = 0; i < t; i++) {
            var player = players.players[i];
            var c = player.collider.getBottomItem();
            if (!c) continue;
            var citem = c.item;
            if (citem && citem.id == item.id) {
                return;
            }
        }
    }
    this.renderItemAfter(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item);
}
    
Items.prototype.renderItemAfter = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first, item) {
    if (!first && !item.isVisible(window)) return;
    item.renderAfter(now, ctx, window, x, y, scale, renderer);
    if (this.debug) this.itemdebugger.debugItem(item, now, ctx, window, x, y, width, height, scale, parallax);
}


Items.prototype.renderColliders = function(now, ctx, window, x, y, width, height, scale, quality, renderer, first, players) {
    var t = players.length;
    for (var i = 0; i < t; i++) {
        this.renderPlayerCollider(now, window, ctx, players[i], x, y, scale, quality, renderer);
    }
}

Items.prototype.renderPlayerCollider = function(now, window, ctx, player, x, y, scale, quality, renderer) {
    var c = player.collider.getBottomItem();
    if (!c) return;
    var item = this.getCollisionItem(c);
    if (!item) return;

    // todo - render after

}

Items.prototype.getCollisionItem = function(collider) {
    if (!collider) return null;
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        var item = this.items[i];
        if (item.id == collider.item.id) return item;
    }
    return null;
}


Items.prototype.debugItems = function(now, ctx, window, x, y, width, height, scale, parallax) {
    if (!this.items) return;
    this.itemdebugger.debugItems(this.items, now, ctx, window, x, y, width, height, scale, parallax);
}