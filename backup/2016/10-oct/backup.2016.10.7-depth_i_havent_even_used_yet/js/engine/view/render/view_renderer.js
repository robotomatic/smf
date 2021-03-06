"use strict";

function ViewRenderer(levelquality, playerquality) {
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.window = new Rectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
    this.levelquality = levelquality;
    this.playerquality = playerquality;
    this.image = new Image(null, 0, 0, 0, 0);
    this.tiltshift = false;
    this.blurcanvas = document.createElement("canvas");
    this.blurctx = this.blurcanvas.getContext("2d");
    this.circle = new Circle(0, 0, 0);
}

ViewRenderer.prototype.render = function(now, stage, view, graphics) {
    var width = view.canvas.width;
    var height = view.canvas.height;
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

    clearRect(view.ctx, 0, 0, view.canvas.width, view.canvas.height);
    this.image.width = width;
    this.image.height = height;
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        this.image.data = g.canvas;
        this.image.draw(view.ctx, 0, 0, width, height);
    }
    if (this.tiltshift) this.renderTilt(view, stage, x, y, width, height, scale);
}

ViewRenderer.prototype.renderTilt = function(view, stage, x, y, width, height, scale) {

    if (!stage.players || stage.players.players.length != 1) return;
    
    // todo: need to find focal center of view (player or players)
    var p = stage.players.players[0];
    var pp = p.controller.getLocation();
    var px = (pp.x - x) * scale;;
    var py = (pp.y - y) * scale;;

    var cx = px + (p.controller.width / 2);
    var cy = py + (p.controller.height / 2);;
    
    this.circle.x = cx;
    this.circle.y = cy;
    
    var cr = Math.min(width, height) / 2;
    this.circle.radius = cr;

    var cir = cr - (cr / 3);
    
    this.blurcanvas.width = width;   
    this.blurcanvas.height = height;   
    
    this.gradient = this.blurctx.createRadialGradient(cx, cy, cir, cx, cy, cr);
    this.gradient.addColorStop(0, 'white');
    this.gradient.addColorStop(1, 'transparent');    
    this.blurctx.fillStyle = this.gradient;

    this.blurctx.save();
    this.blurctx.translate(-this.blurcanvas.width / 2, 0);
    this.blurctx.scale(2, 1);    
    this.blurctx.beginPath();
    this.circle.draw(this.blurctx);
    this.blurctx.restore();
    
    this.blurctx.globalCompositeOperation = "source-in";    
    this.image.data = view.canvas;
    this.image.draw(this.blurctx, 0, 0, width, height);

    blurCanvas(view.canvas, view.ctx, 2);
    
    this.image.data = this.blurcanvas;
    this.image.draw(view.ctx, 0, 0, width, height);
}