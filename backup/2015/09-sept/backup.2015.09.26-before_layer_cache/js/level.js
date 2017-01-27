function Level(width, height) {
    this.width = width;
    this.height = height;
    this.background = "white";
    this.layers = new Array();
}

Level.prototype.loadJson = function(json) { 
    this.width = json.width;
    this.height = json.height;
    this.background = json.background;
    for (var layer in json.layers) {
        this.layers.push(new Layer().loadJson(json.layers[layer]));
    }
    return this;
}

Level.prototype.getWidth = function() { return this.width; }
Level.prototype.getHeight = function() { return this.height; }