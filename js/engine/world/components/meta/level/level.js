"use strict";

function Level(width, height, depth) {
    this.name = "";
    this.pad = 0;
    this.theme = "";
    this.loaded = false;
    this.loadedfiles = 0;
    this.layers = new Array();
    this.layerkeys = new Array();
}

Level.prototype.loadJson = function(json) { 
    this.name = json.name;
    this.pad = json.pad;
    this.theme = json.theme;
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