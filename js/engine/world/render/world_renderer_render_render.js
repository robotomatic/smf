"use strict";

function WorldRendererRender(worldrenderer) {
    this.worldrenderer = worldrenderer;
    this.np = new Point(0, 0);
}

WorldRendererRender.prototype.renderRender = function(now, mbr, window, graphics, camera, world, debug, render, paused) {
    this.renderRenderItems(now, graphics, camera, world, mbr, window, debug, render, paused);
}

WorldRendererRender.prototype.renderRenderItems = function(now, graphics, camera, world, mbr, window, debug, render, paused) {
    var scale = 1;
    this.worldrenderer.renderitems.all.sort(sortByDistance);
    var t = this.worldrenderer.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.worldrenderer.renderitems.all[i];
        if (!renderitem.showing) continue;
        var wd = round(renderitem.z - mbr.z);
        var g = graphics.getGraphics(camera, renderitem);
        if (renderitem.type == "world" && render.world) this.renderWorld(now, window, g, camera, world, renderitem.item, wd, scale, debug, paused);
        else if (renderitem.type == "item" && render.items) this.renderItem(now, window, g, camera, world, renderitem.item, wd, scale, debug, paused);
        else if (renderitem.type == "player" && render.players) this.renderPlayer(now, window, g, camera, world, renderitem.item, wd, scale, debug, paused);
        else if (renderitem.type == "particle" && render.particles) this.renderParticle(now, window, g, camera, world, renderitem.item, wd, scale, debug, paused);
    }
}

WorldRendererRender.prototype.renderWorld = function(now, window, graphics, camera, world, item, distance, scale, debug, paused) {
    item.render(now, world, world.worldrenderer.itemrenderer, graphics.canvas.width, graphics.canvas.height, graphics.canvas, scale, debug.level, paused);
}

WorldRendererRender.prototype.renderItem = function(now, window, graphics, camera, world, item, distance, scale, debug, paused) {
    item.render(now, world, world.worldrenderer.itemrenderer, graphics.canvas.width, graphics.canvas.height, graphics.canvas, scale, debug.level, paused);
}

WorldRendererRender.prototype.renderPlayer = function(now, window, graphics, camera, world, player, distance, scale, debug, paused) {
    player.render(now, graphics.canvas.width, graphics.canvas.height, graphics.canvas, scale, debug.player, paused);
}

WorldRendererRender.prototype.renderParticle = function(now, window, graphics, camera, world, particleemitter, distance, scale, debug, paused) {
    particleemitter.render(graphics.canvas);
}