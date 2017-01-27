"use strict";

function PlayerRenderer(player) {
    this.player = player;
    this.debug = false;
    this.playerdebugger = new PlayerDebugger(this.player);
    this.outline = false;
}

PlayerRenderer.prototype.draw = function(now, ctx, x, y, width, height, scale, quality) {

    if (this.player.character) this.player.character.draw(now, ctx, this.player.color, x, y, width, height, this.outline, this.debug, quality);
    else {
        ctx.fillStyle = "magenta";
        var rect = new Rectangle(x, y, width, height);
        rect.draw(ctx);
    }
    var debug = false;
    if (this.debug || debug) this.playerdebugger.drawDebug(now, ctx, x, y, width, height, scale);
}