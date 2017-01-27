"use strict"

/*

    todo:


        - fade colors on blur canvas

        - make graphics an object

        - speed up blurrrrrrr
        - fix draw order
                
        
        - better specificity for which edges to draw - i.e. platform backgrounds need top edges
        - draw shadders under top edge
        - player can fall off left side of level
        
        
        - stage_flood.js is just pure bullshit. rewrite properly
        - clip items at waterline
        - option to make liquid transparent...need to use render mask with graident. would look supercool
        - draw liquid wave effects

*/

function StageRenderer() {
    
    this.renderpad = 250;
    
    this.renderitems = {
        all : new Array(),
        left : new Array(),
        middle : new Array(),
        right : new Array()
    }
    
    this.itemcache = new ItemCache();
    this.flood = new StageFlood();
}

StageRenderer.prototype.reset = function(now) {
    this.renderitems.all.length = 0;
    this.renderitems.left.length = 0;
    this.renderitems.middle.length = 0;
    this.renderitems.right.length = 0;
    this.itemcache.reset();
}

StageRenderer.prototype.render = function(now, graphics, stage, window, x, y, scale, levelquality, playerquality) {
    this.renderStart(graphics, stage);
    this.renderRender(now, graphics, stage, window, x, y, scale, levelquality, playerquality);
    this.renderEnd(graphics, window);
}

StageRenderer.prototype.renderStart = function(graphics, stage) {
    this.clearGraphics(graphics);
    var level = stage.level;
    if (level.flood) this.flood.init();
    if (this.renderitems.all.length == 0) {
        var t = level.layers.length;
        for (var i = 0; i < t; i++) {
            var layer = level.layers[i];
            if (layer.draw === false) continue;
            this.renderitems.all = this.renderitems.all.concat(layer.items.items);
        }
        this.renderitems.all.sort(sortByZIndex);
    }
}

StageRenderer.prototype.clearGraphics = function(graphics) { 
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        clearRect(g.ctx, 0, 0, g.canvas.width, g.canvas.height);
    }
}

StageRenderer.prototype.renderRender = function(now, graphics, stage, window, x, y, scale, levelquality, playerquality) {
    this.renderItems(now, graphics, stage, window, this.renderitems.all, x, y, scale, levelquality, playerquality, true);
}
    
StageRenderer.prototype.renderItems = function(now, graphics, stage, window, items, x, y, scale, levelquality, playerquality, drawplayers) {

    var renderer = stage.level.itemrenderer;
    var flood = stage.level.flood;
    
    var t = items.length;
    for (var i = 0; i < t; i++) {
        var item = items[i];
        item.smooth();
        if (item.zindex !== undefined && item.zindex > 999) continue;
        if (!item.isVisible(window, this.renderpad)) continue;
        this.renderItemsItem(now, graphics, window, x, y, scale, levelquality, renderer, item, flood);
    }

    if (drawplayers) {
        var ctx = graphics.main.ctx;
        var players = stage.players;
        if (players && players.players) {
            var pt = players.players.length;
            for (var pi = 0; pi < pt; pi++) {
                var rp = players.players[pi];
                players.renderPlayer(now, window, ctx, rp, x, y, scale, playerquality);
            }
        }
    }
    
    for (var ii = 0; ii < t; ii++) {
        var item = items[ii];
        if (item.zindex !== undefined && item.zindex <= 999) continue;
        if (!item.isVisible(window, this.renderpad)) continue;
        this.renderItemsItem(now, graphics, window, x, y, scale, levelquality, renderer, item, flood);
    }
}

StageRenderer.prototype.renderItemsItem = function(now, graphics, window, x, y, scale, quality, renderer, item, flood) {
    if (item.iteminfo && item.iteminfo.flood) return;
    var g = item.graphics ? graphics[item.graphics] : graphics.main;
    var ctx = g.ctx;
    var width = g.canvas.width;
    var height = g.canvas.height;
    if (g.scale) scale /= g.scale;
    if (g.quality) quality *= g.quality;
    this.itemcache.cacheItem(now, ctx, item, renderer, window, x, y, width, height, scale, quality);
    
    this.flood.renderItemFlood(now, graphics, window, x, y, scale, quality, renderer, item, flood);
}


StageRenderer.prototype.renderEnd = function(graphics, window) {
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        if (g.blur) {
            blurCanvas(g.canvas, g.ctx, g.blur);
        }
    }
}