"use strict"

function StageRenderer() {
    
    this.renderitems = {
        all : new Array(),
        above : {
            all : new Array(),
            left : new Array(),
            center : new Array(),
            right : new Array()
        },
        center : {
            all : new Array(),
            left : new Array(),
            center : new Array(),
            right : new Array()
        },
        below : {
            all : new Array(),
            left : new Array(),
            center : new Array(),
            right : new Array()
        }
    }
    
    this.itemcache = new ItemCache();
    this.flood = new StageFlood();
    this.doflood = false;
    this.np = new Point(0, 0);
    this.line = new Line(new Point(0, 0), new Point(0, 0));

    this.renderfirst = new Array();
    
    this.debug = false;
}

StageRenderer.prototype.reset = function(now) {
    this.renderitems.all.length = 0;
    this.renderitems.z.length = 0;
    this.itemcache.reset();
}

StageRenderer.prototype.render = function(now, graphics, stage, mbr, window, levelquality, playerquality) {
    this.renderStart(mbr, window, graphics, stage);
    this.renderRender(now, graphics, stage, mbr, window, levelquality, playerquality);
    this.renderEnd(graphics, mbr);
}

StageRenderer.prototype.renderStart = function(mbr, window, graphics, stage) {
    this.clearGraphics(graphics);
    this.getFlood(stage);
    this.getAllItems(mbr, window, graphics, stage);
    this.sortItemsVertical(window);
}

StageRenderer.prototype.clearGraphics = function(graphics) { 
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        clearRect(g.ctx, 0, 0, g.canvas.width, g.canvas.height);
        g.ctx.beginPath();
    }
}

StageRenderer.prototype.getFlood = function(stage) {
    this.doflood = false;
    var level = stage.level;
    if (level.flood) {
        this.flood.init(level.flood.y);
        this.doflood = true;
    }
}





StageRenderer.prototype.getAllItems = function(mbr, window, graphics, stage) {
    this.renderitems.all.length = 0;
    this.getAllItemsItems(mbr, window, graphics, stage.level);
    this.getAllItemsPlayers(mbr, window, graphics, stage);
}

StageRenderer.prototype.getAllItemsItems = function(mbr, window, graphics, level) {
    var g = graphics["main"];
    var width = g.canvas.width;
    var height = g.canvas.height;
    this.renderfirst.length = 0;
    var t = level.layers.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[i];
        if (layer.draw === false) continue;
        var tt = layer.items.items.length;
        for (var ii = 0; ii < tt; ii++) {
            var it = layer.items.items[ii];
            if (it.draw == false) continue;
            
            it.smooth();
            it.translate(mbr, width, height);
            
            // todo: can test for view here?
            
            if (it.width == "100%") {
                this.renderfirst.push(it);
                continue;
            }
            
            var pad = 10;
            
            var itmbr = it.box;
            var ni = {
                type : "item",
                x : itmbr.x - pad,
                y : itmbr.y - pad,
                z : itmbr.z,
                width : itmbr.width + (pad * 2),
                height : itmbr.height + (pad * 2),
                depth : itmbr.depth,
                zdepth : round(itmbr.z + itmbr.depth),
                mbr : it.getMbr(),
                item: it
            }
            this.renderitems.all[this.renderitems.all.length] = ni;
        }
    }
}

StageRenderer.prototype.getAllItemsPlayers = function(mbr, window, graphics, stage) {
    var players = stage.players;
    if (players && players.players) {
        var pt = players.players.length;
        for (var pi = 0; pi < pt; pi++) {
            var rp = players.players[pi];
            var rpb = rp.box;
 
            var pad = 100;

            // todo: add smooth and translate here?
            // todo: can test for view here?
            
            var np = {
                type : "player",
                x : rpb.x - pad,
                y : rpb.y - pad,
                z : rpb.z,
                width : rpb.width + (pad * 2),
                height : rpb.height + pad,
                depth : rpb.depth,
                zdepth : round(rpb.z + rpb.depth),
                mbr : rp.getMbr(),
                item : rp
            }
            this.renderitems.all[this.renderitems.all.length] = np;
        }
    }
}
    
























StageRenderer.prototype.sortItemsVertical = function(window) {
    var cp = window.getCenter();
    this.renderitems.above.all.length = 0;
    this.renderitems.center.all.length = 0;
    this.renderitems.below.all.length = 0;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var item = this.renderitems.all[i];
        var side = "center";
        if (item.y > cp.y) side = "below";
        else if (item.y + item.height < cp.y) side = "above";
        this.renderitems[side].all[this.renderitems[side].all.length] = item;
    }
    this.sortItemsVerticalHorizontal(this.renderitems.above, cp);
    this.sortItemsVerticalHorizontal(this.renderitems.center, cp);
    this.sortItemsVerticalHorizontal(this.renderitems.below, cp);
}
    
StageRenderer.prototype.sortItemsVerticalHorizontal = function(items, cp) {
    items.left.length = 0;
    items.center.length = 0;
    items.right.length = 0;
    var t = items.all.length;
    for (var i = 0; i < t; i++) {
        var item = items.all[i];
        var iz = round(item.z + item.depth);
        var side = "center";
        if (item.x > cp.x) side = "right";
        else if (item.x + item.width < cp.x) side = "left";
        items[side][items[side].length] = item;
    }
}


























StageRenderer.prototype.renderRender = function(now, graphics, stage, mbr, window, levelquality, playerquality) {
    this.renderRenderItems(now, graphics, stage, mbr, window, levelquality, playerquality);
    if (this.debug) this.renderDebug(graphics, window);
}


