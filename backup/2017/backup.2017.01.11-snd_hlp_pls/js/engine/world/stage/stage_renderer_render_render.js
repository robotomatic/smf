"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
}

StageRendererRender.prototype.renderRender = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {

    this.renderRenderItems(now, graphics["main"], stage, mbr, window, flood, levelquality, playerquality);
    
    // can do blur here...
    
    this.renderOverlapItems(now, graphics["main"]);
    
    this.renderDrawItems(now, graphics["main"]);
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, stage, mbr, window, flood, levelquality, playerquality) {
    this.renderitems.all.sort(sortByZY);
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
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height);
}

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, player, quality) {
    player.render(now, quality, graphics.canvas.width, graphics.canvas.height);
}

StageRendererRender.prototype.renderOverlapItems = function(now, graphics) {
    var keys = getSortedKeysZ(this.renderitems.overlap.items).reverse();
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var item1 = this.renderitems.overlap.items[keys[i]];
        var pad = item1.item.item.imagepad * 2;
        var ctx = item1.item.item.ctx;
        
        ctx.globalCompositeOperation = "source-atop";
        
        var kkeys = getSortedKeysZ(item1.overlap).reverse();
        for (var ii = 0; ii < kkeys.length; ii++) {
            var overlapitem = item1.overlap[kkeys[ii]];

            var dx = overlapitem.item.projectedlocation.x - item1.item.item.projectedlocation.x;
            var dy = overlapitem.item.projectedlocation.y - item1.item.item.projectedlocation.y;

            var dw = item1.item.item.projectedmbr.width - dx;
            var dh = item1.item.item.projectedmbr.height - dy;
            
            if (dx + dw > graphics.canvas.width) dw = graphics.canvas.width - dx;
            if (dy + dh > graphics.canvas.height) dh = graphics.canvas.height - dy;
            
            overlapitem.item.patchImage(ctx, dx, dy, dw + pad, dh + pad);
        }
        ctx.globalCompositeOperation = "source-over";
    }
}

StageRendererRender.prototype.renderDrawItems = function(now, graphics) {
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        if (this.renderitems.overlap.hidden[renderitem.name]) continue;
        renderitem.item.drawImage(graphics.ctx);
    }
}

