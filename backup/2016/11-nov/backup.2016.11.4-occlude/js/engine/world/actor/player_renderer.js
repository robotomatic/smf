"use strict";

function PlayerRenderer(player) {
    this.player = player;
    this.debug = false;
    this.playerdebugger = new PlayerDebugger(this.player);
    this.outline = false;
}

PlayerRenderer.prototype.draw = function(now, window, ctx, x, y, z, scale, quality, floodlevel, debug) {
    if (this.player.character) this.player.character.draw(now, ctx, this.player.color, this.player.box, this.outline, this.debug, quality, floodlevel);
    else {
        ctx.fillStyle = "magenta";
        this.player.box.draw(this.ctx);
    }
    if (debug) this.playerdebugger.drawDebug(now, window, ctx, x, y, z, scale);
}