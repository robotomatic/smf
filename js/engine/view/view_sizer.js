"use strict"

function ViewSizer(view) {
    this.view = view;
}

ViewSizer.prototype.resize = function() {
    var rect = this.view.parent.getBoundingClientRect();
    var rwidth = rect.width;
    var rheight = rect.height;
    if (!rwidth || !rheight) return;
    logDev("window: " + rwidth + " x " + rheight);
    var cwidth = this.view.width;
    var cheight = this.view.height;
    if (this.view.rendertarget.auto) {
        var r = rheight / rwidth;
        cheight = cwidth * r;
    }
    if (cwidth > rwidth) {
        cwidth = rwidth;
    }
    if (cheight > rheight) {
        cheight = rheight;
    }
    this.view.height = round(cheight);
    this.view.width = round(cwidth);
    var p = round(cwidth / this.view.width) * 100;
    logDev("canvas: " + this.view.width + " x " + this.view.height + " == " + p + "%");
    var ctop = (rheight - cheight) / 2;
    var cleft = (rwidth - cwidth) / 2;
    this.sizeViewGraphics(cleft, ctop, cwidth, cheight);
    logDev("");
}

ViewSizer.prototype.sizeViewGraphics = function(left, top, width, height) { 
    var keys = Object.keys(this.view.renderer.graphics.graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = this.view.renderer.graphics.graphics[keys[i]];
        this.sizeGraphics(g, left, top, width, height);
    }
    this.sizeGraphics(this.view.rendertarget, left, top, width, height);
}

ViewSizer.prototype.sizeGraphics = function(graphics, left, top, width, height) { 
    left = round(left);
    top = round(top);
    width = round(width);
    height = round(height);
    var canvas = graphics.canvas;
    canvas.setPosition(left, top);
    canvas.setSize(width, height);
    var rect = this.view.parent.getBoundingClientRect();
    var rwidth = rect.width;
    var rheight = rect.height;
    var s = round(rwidth / width);
    this.view.viewscale = s;
    var sw = round(width * s);
    var dw = round(sw - width);
    var sh = round(height * s);
    var dh = round(sh - height);
    if (graphics.fit) {
        var testheight = height * s;
        if (testheight > rheight) {
            var newheight = round(rheight / s);
            canvas.setSize(width, newheight);
            var newtop = round((rheight - newheight) / 2);
            canvas.setPosition(left, newtop);
            sh = round(newheight * s);
        }
        canvas.setScale(s);
        graphics.scale = s;
        logDev("view scale: " + s); 
        logDev("width: " + sw + ", height: " + sh);
        return;
    }
    canvas.setScale(1);
    graphics.scale = 1;
}
