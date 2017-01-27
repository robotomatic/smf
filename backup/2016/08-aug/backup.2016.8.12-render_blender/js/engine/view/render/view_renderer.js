"use strict";

function ViewRenderer(quality, playerquality) {
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.window = new Rectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
    this.quality = quality;
    this.playerquality = playerquality ? playerquality : quality;
    this.first = true;
}

ViewRenderer.prototype.render = function(now, stage, ctx, width, height) {
    clearRect(ctx, 0, 0, width, height);
    this.mbr = this.camera.getView(now, this.mbr, width, height);
    var offy = 25;
    var x = this.mbr.x;
    var y = this.mbr.y + offy;
    var scale = round(width / this.mbr.width);
    var svw = width / scale;
    var dw = svw - this.mbr.width;
    if (dw) x = x - dw / 2;
    var svh = height / scale;
    var dh = svh - this.mbr.height;
    if (dh) y = y - dh / 2;
    var winpad = -150;
    var ww = this.mbr.width - (winpad * 2);
    var wh = this.mbr.height - (winpad * 2);
    var wx = x + winpad;
    var wy = y + winpad;
    this.window.width = ww;
    this.window.height = wh;
    this.window.x = wx;
    this.window.y = wy;
    this.renderLevel(now, ctx, stage, x, y, scale);
    this.first = false;
}

ViewRenderer.prototype.renderLevel = function(now, ctx, stage, x, y, scale) {
    stage.render(now, ctx, this.window, x, y, scale, this.quality, this.playerquality, this.first);
}