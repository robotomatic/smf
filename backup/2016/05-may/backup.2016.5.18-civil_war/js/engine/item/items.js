"use strict";

function Items() {
    this.items = new Array();
    this.itemcache = new ItemCache();
}

Items.prototype.loadJson = function(items) {
    for (var item in items) {
        var it = new Item();
        it.loadJson(items[item]);
        this.addItem(item, it);
    }
}


Items.prototype.addItem = function(key, item) { 
    this.items[key] = item;
}

Items.prototype.update = function(now, step) { 
    if (!this.items.length) return;
    for (var i = 0; i < this.items.length; i++) this.items[i].update(now, step);
}

Items.prototype.render = function(now, ctx, window, x, y, width, height, scale, quality, renderer) {
    if (!this.items) return;
    for (var i = 0; i < this.items.length; i++) this.renderItem(now, ctx, window, this.items[i], x, y, width, height, scale, quality, renderer, true);
}

Items.prototype.renderItem = function(now, ctx, window, item, x, y, width, height, scale, quality, renderer, cache) {
    if (item.draw == false) return;

    // todo: this needs to be quadtree!!!!
    if (item.width != "100%" && !collideRough(window, item.getMbr())) return;
    
    var itemx = item.x;
    var itemy = item.y;
    
    if (!item.lastX) item.lastX = itemx;
    var dx = (itemx - item.lastX) / 2;
    if (dx) {
        itemx = itemx - dx;    
        item.lastX = itemx;
    }
    
    if (!item.lastY) item.lastY = itemy;
    var dy = (itemy - item.lastY) / 2;
    if (dy) {
        itemy = itemy - dy;
        item.lastY = itemy;
    } 

    var ix = (itemx - x) * scale;
    var iy = (itemy - y) * scale;;
    var iw = item.width * scale;
    if (item.width === "100%") {
        ix = -100;
        iw = width;
    }
    var ih = item.height * scale;
    if (item.height === "100%") {
        iy = 0;
        ih = height;
    }
    //var cache = !item.action;
    this.drawItem(ctx, item, ix, iy, iw, ih, renderer, scale, cache, quality);
}

Items.prototype.drawItem = function(ctx, item, x, y, width, height, renderer, scale, cache, quality) {
    
    // todo: this should be like item.draw(ctx, x, y, scale);
    
    if (!cache || !this.itemcache.cacheItem(ctx, item, x, y, width, height, renderer, scale, this.drawdetails, quality)) {
        if (renderer) renderer.drawItem(ctx, item.color, item, x, y, width, height, scale, this.drawdetails);
        else {
            ctx.fillStyle = item.color ? item.color : "red"; 
            var rect = new Rectangle(x, y, width, height);
            rect.draw(ctx);
        }
    }
}
