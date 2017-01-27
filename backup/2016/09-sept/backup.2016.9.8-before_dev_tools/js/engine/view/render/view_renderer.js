"use strict";

function ViewRenderer(levelquality, playerquality) {
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.window = new Rectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
    this.levelquality = levelquality;
    this.playerquality = playerquality;
}

ViewRenderer.prototype.render = function(now, stage, graphics) {
    var width = graphics.main.canvas.width;
    var height = graphics.main.canvas.height;
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

    stage.render(now, graphics, this.window, x, y, scale, this.levelquality, this.playerquality);
}