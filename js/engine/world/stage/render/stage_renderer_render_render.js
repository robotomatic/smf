"use strict";

function StageRendererRender(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.np = new Point(0, 0);
    this.doblur = true;
}

StageRendererRender.prototype.renderRender = function(now, graphics, camera, stage, mbr, window) {
    this.renderRenderItems(now, graphics, camera, stage, mbr, window);
}

StageRendererRender.prototype.renderRenderItems = function(now, graphics, camera, stage, mbr, window) {
    this.renderitems.all.sort(sortByDistance);
    var renderer = stage.level.itemrenderer;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var renderitem = this.renderitems.all[i];
        if (!renderitem.showing) continue;
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
    var scalerender = 1;
    if (this.doblur && camera.blur.blur) {
        scalerender = camera.getBlurAmount(distance);;
    }
    var scaledraw = 1 / scalerender;
    item.render(now, renderer, graphics.canvas.width, graphics.canvas.height, null, scalerender);
    if (this.doblur && camera.blur.shift) {
        var shift = camera.getBlurShiftAmount(distance);
        blurCanvas(item.canvas, item.ctx, shift, 1);
    }
    item.drawImage(graphics.ctx, scaledraw, 0);
}

StageRendererRender.prototype.renderPlayer = function(now, window, graphics, camera, player, distance) {
    var pw = graphics.canvas.width;
    var ph = graphics.canvas.height;
    var scalerender = 1;
    var scaledraw = 1;
    var b = camera.shouldBlur(distance);
    if (b) {
        if (this.doblur && camera.blur.blur) {
            scalerender = camera.getBlurAmount(distance);
        }
        scaledraw = 1 / scalerender;
        player.render(now, pw, ph, null, scalerender);
        if (this.doblur && camera.blur.shift) {
            var shift = camera.getBlurShiftAmount(distance);
            blurCanvas(player.canvas, player.ctx, shift, 1);
        }
        player.drawImage(graphics.ctx, scaledraw, 0);
    } else {
        player.render(now, pw, ph, graphics.ctx, scalerender);
    }
}