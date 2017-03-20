"use strict";

function Level(width, height, depth) {
    this.name = "";
    this.theme = "";
    this.width = width ? width : 0;
    this.height = height ? height : 0;
    this.depth = depth ? depth : 0;
    
    this.debug = true;
    
    this.zoompad;
    this.gravity;
    this.speed;
    this.jumpspeed;
    
    this.loaded = false;
    this.loadedfiles = 0;
    
    this.layers = new Array();
    this.layerkeys = new Array();
    
    this.rect = new Rectangle(0, 0, 0, 0);
    this.text = new Text(0, 0, "");
}

Level.prototype.loadJson = function(json) { 
    this.name = json.name;
    this.theme = json.theme;
    this.width = json.width;
    this.height = json.height;
    this.depth = json.depth;
    this.debug = json.debug;
    return this;
}

Level.prototype.reset = function() { 
    this.layers.length = 0;
    this.layerkeys.length = 0;
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

Level.prototype.getWidth = function() { 
    return this.width; 
}

Level.prototype.getHeight = function() { 
    return this.height; 
}