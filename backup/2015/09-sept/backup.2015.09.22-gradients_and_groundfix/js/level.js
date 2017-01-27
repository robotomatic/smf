function Level(width, height, background, items) {
    this.width = width;
    this.height = height;
    this.background = background;
    this.items = items;
}

Level.prototype.loadJson = function(json) { 
    for (var key in json) this[key] = json[key]; 
    return this;
}

Level.prototype.getWidth = function() { return this.width; }
Level.prototype.getHeight = function() { return this.height; }

Level.prototype.getBackground = function() { return this.background; }
Level.prototype.getItems = function() { return this.items; }