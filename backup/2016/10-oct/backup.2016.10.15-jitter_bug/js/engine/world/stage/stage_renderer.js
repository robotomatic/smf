"use strict"

function StageRenderer() {
    
    this.renderpad = 500;
    
    this.renderitems = {
        all : new Array(),
        z : new Array()
    }
    
    this.itemcache = new ItemCache();
    this.flood = new StageFlood();
    this.doflood = false;
    this.np = new Point(0, 0);
}

StageRenderer.prototype.reset = function(now) {
    this.renderitems.all.length = 0;
    this.renderitems.z.length = 0;
    this.itemcache.reset();
}

StageRenderer.prototype.render = function(now, graphics, stage, window, levelquality, playerquality) {
    this.renderStart(window, graphics, stage);
    this.renderRender(now, graphics, stage, window, levelquality, playerquality);
    this.renderEnd(graphics, window);
}

StageRenderer.prototype.renderStart = function(window, graphics, stage) {

    this.clearGraphics(graphics);
    
    var level = stage.level;
    if (level.flood) {
        this.flood.init(level.flood.y);
        this.doflood = true;
        
    } else {
        this.doflood = false;
    }

    // fix pillar problem by making item parts that are not glommed into poly
    // even better make glommed items into glom group in file
    
    
    this.renderitems.all.length = 0;

    var t = level.layers.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[i];
        if (layer.draw === false) continue;

        var tt = layer.items.items.length;
        for (var ii = 0; ii < tt; ii++) {
            var it = layer.items.items[ii];
            if (it.draw == false) continue;
            var mbr = it.getMbr();
            var ni = {
                type : "item",
                x : it.x,
                y : it.y,
                z : it.z,
                width : mbr.width,
                height : mbr.height,
                depth : it.depth,
                item: it
            }
            this.renderitems.all[this.renderitems.all.length] = ni;
        }
    }

    var players = stage.players;
    if (players && players.players) {
        var pt = players.players.length;
        for (var pi = 0; pi < pt; pi++) {
            var rp = players.players[pi];
            var np = {
                type : "player",
                x : rp.controller.x,
                y : rp.controller.y,
                z : rp.controller.z,
                width : rp.controller.width,
                height : rp.controller.height,
                depth : rp.controller.depth,
                item : rp
            }
            this.renderitems.all[this.renderitems.all.length] = np;
        }
    }

    this.renderitems.all.sort(sortByZDepth);
//    this.renderitems.all.sort(sortByZ);
    

    var cp = window.getCenter();
    
    this.renderitems.z = new Array();
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var item = this.renderitems.all[i];
        var iz = "z-" + Number(item.z + item.depth);
        if (!this.renderitems.z[iz]) {
            this.renderitems.z[iz] = {
                left : new Array(),
                center : new Array(),
                right : new Array()
            }
        };
        var side = "center";
        if (item.x > cp.x) side = "right";
        else if (item.x + item.width < cp.x) side = "left";
        this.renderitems.z[iz][side][this.renderitems.z[iz][side].length] = item;
    }
}

    
    
    
    
StageRenderer.prototype.clearGraphics = function(graphics) { 
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        clearRect(g.ctx, 0, 0, g.canvas.width, g.canvas.height);
        g.ctx.beginPath();
    }
}









StageRenderer.prototype.renderRender = function(now, graphics, stage, window, levelquality, playerquality) {
    var items = this.renderitems.z;
    var keys = Object.keys(items);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var zitems = items[keys[i]];
        this.renderItemsZSide(now, graphics, stage, window, zitems, levelquality, playerquality);
    }
}
    
StageRenderer.prototype.renderItemsZSide = function(now, graphics, stage, window, zitems, levelquality, playerquality) {
    
    var leftitems = zitems["left"];
    leftitems.sort(sortByX);
    this.renderItemsZSideItems(now, graphics, stage, window, leftitems, levelquality, playerquality);
    
    var rightitems = zitems["right"];
    rightitems.sort(sortByXReverse);
    this.renderItemsZSideItems(now, graphics, stage, window, rightitems, levelquality, playerquality);
    
    var centeritems = zitems["center"];
    this.renderItemsZSideItems(now, graphics, stage, window, centeritems, levelquality, playerquality);
    
}

StageRenderer.prototype.renderItemsZSideItems = function(now, graphics, stage, window, zsideitems, levelquality, playerquality) {
    var renderer = stage.level.itemrenderer;
    var g = graphics["main"];
    var t = zsideitems.length;
    for (var i = 0; i < t; i++) {
        var it = zsideitems[i];
        if (it.type == "item") this.renderItem(now, g, window, levelquality, renderer, it.item);
        else if (it.type == "player") this.renderPlayer(now, g, stage.players, it.item, window, playerquality);
    }
}




StageRenderer.prototype.renderItem = function(now, g, window, quality, renderer, item) {

    item.smooth();

    var scale = window.scale;
    
    var ctx = g.ctx;
    var width = g.canvas.width;
    var height = g.canvas.height;
    
    var floodlevel = null;
    if (!(item.iteminfo && item.iteminfo.flood)) {
        if (this.doflood) {
            var mbr = item.getMbr();
            floodlevel = this.flood.getFlood();
            if (item.width != "100%" && item.depth && item.y + mbr.height >= floodlevel) {
                var ip = item.getLocation();
                var ix = (ip.x - window.x) * scale;
                var iy = (floodlevel - window.y) * scale;
                this.np.x = ix;
                this.np.y = iy;
                var iz = ((item.z || 0) - window.z)  * scale;
                this.np = projectPoint3D(this.np, iz, scale, window.x, window.y, window.getCenter(), this.np);
                floodlevel = round(this.np.y);
            }
        }
    }
    
    item.translate(window, width, height);

    if (!item.isVisible(window, this.renderpad)) return;

    this.itemcache.cacheItem(now, ctx, item, renderer, window, width, height, quality, floodlevel);
}

StageRenderer.prototype.renderPlayer = function(now, graphics, players, player, window, playerquality) {
    var scale = window.scale;
    var floodlevel = null;
    if (this.doflood) {
        floodlevel = this.flood.getFlood();
        if (player.controller.y + player.controller.height >= floodlevel) {
            var pz = (player.controller.z - window.z)  * scale;
            this.np = projectPoint3D(this.np, pz, scale, window.x, window.y, window.getCenter(), this.np);
            floodlevel = round(this.np.y);
        }
    }
    players.renderPlayer(now, window, graphics, player, playerquality, floodlevel);
}





StageRenderer.prototype.renderEnd = function(graphics, window) {
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        if (g.blur) blurCanvas(g.canvas, g.ctx, g.blur);
    }
}