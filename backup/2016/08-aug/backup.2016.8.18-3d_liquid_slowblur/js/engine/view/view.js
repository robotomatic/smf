"use strict";

function View(id, width, height, scale, levelquality, playerquality) {
    if (!id) return;
    this.id = id;
    this.width = width;
    this.height = height;
    this.renderer = new ViewRenderer(levelquality, playerquality);
    this.scale = scale;
    this.parent = document.getElementById(this.id);
    
    this.graphics = {
        blur_small : {
            canvas : null,
            ctx : null,
            css : "blur-small"
        },
        main : {
            canvas : null,
            ctx : null,
            css : ""
        },
        blur_large : {
            canvas : null,
            ctx : null,
            css : "blur-large"
        }
    }

    this.ready = false;
    this.createGraphics();
}

View.prototype.createGraphics = function() { 
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        this.createCanvas(this.graphics[keys[i]]);
    }
}
    
View.prototype.createCanvas = function(graphics) {     
    graphics.canvas = document.createElement('canvas');
    graphics.ctx = graphics.canvas.getContext("2d");
    graphics.canvas.className = "absolute game-canvas";
    if (this.scale) graphics.canvas.className += " game-canvas-scale"
    if (graphics.css) graphics.canvas.className += " " + graphics.css;
    this.parent.appendChild(graphics.canvas);
}

View.prototype.resize = function() {
    var rect = this.parent.getBoundingClientRect();
    var left = rect.width;
    var top = rect.top;
    var width = rect.width;
    var height = rect.height;
    var cleft = 0;
    var ctop = 0;
    var cwidth = width;
    var cheight = height;
    var vscale = 1;
    if ((cwidth > this.width || cheight > this.height) && (this.scale)) {
        var scale = this.scale;
        cwidth = width / scale;
        cheight = height / scale;
        cleft = (width - cwidth) / this.scale;
        ctop = (height - cheight) / this.scale;

        var keys = Object.keys(this.graphics);
        for (var i = 0; i < keys.length; i++)  {
            var c = this.graphics[keys[i]].canvas;
//            c.className += " game-canvas-scale";
//            c.style.webkitTransform = "scale(" + this.scale + ")";            
        }
        vscale = this.scale;
    } else {
        var keys = Object.keys(this.graphics);
        for (var i = 0; i < keys.length; i++)  {
            var c = this.graphics[keys[i]].canvas;
//            c.className = c.className.replace(/game-canvas-scale/g, '');
//            c.style.webkitTransform = "scale(1)";
        }
    }
    this.sizeViewGraphics(cleft, ctop, cwidth, cheight, vscale);
}

View.prototype.sizeViewGraphics = function(left, top, width, height, vscale) { 
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = this.graphics[keys[i]];
        this.sizeGraphics(g, left, top, width, height, vscale);
    }
}

View.prototype.sizeGraphics = function(graphics, left, top, width, height, vscale) { 
    var canvas = graphics.canvas;
    if (graphics.scale) {
        var scale = graphics.scale;
        var sw = width / scale;
        var dw = width - sw;
        var sh = height / scale;
        var dh = height - sh;
        var sl = left + (sw / 2);
        var st = top + (sh / 2);
        canvas.style.left = sl + "px";
        canvas.style.top = st + "px";
        canvas.width = sw;
        canvas.height = sh;
        canvas.style.webkitTransform = "scale(" + (vscale * scale) + ")";
    } else {
        canvas.style.left = left + "px";
        canvas.style.top = top + "px";
        canvas.width = width;
        canvas.height = height;
    }
}

View.prototype.resizeUI = function() { }
    
View.prototype.resizeText = function() { }

View.prototype.show = function() { 
    fadeIn(this.canvas_render);
}

View.prototype.hide = function() { 
    return;
    fadeOut(this.canvas_render);
}

View.prototype.initialize = function(stage) {
    if (stage.level.itemrenderer) {
        if (stage.level.itemrenderer.theme && stage.level.itemrenderer.theme.background) {
            this.parent.style.background = stage.level.itemrenderer.theme.background.color;
        }
    }
    this.ready = true;
}

View.prototype.update = function(now, delta, stage) {
    this.updateUI();
    return true;
}

View.prototype.setMessage = function(message) { }

View.prototype.updateUI = function() {
    // todo: debounce UI updates
}

View.prototype.render = function(now, stage) {
    if (!this.ready) this.initialize(stage);
    this.renderer.render(now, stage, this.graphics);
}