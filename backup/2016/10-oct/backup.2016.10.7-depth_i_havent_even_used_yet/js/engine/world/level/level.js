"use strict";

function Level(width, height) {
    this.name = "";
    this.theme = "";
    this.width = width;
    this.height = height;
    
    this.debug = true;
    
    this.zoompad;
    this.gravity;
    this.speed;
    this.jumpspeed;
    
    this.loaded = false;
    this.loadedfiles = 0;
    
    this.layers = new Array();
    this.layerkeys = new Array();
    this.itemrenderer = new ItemRenderer();
    
    this.rect = new Rectangle(0, 0, 0, 0);
    this.text = new Text(0, 0, "");
    
    this.flood = false;
    
    this.colliders = new Array();
    
}

Level.prototype.loadJson = function(json) { 
    this.name = json.name;
    this.theme = json.theme;
    this.width = json.width;
    this.height = json.height;
    
    this.debug = json.debug;
//    
//    this.zoompad = json.zoompad;
//    this.gravity = json.gravity;
//    this.speed = json.speed;
//    this.jumpspeed = json.jumpspeed;
    
    return this;
}

Level.prototype.loadLayers = function(layers) { 
    for (var layername in layers) {
        this.layers.push(new Layer().loadJson(layers[layername]));
    }
    this.layerkeys = Object.keys(this.layers);
    this.loaded = true;
}
    
Level.prototype.layersLoaded = function() { 
    this.layers.sort(sortByZIndex);
    this.layerkeys = Object.keys(this.layers);
    
    
    
    this.loaded = true;
}

Level.prototype.getWidth = function() { return this.width; }
Level.prototype.getHeight = function() { return this.height; }

Level.prototype.loadTheme = function(themename, theme) { 
    var rt = this.itemrenderer.theme;
    if (!rt) {
        this.itemrenderer.theme = new Theme(themename); 
        this.itemrenderer.theme.background = theme.background;
        this.itemrenderer.theme.items = JSON.parse(JSON.stringify(theme.items));
        return;
    }
    var bg = theme.background;
    if (bg) rt.background = bg;
    var keys = Object.keys(theme.items);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var itemname = keys[i];
        var item = theme.items[itemname];
        rt.items[itemname] = JSON.parse(JSON.stringify(item));
    }
    
    
    this.buildItems();
    this.buildColliders();
}

Level.prototype.buildItems = function() {
    if (!this.layers) return;
    var t = this.layerkeys.length;
    for (var i = 0; i < t; i++) {
        var layer = this.layers[this.layerkeys[i]];
        layer.buildItems(this.itemrenderer);
        if (layer.flood) this.flood = layer.flood;
    }
}

Level.prototype.buildColliders = function() {
    this.colliders.length = 0;
    if (!this.layers) return;
    var t = this.layerkeys.length;
    for (var i = 0; i < t; i++) {
        var layer = this.layers[this.layerkeys[i]];
        this.buildLayerColliders(layer);
    }
}

Level.prototype.buildLayerColliders = function(layer) {
    if (layer.collider === false) return;
    layer.buildColliders();
    this.colliders = this.colliders.concat(layer.colliders);
}
    
Level.prototype.update = function(now, delta) {
    if (!this.layers) return;
    var t = this.layerkeys.length;
    for (var i = 0; i < t; i++) this.layers[this.layerkeys[i]].update(now, delta, this.itemrenderer);
}


Level.prototype.reset = function(now) {
    this.itemrenderer.reset();
}




// todo: move collision code to level_collider or item_collider or something or both





    
    
    
    



Level.prototype.collidePlayer = function(player) {
    if (!this.layers) return;
    player.resetCollisions();
    var t = this.layerkeys.length;
    for (var i = 0; i < t; i++) {
        var l = this.layerkeys[i];
        var layer = this.layers[l];
        layer.collidePlayer(player, this.width, this.height);
    }
    
    if (player.controller.x < 0) player.controller.x = 0;
    if (player.controller.x + player.controller.width > this.width) player.controller.x = this.width - player.controller.width;
    if (player.controller.y < 0) player.controller.y = 0;
    if (player.controller.y + player.controller.height > this.height) {
        player.info.die();
    }

    player.updateLevelCollisions();
}








Level.prototype.resetPlayer = function(player, timeout) {
    
    player.controller.stop();
    
    var t = this.colliders.length;
    var r = random(0, t - 1);
    var spawnitem = this.colliders[r];
    var box = spawnitem.getMbr();
    var rpx = random(box.x + 10, box.x + box.width - 10);
    var rpy = box.y - 20;
    var rpz = random(10, spawnitem.depth - 10) + spawnitem.z;
    player.respawn(rpx, rpy, rpz);
    player.reset();
}








