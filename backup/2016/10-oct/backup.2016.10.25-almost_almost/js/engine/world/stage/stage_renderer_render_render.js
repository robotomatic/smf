"use strict";

function StageRendererRender(renderitems) {
    this.renderitems = renderitems;
    this.itemcache = new ItemCache();
    this.flood = new StageFlood();
    this.doflood = false;
    this.np = new Point(0, 0);
    this.line = new Line(new Point(0, 0), new Point(0, 0));
}

StageRendererRender.prototype.renderRender = function(now, graphics, stage, mbr, window, levelquality, playerquality) {
    this.getFlood(stage);
    this.renderitems.first.sort(sortByZDepth);
    this.renderRenderItemsFirst(now, graphics, stage, this.renderitems.first, mbr, window, levelquality);
    this.renderRenderItems(now, graphics, stage, mbr, window, levelquality, playerquality);
}

StageRendererRender.prototype.getFlood = function(stage) {
    this.doflood = false;
    var level = stage.level;
    if (level.flood) {
        this.flood.init(level.flood.y);
        this.doflood = true;
    }
}

StageRendererRender.prototype.renderRenderItemsFirst = function(now, graphics, stage, items, mbr, window, quality) {
    var renderer = stage.level.itemrenderer;
    var g = graphics["main"];
    var t = items.length;
    for (var i = 0; i < t; i++) {
        this.renderItem(now, g, mbr, window, renderer, items[i], quality);
    }
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, stage, mbr, window, levelquality, playerquality) {
    this.renderRenderItemsVertical(now, graphics, stage, mbr, window, this.renderitems.above, false, levelquality, playerquality);
    this.renderRenderItemsVertical(now, graphics, stage, mbr, window, this.renderitems.below, true, levelquality, playerquality);
    this.renderRenderItemsVerticalY(now, graphics, stage, mbr, window, this.renderitems.center.z, levelquality, playerquality);
}

StageRendererRender.prototype.renderRenderItemsVertical = function(now, graphics, stage, mbr, window, items, reverse, levelquality, playerquality) {
    var keys = Object.keys(items.y).sort(reverse ? sortByKeyNumberReverse : sortByKeyNumber);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        this.renderRenderItemsVerticalY(now, graphics, stage, mbr, window, items.y[keys[i]].z, levelquality, playerquality);
    }
}

StageRendererRender.prototype.renderRenderItemsVerticalY = function(now, graphics, stage, mbr, window, items, levelquality, playerquality) {
    var keys = Object.keys(items).sort(sortByKeyNumberReverse);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        this.renderRenderItemsVerticalYZ(now, graphics, stage, mbr, window, items[keys[i]].x, levelquality, playerquality);
    }
}

StageRendererRender.prototype.renderRenderItemsVerticalYZ = function(now, graphics, stage, mbr, window, items, levelquality, playerquality) {
    this.renderRenderItemsVerticalYZHorizontal(now, graphics, stage, mbr, window, items["left"], levelquality, playerquality);
    this.renderRenderItemsVerticalYZHorizontal(now, graphics, stage, mbr, window, items["right"], levelquality, playerquality);
    this.renderRenderItemsVerticalYZHorizontal(now, graphics, stage, mbr, window, items["center"], levelquality, playerquality);
}

StageRendererRender.prototype.renderRenderItemsVerticalYZHorizontal = function(now, graphics, stage, mbr, window, items, levelquality, playerquality) {
    items.sort(sortByItemZDepth);
    var renderer = stage.level.itemrenderer;
    var g = graphics["main"];
    var t = items.length;
    for (var i = 0; i < t; i++) {
        var it = items[i];
        if (it.type == "item") this.renderItem(now, g, mbr, window, renderer, it.item, levelquality);
        else if (it.type == "player") this.renderPlayer(now, g, mbr, window, stage.players, it.item, playerquality);
    }
}

StageRendererRender.prototype.renderItem = function(now, g, mbr, windowy, renderer, item, quality) {
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

StageRendererRender.prototype.renderPlayer = function(now, graphics, mbr, window, players, player, quality) {
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
