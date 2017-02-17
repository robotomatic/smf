"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
}

StageRendererRender.prototype.renderRender = function(now, graphics, camera, stage, mbr, window, flood) {
    this.renderRenderItems(now, graphics["main"], camera, stage, mbr, window, flood);
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, camera, stage, mbr, window, flood) {
    this.renderitems.all.sort(sortByDistance);
    var renderer = stage.level.itemrenderer;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        var wd = round(renderitem.z - mbr.z);
        if (renderitem.type == "item") this.renderItem(now, window, graphics, camera, renderitem.item, renderer, wd);
        else if (renderitem.type == "player") this.renderPlayer(now, window, graphics, camera, renderitem.item, wd);
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

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, camera, player, distance) {
    
    var pw = graphics.canvas.width;
    var ph = graphics.canvas.height;

    player.render(now, pw, ph);
    
    if (camera.shouldBlur(distance)) {
        var blur = camera.getBlurAmount(distance)
        blurCanvas(player.canvas, player.ctx, blur, 1);
        player.drawImage(graphics.ctx, blur);
    } else {
        player.drawImage(graphics.ctx);
    }
    
}