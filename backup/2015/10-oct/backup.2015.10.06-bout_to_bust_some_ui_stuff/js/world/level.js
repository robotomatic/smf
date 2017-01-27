function Level(width, height) {
    this.width = width;
    this.height = height;
    this.background = "white";
    this.layers = new Array();
    this.layerCache = new Array();
    this.itemrenderer = null;
}

Level.prototype.loadJson = function(json) { 
    this.width = json.width;
    this.height = json.height;
    this.background = json.background;
    for (var layername in json.layers) {
        this.layers.push(new Layer().loadJson(json.layers[layername]));
    }
    return this;
}

Level.prototype.getWidth = function() { return this.width; }
Level.prototype.getHeight = function() { return this.height; }

Level.prototype.setItemRenderer = function(itemrenderer) { this.itemrenderer = itemrenderer; }

Level.prototype.cacheLayer = function(layer) {
    var layername = layer.name;
    var layerscale = layer.scale ? layer.scale : 1;
    var c = document.createElement('canvas');
    c.width  = this.width * layerscale;
    c.height = this.height * layerscale;
    var ctx = c.getContext("2d");
    if (layer.items) for (var i = 0; i < layer.items.length; i++) {
        var item = layer.items[i];
        var itemx = item.x;
        var itemwidth = item.width;
        if (item.width == "100%") {
            itemx = 0;
            itemwidth = c.width;
        }
        layer.drawItem(ctx, item, itemx, item.y, itemwidth * layerscale, item.height * layerscale, this.itemrenderer);            
    }
    if (layer.blur) blurCanvas(c, ctx, layer.blur);
    this.layerCache[layername] = c;
}

Level.prototype.collidePlayer = function(player) {
    if (this.layers) {
        for (var l in this.layers) {
            var layer = this.layers[l];
            layer.collidePlayer(player);
        }
    }
}