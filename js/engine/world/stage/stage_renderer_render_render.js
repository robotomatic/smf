"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
    
    // todo: this needs to be graduated
    this.blur = {
        threshold : 1000,
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
        if (renderitem.type == "item") this.renderItem(now, window, graphics, renderitem.item, renderer, renderitem.distance);
        else if (renderitem.type == "player") this.renderPlayer(now, window, graphics, renderitem.item, playerquality, renderitem.distance);
    }
}

StageRendererRender.prototype.renderItem = function(now, window, graphics, item, renderer, distance) {

//    if (distance < this.blur.threshold) {
        item.render(now, renderer, graphics.canvas.width, graphics.canvas.height, graphics.ctx);
        return;
//    }
    
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height);
    if (distance > this.blur.threshold) blurCanvas(item.canvas, item.ctx, this.blur.amount, 1);
    item.drawImage(graphics.ctx);
}

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, player, quality, distance) {
    player.render(now, quality, graphics.canvas.width, graphics.canvas.height);
    if (distance > this.blur.threshold) blurCanvas(player.canvas, player.ctx, this.blur.amount, 1);
    player.drawImage(graphics.ctx);
}