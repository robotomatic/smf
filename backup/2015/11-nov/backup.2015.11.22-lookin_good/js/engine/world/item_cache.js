ItemCache = function() {
    this.cache = new Array();
}

ItemCache.prototype.cacheItem = function(ctx, item, x, y, width, height, renderer, outline, outlinewidth, scale, details) {
    
    if (item.animate) return false;
    if (!item.cache) return false;
    
    var itemtype = item.itemtype;
    if (!itemtype) return false;
            
    var needrender = false;

    var cachename = itemtype;

    if (item.ramp) cachename += "-" + item.ramp;
    if (outline === true) cachename += "-outline";

    var cacheitem = this.cache[cachename];

    if (cacheitem) {
        ctx.drawImage(cacheitem.canvas, x, y, width, height);
    } else {
        cacheitem = {
            canvas : null,
            ctx : null,
            width : item.width,
            height: item.height,
            name : cachename
        }
        cacheitem.canvas = document.createElement('canvas');
        cacheitem.ctx = cacheitem.canvas.getContext("2d");
        cacheitem.canvas.width = item.width;
        cacheitem.canvas.height = item.height;
        this.cache[cachename] = cacheitem;
        needrender = true;
    }
    if (needrender) {
        if (renderer) renderer.drawItem(cacheitem.ctx, item.color, item, 0, 0, item.width, item.height, this.lighten, outline, outlinewidth ? outlinewidth : this.outlinewidth, scale, details);
        else {
            ctx.fillStyle = item.color ? item.color : "magenta"; 
            drawRect(cacheitem.ctx, x, y, width, height); 
        }
    }
    ctx.drawImage(cacheitem.canvas, x, y, width, height);
    
    return true;
}