"use strict";

/*

    todo: item animation cycle can be handled here (instead of in grass class)
    find a way to bleach items in distance

*/

function ItemCache() {
    this.cache = new Array();
    this.item3D = new Item3D();
    this.box = new Rectangle(0, 0, 0, 0);
    this.image = new Image(null, 0, 0, 0, 0);
    this.debug = false;
    this.itemdebugger = new ItemDebugger();
}

ItemCache.prototype.cacheItem = function(now, ctx, item, renderer, window, ox, oy, width, height, scale, quality) {

    item.translate(window, ox, oy, width, height, scale);

    var box = item.box;
    
    var x = box.x;
    var y = box.y;
    var w = box.width;
    var h = box.height;
    
    if (renderer.shouldThemeProject(item)) {
        this.item3D.renderItem3D(now, ctx, item, renderer, window, ox, oy, scale);
    }

    
    this.box.x = x;
    this.box.y = y;
    this.box.width = w;
    this.box.height = h;

    var pad = 0;
    var hpad = pad / 2;
    var qpad = pad * quality;
    var qhpad = qpad / 2;

    var spad = pad * scale;
    var shpad = spad / 2;

    var iw = item.width * quality;
    var ih = item.height * quality;
    

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
            cacheitem.canvas.width = iw + qpad;
            cacheitem.canvas.height = ih + qpad;
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
        
        this.image.draw(ctx, dx, dy, dw, dh);
    } else {
        item.render(now, ctx, window, x, y, quality * scale, renderer);
    }

    var debug = false;
    if (this.debug || item.debug || debug) {
        item.box.x = this.box.x;
        item.box.y = this.box.y;
        item.box.width = this.box.width;
        item.box.height = this.box.height;
        this.itemdebugger.debugItem(item, now, ctx, window, ox, oy, width, height, scale);
    }
}