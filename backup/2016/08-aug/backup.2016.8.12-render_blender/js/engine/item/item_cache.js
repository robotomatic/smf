"use strict";

function ItemCache() {
    this.cache = new Array();
    
    // todo: centralize quality
    
    this.quality = 2;
    this.image = new Image();
}

ItemCache.prototype.cacheItem = function(ctx, item, window, renderer, scale, quality) {

    // todo: need to see if item can be 'stamped'
    var blur = item.blur;
    var parallax = item.parallax;
    
    var box = item.box;
    var x = box.x;
    var y = box.y;
    var width = box.width;
    var height = box.height;
    
    this.quality = quality ? quality : this.quality;
    
    if (blur) this.quality = blur;
    
    if (item.animate == true) return false;
    if (item.cache == false) return false;
    
    var cachename = item.id;
    var cacheitem = this.cache[cachename];
    
    var w = (item.width == "100%") ? width : item.width;
    var h = (item.height == "100%") ? height : item.height;
    
    if (!width || !height) {
        var mbr = item.getMbr();
        w = mbr.width;
        h = mbr.height;
        width = mbr.width * scale;
        height = mbr.height * scale;
    }

    var pad = 100;
    var qpad = pad * this.quality;
    
    w *= this.quality;
    h *= this.quality;
    
    
    if (!cacheitem) {
        cacheitem = {
            canvas : null,
            ctx : null,
            width : w,
            height: h,
            name : cachename
        }

        cacheitem.canvas = document.createElement('canvas');
        cacheitem.ctx = cacheitem.canvas.getContext("2d");
        cacheitem.canvas.width = w + qpad;
        cacheitem.canvas.height = h + qpad;
        this.cache[cachename] = cacheitem;

        var q = qpad / 2;
        var box = new Rectangle(q, q, w, h);

        if (renderer) renderer.drawItem(cacheitem.ctx, item.color, item, window, 0, 0, box, this.quality, false);
        else {
            ctx.fillStyle = item.color ? item.color : "magenta"; 
            var rect = new Rectangle(x, y, w, h);
            rect.draw(cacheitem.ctx); 
        }
    }
    
    
    var sx = 0;
    var sy = 0;
    var sw = w + qpad;
    var sh = h + qpad;

    var spad = pad * scale;

    var dx = x - (spad / 2);
    var dy = y - (spad / 2);

    var dw = width + spad;
    var dh = height + spad;

    this.image.data = cacheitem.canvas;
    this.image.x = sx;
    this.image.y = sy;
    this.image.width = sw;
    this.image.height = sh;
    this.image.draw(ctx, dx, dy, dw, dh);

    return true;
}