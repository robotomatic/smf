"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
}

StageRendererRender.prototype.renderRender = function(now, graphics, camera, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderRenderItems(now, graphics["main"], camera, stage, mbr, window, flood, levelquality, playerquality);
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, camera, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderitems.all.sort(sortByDistance);
    var renderer = stage.level.itemrenderer;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        var wd = round(renderitem.z - mbr.z);
        if (renderitem.type == "item") this.renderItem(now, window, graphics, camera, renderitem.item, renderer, wd);
        else if (renderitem.type == "player") this.renderPlayer(now, window, graphics, camera, renderitem.item, playerquality, wd);
    }
}

StageRendererRender.prototype.renderItem = function(now, window, graphics, camera, item, renderer, distance) {
    if (item.width == "100%" || !camera.shouldBlur(distance)) {
        item.render(now, renderer, graphics.canvas.width, graphics.canvas.height, graphics.ctx);
        return;
    }
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height);
    var blur = camera.getBlurAmount(distance);
    blurCanvas(item.canvas, item.ctx, blur, 1);
    item.drawImage(graphics.ctx, blur);
}

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, camera, player, quality, distance) {
    player.render(now, quality, graphics.canvas.width, graphics.canvas.height);
    var blur = 0;
    if (camera.shouldBlur(distance)) {
        blur = camera.getBlurAmount(distance)
        blurCanvas(player.canvas, player.ctx, blur, 1);
    }
    player.drawImage(graphics.ctx, blur);
}