StageRenderer.prototype.renderRenderItems = function(now, graphics, stage, mbr, window, levelquality, playerquality) {
    
    this.renderfirst.sort(sortByZDepth);
    this.renderRenderItemsFirst(now, graphics, stage, this.renderfirst, mbr, window, levelquality);
    
    this.renderitems.below["left"].sort(sortByZX);
    this.renderitems.below["right"].sort(sortByReverseZX);
    this.renderitems.below["center"].sort(sortByItemZ).reverse();
    this.renderRenderItemsVertical(now, graphics, stage, this.renderitems.below, mbr, window, levelquality, playerquality);

    this.renderitems.above["left"].sort(sortByZX);
    this.renderitems.above["right"].sort(sortByReverseZX);
    this.renderitems.above["center"].sort(sortByZ);
    this.renderRenderItemsVertical(now, graphics, stage, this.renderitems.above, mbr, window, levelquality, playerquality);

    this.renderitems.center["left"].sort(sortByZX);
    this.renderitems.center["right"].sort(sortByReverseZX);
    this.renderitems.center["center"].sort(sortByZ);
    this.renderRenderItemsVertical(now, graphics, stage, this.renderitems.center, mbr, window, levelquality, playerquality);
}

StageRenderer.prototype.renderRenderItemsFirst = function(now, graphics, stage, items, mbr, window, quality) {
    var renderer = stage.level.itemrenderer;
    var g = graphics["main"];
    var t = items.length;
    for (var i = 0; i < t; i++) {
        this.renderItem(now, g, mbr, window, renderer, items[i], quality);
    }
}

StageRenderer.prototype.renderRenderItemsVertical = function(now, graphics, stage, items, mbr, window, levelquality, playerquality) {
    this.renderRenderItemsVerticalHorizontal(now, graphics, stage, mbr, window, items["left"], levelquality, playerquality);
    this.renderRenderItemsVerticalHorizontal(now, graphics, stage, mbr, window, items["right"], levelquality, playerquality);
    this.renderRenderItemsVerticalHorizontal(now, graphics, stage, mbr, window, items["center"], levelquality, playerquality);
}

StageRenderer.prototype.renderRenderItemsVerticalHorizontal = function(now, graphics, stage, mbr, window, items, levelquality, playerquality) {
    var renderer = stage.level.itemrenderer;
    var g = graphics["main"];
    var t = items.length;
    for (var i = 0; i < t; i++) {
        var it = items[i];
        if (it.type == "item") this.renderItem(now, g, mbr, window, renderer, it.item, levelquality);
        else if (it.type == "player") this.renderPlayer(now, g, mbr, window, stage.players, it.item, playerquality);
    }
}














StageRenderer.prototype.renderDebug = function(graphics, window) {
    this.renderCenterLines(graphics, window);
}
    
StageRenderer.prototype.renderCenterLines = function(graphics, window) {
    var cp = window.getCenter();
    var g = graphics["main"];
    this.line.start.x = 0;
    this.line.start.y = cp.y;
    this.line.end.x = window.width;
    this.line.end.y = cp.y;
    var ctx = g.ctx;
    ctx.beginPath();
    this.line.draw(ctx, "red", 2);
    this.line.start.x = cp.x;
    this.line.start.y = 0;
    this.line.end.x = cp.x;
    this.line.end.y = window.height;
    ctx.beginPath();
    this.line.draw(ctx, "red", 2);
}























StageRenderer.prototype.renderItem = function(now, g, mbr, windowy, renderer, item, quality) {
    var scale = mbr.scale;
    var ctx = g.ctx;
    var width = g.canvas.width;
    var height = g.canvas.height;
    var floodlevel = null;
    if (!(item.iteminfo && item.iteminfo.flood)) {
        if (this.doflood) {
            var imbr = item.getMbr();
            var fl = this.flood.getFlood();
            if (item.width != "100%" && item.depth && item.y + imbr.height >= fl) {
                var ip = item.getLocation();
                var ix = (ip.x - mbr.x) * scale;
                var iy = (fl - mbr.y) * scale;
                this.np.x = ix;
                this.np.y = iy;
                var iz = (item.z - mbr.z) * scale;
                if (iz < -(__fov - 1)) {
                    var nz = __fov - 1;
                    iz = -nz;
                }
                this.np = projectPoint3D(this.np, iz, scale, mbr.x, mbr.y, mbr.getCenter(), this.np);
                floodlevel = round(this.np.y);
            }
        }
    }
    this.itemcache.cacheItem(now, ctx, item, renderer, mbr, window, width, height, quality, floodlevel);
}

StageRenderer.prototype.renderPlayer = function(now, graphics, mbr, window, players, player, quality) {
    var scale = mbr.scale;
    var floodlevel = null;
    if (this.doflood) {
        var fl = this.flood.getFlood();
        if (player.controller.y + player.controller.height >= fl) {
            var pp = player.getLocation();
            var px = ((pp.x + (player.controller.width / 2)) - mbr.x) * scale;
            var py = (fl - (pp.y + player.controller.height)) * scale;
            this.np.x = px;
            this.np.y = py;
            var pz = (pp.z - mbr.z)  * scale;
            this.np = projectPoint3D(this.np, pz, scale, mbr.x, mbr.y, mbr.getCenter(), this.np);
            floodlevel = round(this.np.y);
        }
    }
    players.renderPlayer(now, mbr, graphics, player, quality, floodlevel);
}





StageRenderer.prototype.renderEnd = function(graphics, mbr) {
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        if (g.blur) blurCanvas(g.canvas, g.ctx, g.blur);
    }
}