"use strict";

function ViewRenderer() {
    this.debug = false;
    this.mbr = geometryfactory.getRectangle(0, 0, 0, 0);
    this.window = geometryfactory.getRectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
    this.image = new Image(null, 0, 0, 0, 0);
    this.tiltshift = false;
    this.blurcanvas = document.createElement("canvas");
    this.blurctx = this.blurcanvas.getContext("2d");
    this.circle = geometryfactory.getCircle(0, 0, 0);
}

ViewRenderer.prototype.update = function(now, stage, view) {
}

ViewRenderer.prototype.render = function(now, stage, view, graphics) {

    this.mbr = this.camera.getView(now, this.mbr, view.canvas.width, view.canvas.height);
    
    var width = view.canvas.width;
    var height = view.canvas.height;
    
    var pad = 0;
    var twopad = pad * 2;
    this.window.x = -pad;
    this.window.y = -pad;
    this.window.z = -pad;
    this.window.width = width + twopad;
    this.window.height = height + twopad;
    this.window.depth = 1;
    this.window.scale = this.mbr.scale;

    stage.render(now, graphics, this.camera, this.mbr, this.window);
    
    clearRect(view.ctx, 0, 0, view.canvas.width, view.canvas.height);
    this.image.width = width;
    this.image.height = height;
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        this.image.data = g.canvas;
        this.image.draw(view.ctx, 0, 0, width, height);
    }
    
//    view.ctx.beginPath();
//    this.window.drawOutline(view.ctx, "red", 2);
    
    if (this.tiltshift) this.renderTilt(view, stage, this.mbr, width, height);
}

ViewRenderer.prototype.renderTilt = function(view, stage, mbr, width, height) {

    var cx = width / 2;
    var cy = height / 2;
    
    this.circle.x = cx;
    this.circle.y = cy;
    
    var cr = MATH_MIN(width, height) / 2;
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

    // todo: this needs to account for the blur size so items don't get bigger, just blurrier
    blurCanvas(view.canvas, view.ctx, 2);
    
    this.image.data = this.blurcanvas;
    this.image.draw(view.ctx, 0, 0, width, height);
}