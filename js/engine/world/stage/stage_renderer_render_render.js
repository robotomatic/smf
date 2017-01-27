"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
}

StageRendererRender.prototype.renderRender = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {

    this.renderRenderItems(now, graphics["main"], stage, mbr, window, flood, levelquality, playerquality);
    
    // can do blur here...
    
//    this.renderDrawItems(now, graphics["main"]);
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderitems.all.sort(sortByDistance);
    var renderer = stage.level.itemrenderer;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        if (this.renderitems.overlap.hidden[renderitem.name]) continue;
        if (renderitem.type == "item") this.renderItem(now, window, graphics, renderitem.item, renderer);
        else if (renderitem.type == "player") this.renderPlayer(now, window, graphics, renderitem.item, playerquality);
    }
}

StageRendererRender.prototype.renderItem = function(now, window, graphics, item, renderer) {
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height, graphics.ctx);
//    item.drawImage(graphics.ctx);
}

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, player, quality) {
    player.render(now, quality, graphics.canvas.width, graphics.canvas.height);
    player.drawImage(graphics.ctx);
}

//StageRendererRender.prototype.renderDrawItems = function(now, graphics) {
//    var t = this.renderitems.all.length;
//    for (var i = 0; i < t; i++) {
//        var renderitem = this.renderitems.all[i];
//        if (this.renderitems.overlap.hidden[renderitem.name]) continue;
//        renderitem.item.drawImage(graphics.ctx);
//    }
//}

//StageRendererRender.prototype.renderRenderItems = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {
//    this.renderitems.geometry.sort(sortByDistance);
//    var t = this.renderitems.geometry.length;
//    for (var i = 0; i < t; i++) {
//        var renderitem = this.renderitems.geometry[i];
//        if (renderitem.type == "item") this.renderItem(now, window, graphics, renderitem.item, renderitem.name, stage.level.itemrenderer);
//        else if (renderitem.type == "player") this.renderPlayer(now, window, graphics, renderitem.item, playerquality);
//    }
//    
//}
//
//StageRendererRender.prototype.renderItem = function(now, window, graphics, item, name, renderer) {
//    item.render(now, graphics.ctx, renderer, name, graphics.canvas.width, graphics.canvas.height);
//}
//
//StageRendererRender.prototype.renderPlayer = function(now, window, graphics, player, quality) {
//    player.render(now, quality, graphics.canvas.width, graphics.canvas.height);
//    player.drawImage(graphics.ctx);
//}
