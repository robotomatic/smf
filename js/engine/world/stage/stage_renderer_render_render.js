"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
    this.blur = {
        minthreshold : 600,
        maxthreshold : 1000,
        amount : 1.5
    }
        
}

StageRendererRender.prototype.renderRender = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderRenderItems(now, graphics["main"], stage, mbr, window, flood, levelquality, playerquality);
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderitems.all.sort(sortByDistance);
    var renderer = stage.level.itemrenderer;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        var wd = round(renderitem.z - mbr.z);
        if (renderitem.type == "item") this.renderItem(now, window, graphics, renderitem.item, renderer, wd);
        else if (renderitem.type == "player") this.renderPlayer(now, window, graphics, renderitem.item, playerquality, wd);
    }
}

StageRendererRender.prototype.renderItem = function(now, window, graphics, item, renderer, distance) {

    if (item.width == "100%" || distance < this.blur.minthreshold) {
        item.render(now, renderer, graphics.canvas.width, graphics.canvas.height, graphics.ctx);
        return;
    }
    
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height);
    blurCanvas(item.canvas, item.ctx, this.getBlurAmount(distance), 1);
    item.drawImage(graphics.ctx);
}

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, player, quality, distance) {
    player.render(now, quality, graphics.canvas.width, graphics.canvas.height);
    if (distance > this.blur.minthreshold) {
        blurCanvas(player.canvas, player.ctx, this.getBlurAmount(distance), 1);
    }
    player.drawImage(graphics.ctx);
}

StageRendererRender.prototype.getBlurAmount = function(distance) {
    if (distance >= this.blur.maxthreshold) return this.blur.amount;
    var dp = distance - this.blur.minthreshold;
    var mp = this.blur.maxthreshold - this.blur.minthreshold;
    var d = round(dp / mp); 
    return this.blur.amount * d;
}
