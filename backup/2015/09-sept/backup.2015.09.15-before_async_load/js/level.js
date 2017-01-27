function Level(width, height, items) {
    this.width = width;
    this.height = height;
    this.items = items;
}

/* todo: load from file
Level.prototype.load = function(file) {
    
    var parsed = JSON.parse(json);
    var arr = [];
    for(var x in parsed) arr.push(parsed[x]);
}
*/

Level.prototype.getWidth = function() { return this.width; }
Level.prototype.getHeight = function() { return this.height; }

Level.prototype.getItems = function() { return this.items; }