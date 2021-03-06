"use strict";

function ItemCache() {
    this.cache = new Array();
    
    // todo: centralize quality
    
    this.quality = 2;
}

ItemCache.prototype.cacheItem = function(ctx, item, x, y, width, height, renderer, scale, details, quality) {

    // todo: need to see if item can be 'stamped'

    this.quality = quality;
    
    if (item.animate == true) return false;
    if (item.cache == false) return false;
    
    var cachename = item.id;
    var cacheitem = this.cache[cachename];
    
    
    var w = item.width;
    var h = item.height;
    
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
        var dh = height+ spad;
        
        ctx.drawImage(cacheitem.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
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
        drawRect(cacheitem.ctx, x, y, w, h); 
    }

    return true;
}