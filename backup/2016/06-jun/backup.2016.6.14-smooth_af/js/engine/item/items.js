"use strict";

function Items() {
    this.items = new Array();
    this.itemcache = new ItemCache();
    this.item3D = new Item3D();
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

Items.prototype.update = function(now, delta) { 
    if (!this.items.length) return;
    for (var i = 0; i < this.items.length; i++) this.items[i].update(now, delta);
}

Items.prototype.render = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top, first) {
    if (!this.items) return;
    var t = this.items.length;
    for (var i = 0; i < t; i++) this.smoothItem(this.items[i]);
    if (depth) for (var i = 0; i < t; i++) this.item3D.renderItem3D(now, ctx, window, x, y, this.items[i], width, height, scale, quality, renderer, depth, top, parallax);
    for (var i = 0; i < t; i++) this.renderItem(now, ctx, window, x, y, this.items[i], width, height, scale, quality, renderer, cache, blur, parallax, first);
}

Items.prototype.smoothItem = function(item) {

    item.lastX = item.x;
    item.lastY = item.y;
    
    return;
    
    if (!item.action) return;
    
    if (!item.lastX) item.lastX = item.x;
    var dx = (item.x - item.lastX) / 2;
    if (dx) {
        item.lastX = item.x - dx;
    }

    if (!item.lastY) item.lastY = item.y;
    var dy = (item.y - item.lastY) / 2;
    if (dy) {
        item.lastY = item.y - dy;
    } 
}



Items.prototype.renderItem = function(now, ctx, window, x, y, item, width, height, scale, quality, renderer, cache, blur, parallax, first) {
    
    
    if (item.draw == false) return;

    // todo: this needs to be quadtree!!!!
    if (!first && item.width != "100%" && !collideRough(window, item.getMbr())) return;


    var dx = 0;
    var dy = 0;
    if (item.action) {
        dx = item.lastX - x;
        dy = item.lastY - y;
    } else {
        dx = item.x - x;
        dy = item.y - y;
    }
    
    
    var ix = dx * scale;
    var iy = dy * scale;
    
    
    if (parallax) {
        var rc = window.getCenter();
        
        var lcx = width / 2;
        var dcx = (lcx - rc.x) * scale;
        ix += dcx * parallax;
        
        var lcy = height / 2;
        var dcy = (lcy - rc.y) * scale;
        iy += dcy * parallax;
    }
    

    var iw = item.width * scale;
    if (item.width === "100%") {
        ix = -100;
        iw = width + 200;
    }
    var ih = item.height * scale;
    if (item.height === "100%") {
        iy = 0;
        ih = height;
    }
    
    
    ix = round(ix);
    iy = round(iy);
    iw = round(iw);
    ih = round(ih);
    
    //var cache = !item.action;
    this.drawItem(ctx, item, window, ix, iy, iw, ih, renderer, scale, cache, quality, blur, x, y);
}

Items.prototype.drawItem = function(ctx, item, window, x, y, width, height, renderer, scale, cache, quality, blur, ox, oy) {
    
    // todo: this should be like item.draw(ctx, x, y, scale);
    
    if (item.action) {
        ctx.fillStyle = "red"; 
        var rect = new Rectangle(x, y, width, height);
        rect.draw(ctx);
        return;
    }
    
    
    
    if (!cache || !this.itemcache.cacheItem(ctx, item, window, x, y, width, height, renderer, scale, this.drawdetails, quality, blur)) {
        if (renderer) renderer.drawItem(ctx, item.color, item, window, x, y, width, height, scale, this.drawdetails, ox, oy);
        else {
            ctx.fillStyle = item.color ? item.color : "red"; 
            var rect = new Rectangle(x, y, width, height);
            rect.draw(ctx);
        }
    }
}
