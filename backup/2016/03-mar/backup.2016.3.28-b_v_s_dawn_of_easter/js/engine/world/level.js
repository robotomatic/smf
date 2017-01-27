"use strict";

function Level(width, height) {
    this.name = "";
    this.theme = "";
    this.width = width;
    this.height = height;
    
    this.debug = false;
    
    this.zoompad;
    this.gravity;
    this.speed;
    this.jumpspeed;
    
    this.layers = new Array();
    this.layerkeys = new Array();
    this.layerCache = new Array();
    this.itemrenderer = new ItemRenderer();
}

Level.prototype.loadJson = function(json) { 
    this.name = json.name;
    this.theme = json.theme;
    this.width = json.width;
    this.height = json.height;
    
    this.debug = json.debug;
    
    this.zoompad = json.zoompad;
    this.gravity = json.gravity;
    this.speed = json.speed;
    this.jumpspeed = json.jumpspeed;
    
    for (var layername in json.layers) {
        this.layers.push(new Layer().loadJson(json.layers[layername]));
    }
    this.layerkeys = Object.keys(this.layers);
    
    return this;
}

Level.prototype.getWidth = function() { return this.width; }
Level.prototype.getHeight = function() { return this.height; }

Level.prototype.setTheme = function(theme) { this.itemrenderer.theme = theme; }


Level.prototype.update = function(now, step) {
    if (this.layers) {
        for (var i = 0; i < this.layerkeys.length; i++) {
            var l = this.layerkeys[i];
            var layer = this.layers[l];
            layer.update(now, step);
        }
    }
}

Level.prototype.cacheLayer = function(layer) {
    if (layer.cache != true) return;
    var layername = layer.name;
    var layerscale = layer.scale ? layer.scale : 1;
    var c = document.createElement('canvas');
    
    layerscale = .25;
    
    c.width  = this.width * layerscale;
    c.height = this.height * layerscale;
    var ctx = c.getContext("2d");
    
    if (layer.items) {
        for (var i = 0; i < layer.items.length; i++) {
            var item = layer.items[i];
            var itemx = item.x * layerscale;
            var itemwidth = item.width;
            if (item.width == "100%") {
                itemx = 0;
                itemwidth = c.width;
            } else {
                itemwidth = itemwidth * layerscale;
            }
            var itemy = item.y * layerscale;
            var itemheight = item.height;
            if (item.height == "100%") {
                itemy = 0;
                itemheight = this.height;
            } else {
                itemheight = itemheight * layerscale;
            }
            layer.drawItem(ctx, item, itemx, itemy, itemwidth, itemheight, this.itemrenderer, 1, false);            
        }
    }
    
    //if (layer.blur) blurCanvas(c, ctx, layer.blur);
    this.layerCache[layername] = c;
}

Level.prototype.collidePlayer = function(player) {
    player.resetLevelCollisions();
    if (this.layers) {
        for (var i = 0; i < this.layerkeys.length; i++) {
            var l = this.layerkeys[i];
            var layer = this.layers[l];
            layer.collidePlayer(player);
        }
    }
    
//    if (player.y > this.height) player.die();
}



Level.prototype.resetPlayer = function(player, timeout) {
    
    
    player.stop();

    // todo:
    // - look for spawn zones first
    
    
    var lw = this.width / 2;
    var py = 50;
    var px;
    var safe = false;
    while (!safe) {
        px = random(0, lw) + (lw / 2);
        var sp = new Point(px, py);
        safe = this.checkPlayerSpawnPoint(player, sp);
        if (safe) {
            px = safe.x;
            break;
        }
    }

    player.respawn(px, py);
    player.reset();
}

Level.prototype.checkPlayerSpawnPoint = function(player, spawnpoint) {
    var safe = false;
    var lh = this.height;
    var pw = player.width;
    var px = spawnpoint.x;
    var rect = new Rectangle(px + ( pw / 2), 20, pw * 2, lh - 50);
    for (var i = 0; i < this.layers.length; i++) {
        var layer = this.layers[i];
        if (!layer.collide || layer.draw == false) continue;
        for (var ii = 0; ii < layer.items.length; ii++) {

            var item = layer.items[ii];
            
            if (item.draw === false) continue;
            
            if (item.damage || item.gravity || item.viscosity || item.physics || item.actions) continue;
            
            var col = collideRough(rect, item);
            if (col) {
                
                var ix = item.x;
                var iw = item.width;
                
                var buffer = pw * 2;
                var npx = px;
  
                // todo: make sure no other players are on selected item
                // todo: dropping in the drink sometimes

                if ((Math.abs(ix - px) < buffer) || (Math.abs((ix + iw) - px) < buffer)) {
                    // todo: still hanging off edge sometimes...
                    npx = ix + (iw / 2) - (pw / 2);
                }
                
                safe = new Point(npx, item.y);
                break;
            }
        }
    }
    return safe;
}