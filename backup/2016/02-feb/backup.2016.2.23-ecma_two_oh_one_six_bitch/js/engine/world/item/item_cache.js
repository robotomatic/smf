"use strict";

function ItemCache() {
    this.cache = new Array();
}

ItemCache.prototype.cacheItem = function(ctx, item, x, y, width, height, renderer, scale, details) {

    // todo: need to see if item can be 'stamped'
    
    
    if (item.animate == true) return false;
    if (item.cache == false) return false;
    
    let cachename = item.id;
    let cacheitem = this.cache[cachename];
    
    let w = item.width;
    let h = item.height;
    if (!width || !height) {
        let mbr = item.getMbr();
        w = mbr.width;
        h = mbr.height;
        width = mbr.width * scale;
        height = mbr.height * scale;
    }

    if (cacheitem) {
        let pad = 100 * scale;
        ctx.drawImage(cacheitem.canvas, x - pad, y - pad, width + (pad * 2), height + (pad * 2));
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
    cacheitem.canvas.width = w + 200;
    cacheitem.canvas.height = h + 200;
    this.cache[cachename] = cacheitem;
    if (renderer) renderer.drawItem(cacheitem.ctx, item.color, item, 100, 100, w, h, 1, details);
    else {
        ctx.fillStyle = item.color ? item.color : "magenta"; 
        drawRect(cacheitem.ctx, x, y, w, h); 
    }
    ctx.drawImage(cacheitem.canvas, x, y, width, height);
    return true;
}