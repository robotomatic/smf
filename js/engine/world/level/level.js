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

Level.prototype.loadTheme = function(themename, theme, materials) { 
    var rt = this.itemrenderer.theme;
    if (!rt) {
        this.itemrenderer.theme = new Theme(themename); 
        this.itemrenderer.materials = materials; 
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
}

    
Level.prototype.update = function(now, delta) {
    if (!this.layers) return;
    var t = this.layerkeys.length;
    for (var i = 0; i < t; i++) this.layers[this.layerkeys[i]].update(now, delta, this.itemrenderer);
}


Level.prototype.reset = function(now) {
    this.itemrenderer.reset();
}