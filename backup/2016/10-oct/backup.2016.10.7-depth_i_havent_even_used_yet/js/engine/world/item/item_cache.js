"use strict";

function ItemCache() {
    this.cache = new Array();
    this.item3D = new Item3D();
    this.box = new Rectangle(0, 0, 0, 0);
    this.image = new Image(null, 0, 0, 0, 0);
    this.debug = false;
    this.itemdebugger = new ItemDebugger();
}

ItemCache.prototype.reset = function() {
    this.cache.length = 0;
}

ItemCache.prototype.cacheItem = function(now, ctx, item, renderer, window, ox, oy, width, height, scale, quality, floodlevel) {
    item.translate(window, ox, oy, width, height, scale);
    this.item3D.renderItem3D(now, ctx, item, renderer, window, ox, oy, scale, floodlevel);
    this.renderItem(now, ctx, item, renderer, window, ox, oy, width, height, scale, quality, floodlevel);
    this.debugItem(now, ctx, item, renderer, window, ox, oy, width, height, scale);
}

ItemCache.prototype.renderItem = function(now, ctx, item, renderer, window, ox, oy, width, height, scale, quality, floodlevel) {

    var box = item.box;
    var x = box.x;
    var y = box.y;
    var w = box.width;
    var h = box.height;
    
    this.box.x = x;
    this.box.y = y;
    this.box.width = w;
    this.box.height = h;

    if (item.iteminfo && item.iteminfo.front === false) return;
    
    var p = 10;
    var pad = p * item.scalefactor;
    var hpad = pad / 2;
    var qpad = pad * quality;
    var qhpad = qpad / 2;

    var spad = pad * scale *item.scalefactor;
    var shpad = spad / 2;

    var iiw = item.width;
    var iw = 0;
    if (iiw == "100%") {
        iw = width;
        w = width;
        x = 0;
    } else {
        iw = iiw * quality;
    }
    
    var iih = item.height;
    var ih = 0;
    if (iih == "100%") {
        ih = height;
        h = height;
        y = 0;
    } else {
        ih = iih * quality;
    }
    
    if (item.cache === true) {
        var cachename = item.id;
        var cacheitem = this.cache[cachename];
        
        if (!cacheitem) {
            var cachecanvas = document.createElement('canvas');
            cacheitem = {
                canvas : cachecanvas,
                ctx : cachecanvas.getContext("2d")
            }
            this.cache[cachename] = cacheitem;
            item.box.x = 0;
            item.box.y = 0;
            item.box.width = iw;
            item.box.height = ih;
            cacheitem.canvas.width = item.box.width + qpad;
            cacheitem.canvas.height = item.box.height + qpad;
            item.render(now, cacheitem.ctx, window, qhpad, qhpad, quality, renderer);
        }
        
        this.image.x = 0;
        this.image.y = 0;
        this.image.width = cacheitem.canvas.width;
        this.image.height = cacheitem.canvas.height;
        this.image.data = cacheitem.canvas;
        
        var dx = x - shpad;
        var dy = y - shpad;
        var dw = w + spad;
        var dh = h + spad;
        
        this.image.clipY(floodlevel ? floodlevel : 0);
        
        this.image.draw(ctx, dx, dy, dw, dh);
    } else {
        item.render(now, ctx, window, x, y, quality * scale, renderer);
    }
}
    
ItemCache.prototype.debugItem = function(now, ctx, item, renderer, window, ox, oy, width, height, scale) {
    var debug = false;
    if (!this.debug && !item.debug && !debug) return;
    item.box.x = this.box.x;
    item.box.y = this.box.y;
    item.box.width = this.box.width;
    item.box.height = this.box.height;
    this.itemdebugger.debugItem(item, now, ctx, window, ox, oy, width, height, scale);
}
