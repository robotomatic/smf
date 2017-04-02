"use strict";

function WorldRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
}

WorldRendererRender.prototype.renderRender = function(now, mbr, window, graphics, camera, world, debug, render = true) {
    if (!render) return;
    this.renderRenderItems(now, graphics, camera, world, mbr, window, debug);
}

WorldRendererRender.prototype.renderRenderItems = function(now, graphics, camera, world, mbr, window, debug) {
    this.renderitems.all.sort(sortByDistance);
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        if (!renderitem.showing) continue;
        var wd = round(renderitem.z - mbr.z);
        
        var g = null;
        if (renderitem.blur) {
            if (renderitem.blur >= 10) g = graphics["blur_max"];
            else g = graphics["blur"];
        } else {
            g = graphics["main"];
        }
        
        if (renderitem.type == "item") this.renderItem(now, window, g, camera, world, renderitem.item, wd, debug);
        else if (renderitem.type == "player") this.renderPlayer(now, window, g, camera, world, renderitem.item, wd, debug);
    }
}

WorldRendererRender.prototype.renderItem = function(now, window, graphics, camera, world, item, distance, debug) {
    var renderer = world.worldrenderer.itemrenderer;
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height, graphics.canvas, 1, debug.level);
}

WorldRendererRender.prototype.renderPlayer = function(now, window, graphics, camera, world, player, distance, debug) {
    player.render(now, graphics.canvas.width, graphics.canvas.height, graphics.canvas, 1, debug.player);
}