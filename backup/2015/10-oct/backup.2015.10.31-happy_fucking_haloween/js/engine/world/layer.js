function Layer() {
    this.name;
    this.collide = false;
    this.draw = true;
    this.blur = false;
    this.scale = 1;
    this.cache = true;
    this.lighten = false;
    this.parallax = 0;
    this.outline = false;
    this.outlinewidth = null;
    this.width = "";
    this.items;
    this.lastX;
    this.lastY;
    this.lastW;
    this.lastH;
    
    this.playercollisions = new Array();
    this.itemcache = new Array();
}

Layer.prototype.loadJson = function(json) {
    this.name = json.name;
    this.collide = json.collide;
    this.draw = json.draw;
    this.blur = json.blur;
    this.scale = (json.scale) ? json.scale : 1;
    this.cache = (json.cache === false) ? false : true;
    this.lighten = json.lighten;
    this.parallax = json.parallax;
    this.outline = json.outline;
    this.outlinewidth = json.outlinewidth;
    this.width = json.width;
    this.items = json.items;
    return this;
}

Layer.prototype.getItems = function() { return this.items; }

Layer.prototype.drawItem = function(ctx, item, x, y, width, height, renderer, outline, outlinewidth, scale, cache) {
    if (cache) {
        var itemtype = item.itemtype;
        if (itemtype) {
            
            var needrender = false;
            
            var itemwidth = clamp(width);
            var itemheight = clamp(height);
            
            var cachename = itemtype + "-" + clamp(item.width) + "-" + outline;
            var cacheitem = this.itemcache[cachename];
            
            if (cacheitem) {
                var cachewidth = cacheitem.width;
                
                
                // todo: can fuzz this a bit
                
                if (cachewidth == itemwidth) {
                    ctx.drawImage(cacheitem.canvas, x, y, width, height);
                } else {
                    cacheitem.canvas.width = itemwidth;
                    cacheitem.canvas.height = itemheight;
                    cacheitem.width = itemwidth;
                    cacheitem.height = itemheight;
                    needrender = true;
                }
            } else {
                cacheitem = {
                    canvas : null,
                    ctx : null,
                    width : itemwidth,
                    height: itemheight,
                    name : cachename
                }
                cacheitem.canvas = document.createElement('canvas');
                cacheitem.ctx = cacheitem.canvas.getContext("2d");
                cacheitem.canvas.width = itemwidth;
                cacheitem.canvas.height = itemheight;
                this.itemcache[cachename] = cacheitem;
                needrender = true;
            }
            if (needrender) {
                if (renderer) renderer.drawItem(cacheitem.ctx, item.color, item, x, y, width, height, this.lighten, outline, outlinewidth ? outlinewidth : this.outlinewidth, scale);
                else {
                    ctx.fillStyle = item.color ? item.color : "magenta"; 
                    drawRect(cacheitem.ctx, x, y, width, height); 
                }
            }

            ctx.drawImage(cacheitem.canvas, x, y, width, height);
        }
    }
    if (renderer) renderer.drawItem(ctx, item.color, item, x, y, width, height, this.lighten, outline, outlinewidth ? outlinewidth : this.outlinewidth, scale);
    else {
        ctx.fillStyle = item.color ? item.color : "magenta"; 
        drawRect(ctx, x, y, width, height); 
    }
}

Layer.prototype.collidePlayer = function(player) {
    if (this.collide === false) return;

    this.playercollisions[player.id] = new Array();
    
    if (this.items) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (item.collide === false) continue;
            var collision = player.collideWith(item);
            if (collision) {
                var dir = collision["vertical"] ? collision["vertical"].direction : collision["horizontal"].direction;
                var amt = collision["vertical"] ? collision["vertical"].amount : collision["horizontal"].amount;
                this.playercollisions[player.id][this.playercollisions[player.id].length] = {
                    item : item,
                    direction : dir,
                    amount : amt
                };
            }
        }
    }
}