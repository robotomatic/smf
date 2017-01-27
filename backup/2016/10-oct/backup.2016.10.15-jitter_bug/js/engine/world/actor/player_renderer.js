"use strict";

function PlayerRenderer(player) {
    this.player = player;
    this.debug = false;
    this.playerdebugger = new PlayerDebugger(this.player);
    this.outline = false;
}

PlayerRenderer.prototype.draw = function(now, window, ctx, x, y, z, playerbox, scale, quality, floodlevel, debug) {
    if (this.player.character) this.player.character.draw(now, ctx, this.player.color, playerbox, this.outline, this.debug, quality, floodlevel);
    else {
        ctx.fillStyle = "magenta";
        playerbox.draw(this.ctx);
    }
    if (debug) this.playerdebugger.drawDebug(now, window, ctx, x, y, z, playerbox, scale);
}