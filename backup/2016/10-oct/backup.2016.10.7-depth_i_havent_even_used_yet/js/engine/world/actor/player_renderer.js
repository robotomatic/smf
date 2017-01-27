"use strict";

function PlayerRenderer(player) {
    this.player = player;
    this.debug = false;
    this.playerdebugger = new PlayerDebugger(this.player);
    this.outline = false;
}

PlayerRenderer.prototype.draw = function(now, window, ctx, x, y, width, height, scale, quality, debug) {
    if (this.player.character) this.player.character.draw(now, ctx, this.player.color, x, y, width, height, this.outline, this.debug, quality);
    else {
        ctx.fillStyle = "magenta";
        var rect = new Rectangle(x, y, width, height);
        rect.draw(this.ctx);
    }
    if (debug) this.playerdebugger.drawDebug(now, window, ctx, x, y, width, height, scale);
}