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
    
    var blur = camera.getBlurAmount(distance);
    // blurCanvas(item.canvas, item.ctx, blur, 1);  <--- Maybe use this to smooth blur?
    var scalerender = blur;
    var scaledraw = 1 / scalerender;
    
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height, null, scalerender);
    item.drawImage(graphics.ctx, scaledraw, 0);
}

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, camera, player, distance) {
    
    var pw = graphics.canvas.width;
    var ph = graphics.canvas.height;

    var scalerender = 1;
    var scaledraw = 1;
    
    if (camera.shouldBlur(distance)) {
        var blur = camera.getBlurAmount(distance)
        // blurCanvas(item.canvas, item.ctx, blur, 1);  <--- Maybe use this to smooth blur?
        scalerender = blur;
        scaledraw = 1 / scalerender;
    }
    
    player.render(now, pw, ph, scalerender);
    player.drawImage(graphics.ctx, scaledraw, 0);
    
}