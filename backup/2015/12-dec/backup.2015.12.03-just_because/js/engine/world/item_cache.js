ItemCache = function() {
    this.cache = new Array();
}

ItemCache.prototype.cacheItem = function(ctx, item, x, y, width, height, renderer, scale, details) {

    // todo: need to see if item can be 'stamped'
    
    
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

    if (cacheitem) {
        ctx.drawImage(cacheitem.canvas, x, y, width, height);
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
    cacheitem.canvas.width = w;
    cacheitem.canvas.height = h;
    this.cache[cachename] = cacheitem;
    if (renderer) renderer.drawItem(cacheitem.ctx, item.color, item, 0, 0, w, h, 1, details);
    else {
        ctx.fillStyle = item.color ? item.color : "magenta"; 
        drawRect(cacheitem.ctx, x, y, w, h); 
    }
    ctx.drawImage(cacheitem.canvas, x, y, width, height);
    return true;
}