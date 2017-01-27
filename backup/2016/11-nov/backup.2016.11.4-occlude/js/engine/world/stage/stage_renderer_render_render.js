"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.itemcache = itemcache;
    this.np = new Point(0, 0);
}

StageRendererRender.prototype.renderRender = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderRenderItems(now, graphics, stage, mbr, window, flood, levelquality, playerquality);
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderRenderItemsVertical(now, graphics, stage, mbr, window, this.renderitems.all, flood, levelquality, playerquality);
}

StageRendererRender.prototype.renderRenderItemsVertical = function(now, graphics, stage, mbr, window, items, flood, levelquality, playerquality) {
    items.sort(sortByZY);
    var renderer = stage.level.itemrenderer;
    var g = graphics["main"];
    var t = items.length;
    for (var i = 0; i < t; i++) {
        var renderitem = items[i];
        if (renderitem.type == "item") this.renderItem(now, g, mbr, window, renderer, renderitem.item, flood, levelquality);
        if (renderitem.type == "item-3D") this.renderItem3D(now, g, mbr, window, renderer, renderitem.item, flood, levelquality);
        else if (renderitem.type == "player") this.renderPlayer(now, g, mbr, window, stage.players, renderitem.item, flood, playerquality);
    }
}

StageRendererRender.prototype.renderItem = function(now, g, mbr, window, renderer, item, flood, quality) {
    var scale = mbr.scale;
    var ctx = g.ctx;
    var width = g.canvas.width;
    var height = g.canvas.height;
    var floodlevel = null;
//    if (!(item.iteminfo && item.iteminfo.flood)) {
//        if (flood.doflood) {
//            var imbr = item.getMbr();
//            var fl = flood.getFlood();
//            if (item.width != "100%" && item.depth && item.y + imbr.height >= fl) {
//                var ip = item.getLocation();
//                var ix = (ip.x - mbr.x) * scale;
//                var iy = (fl - mbr.y) * scale;
//                this.np.x = ix;
//                this.np.y = iy;
//                var iz = (item.z - mbr.z) * scale;
//                if (iz < -(__fov - 1)) {
//                    var nz = __fov - 1;
//                    iz = -nz;
//                }
//                this.np = projectPoint3D(this.np, iz, scale, mbr.x, mbr.y, mbr.getCenter(), this.np);
//                floodlevel = round(this.np.y);
//            }
//        }
//    }
    this.itemcache.renderItem(now, ctx, item, renderer, mbr, window, width, height, quality, floodlevel);
}

StageRendererRender.prototype.renderItem3D = function(now, g, mbr, window, renderer, item, flood, quality) {
    var scale = mbr.scale;
    var ctx = g.ctx;
    var width = g.canvas.width;
    var height = g.canvas.height;
    var floodlevel = null;
//    if (!(item.iteminfo && item.iteminfo.flood)) {
//        if (flood.doflood) {
//            var imbr = item.getMbr();
//            var fl = flood.getFlood();
//            if (item.width != "100%" && item.depth && item.y + imbr.height >= fl) {
//                var ip = item.getLocation();
//                var ix = (ip.x - mbr.x) * scale;
//                var iy = (fl - mbr.y) * scale;
//                this.np.x = ix;
//                this.np.y = iy;
//                var iz = (item.z - mbr.z) * scale;
//                if (iz < -(__fov - 1)) {
//                    var nz = __fov - 1;
//                    iz = -nz;
//                }
//                this.np = projectPoint3D(this.np, iz, scale, mbr.x, mbr.y, mbr.getCenter(), this.np);
//                floodlevel = round(this.np.y);
//            }
//        }
//    }
    this.itemcache.renderItem3D(now, ctx, item, renderer, mbr, window, width, height, quality, floodlevel);
}

StageRendererRender.prototype.renderPlayer = function(now, graphics, mbr, window, players, player, flood, quality) {
    var scale = mbr.scale;
    var floodlevel = null;
//    if (flood.doflood) {
//        var fl = flood.getFlood();
//        if (player.controller.y + player.controller.height >= fl) {
//            var pp = player.getLocation();
//            var px = ((pp.x + (player.controller.width / 2)) - mbr.x) * scale;
//            var py = (fl - (pp.y + player.controller.height)) * scale;
//            this.np.x = px;
//            this.np.y = py;
//            var pz = (pp.z - mbr.z)  * scale;
//            this.np = projectPoint3D(this.np, pz, scale, mbr.x, mbr.y, mbr.getCenter(), this.np);
//            floodlevel = round(this.np.y);
//        }
//    }
    players.renderPlayer(now, mbr, graphics, player, quality, floodlevel);
}
