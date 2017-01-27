function Layer() {
    this.name;
    this.collide = false;
    this.physics = false;
    this.gravity = null;
    this.viscosity = null;
    this.damage = null;
    this.draw = true;
    this.drawdetails = true;
    this.preview = false;
    this.blur = false;
    this.scale = 1;
    this.cache = true;
    this.animate = false;
    this.lighten = false;
    this.parallax = 0;
    this.offsetx = 0;
    this.outline = false;
    this.outlinewidth = null;
    this.width = "";
    this.items;
    this.lastX;
    this.lastY;
    this.lastW;
    this.lastH;
    
    this.playercollisions = new Array();

    this.itemcache = new ItemCache();
}

Layer.prototype.loadJson = function(json) {
    this.name = json.name;
    this.collide = json.collide;
    this.physics = json.physics;
    this.gravity = json.gravity;
    this.viscosity = json.viscosity;
    this.damage = json.damage;
    this.draw = json.draw;
    this.drawdetails = (json.drawdetails === false) ? false : true;;
    this.preview = json.preview;
    this.blur = json.blur;
    this.scale = (json.scale) ? json.scale : 1;
    this.cache = (json.cache === false) ? false : true;
    this.animate = json.animate;
    this.lighten = json.lighten;
    this.parallax = json.parallax;
    this.offsetx = json.offsetx;
    this.outline = json.outline;
    this.outlinewidth = json.outlinewidth;
    this.width = json.width;
    this.items = json.items;
    return this;
}

Layer.prototype.update = function(step) { 
    if (this.items) {
        for (var i = 0; i < this.items.length; i++) {
            this.updateItem(step, this.items[i]);
        }
    }
}

Layer.prototype.updateItem = function(step, item) { 
    if (!item.actions) return;
    if (item.parts) {
        for (var part in item.parts) this.updateItem(step, item.parts[part]);
    }
}


Layer.prototype.getItems = function() { return this.items; }

Layer.prototype.drawItem = function(ctx, item, x, y, width, height, renderer, outline, outlinewidth, scale, cache) {
    if (!cache || !this.itemcache.cacheItem(ctx, item, x, y, width, height, renderer, outline, outlinewidth, scale, this.drawdetails)) {
        if (renderer) renderer.drawItem(ctx, item.color, item, x, y, width, height, this.lighten, outline, outlinewidth ? outlinewidth : this.outlinewidth, scale, this.drawdetails);
        else {
            ctx.fillStyle = item.color ? item.color : "magenta"; 
            drawRect(ctx, x, y, width, height); 
        }
    }
}

Layer.prototype.collidePlayer = function(player) {
    if (this.collide === false) return;

    this.playercollisions[player.id] = new Array();
    
    if (this.items) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            
            if (!item.collisions) item.collisions = new Array();
            
            if (item.collide === false) continue;
            
            item.gravity = this.gravity;
            item.viscosity = this.viscosity;
            item.damage = this.damage;
            
            var collision = player.collideWith(item);
            if (collision) {
                var dir = collision["vertical"] ? collision["vertical"].direction : collision["horizontal"].direction;
                var amt = collision["vertical"] ? collision["vertical"].amount : collision["horizontal"].amount;
                this.playercollisions[player.id][this.playercollisions[player.id].length] = {
                    item : item,
                    direction : dir,
                    amount : amt
                };
                
                item.collisions[player.id] = {
                    player: player,
                    dx : item.x - player.x,
                    dy : item.y - player.y
                }
            } else {
                item.collisions[player.id] = null;
            }
        }
    }
}