"use strict";

function ItemCache() {
    this.cache = new Array();
    
    // todo: centralize quality
    
    this.quality = 2;
}

ItemCache.prototype.cacheItem = function(ctx, item, x, y, width, height, renderer, scale, details, quality) {

    // todo: need to see if item can be 'stamped'

    this.quality = quality ? quality : this.quality;
    
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
    
    
    if (cacheitem) {
        
        var sx = 0;
        var sy = 0;
        var sw = w + qpad;
        var sh = h + qpad;
        
        var spad = pad * scale;
        
        var dx = x - (spad / 2);
        var dy = y - (spad / 2);

        
        var dw = width + spad;
        var dh = height + spad;
        
        if (item.width == "100%") {
            var debug = true;
        }
        
        
        var img = new Image(cacheitem.canvas, sx, sy, sw, sh);
        img.draw(ctx, dx, dy, dw, dh);
        
        return true; 
    }

    //console.log(cachename);
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
    if (renderer) renderer.drawItem(cacheitem.ctx, item.color, item, qpad / 2, qpad / 2, w, h, this.quality, details);
    else {
        ctx.fillStyle = item.color ? item.color : "magenta"; 
        var rect = new Rectangle(x, y, w, h);
        rect.draw(cacheitem.ctx); 
    }

    return true;
}