"use strict";

function WorldRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
}

WorldRendererRender.prototype.renderRender = function(now, mbr, window, graphics, camera, world, debug, paused) {
    this.renderRenderItems(now, graphics, camera, world, mbr, window, debug, paused);
}

WorldRendererRender.prototype.renderRenderItems = function(now, graphics, camera, world, mbr, window, debug, paused) {
    var scale = 1;
    this.renderitems.all.sort(sortByDistance);
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        if (!renderitem.showing) continue;
        var wd = round(renderitem.z - mbr.z);
        
        var g = null;
        if (camera.blur.blur) {
            if (renderitem.blur > 0) {
                if (renderitem.blur >= 10) g = graphics["blur_max"];
                else if (renderitem.blur >= 6) g = graphics["blur_med"];
                else g = graphics["blur"];
            } else if (renderitem.blur < 0) {
                g = graphics["blur_min"];
            } else {
                g = graphics["main"];
            }
        } else {
            g = graphics["main"];
        }
        
        if (renderitem.type == "item") this.renderItem(now, window, g, camera, world, renderitem.item, wd, scale, debug, paused);
        else if (renderitem.type == "player") this.renderPlayer(now, window, g, camera, world, renderitem.item, wd, scale, debug, paused);
    }
}

WorldRendererRender.prototype.renderItem = function(now, window, graphics, camera, world, item, distance, scale, debug, paused) {
    item.render(now, world.worldrenderer.itemrenderer, graphics.canvas.width, graphics.canvas.height, graphics.canvas, scale, debug.level, paused);
}

WorldRendererRender.prototype.renderPlayer = function(now, window, graphics, camera, world, player, distance, scale, debug, paused) {
    player.render(now, graphics.canvas.width, graphics.canvas.height, graphics.canvas, scale, debug.player, paused);
}