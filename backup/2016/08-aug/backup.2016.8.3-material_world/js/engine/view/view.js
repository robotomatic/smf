"use strict";

function View(id, width, height, scale, quality, playerquality) {
    if (!id) return;
    this.id = id;
    this.width = width;
    this.height = height;
    this.renderer = new ViewRenderer(quality, playerquality);
    this.scale = scale;
    this.parent = document.getElementById(this.id);
    this.canvas_render = null;
    this.ctx_render = null;
    this.ready = false;
    this.createCanvas();
}

View.prototype.createCanvas = function() { 
    this.canvas_render = document.createElement('canvas');
    this.ctx_render = this.canvas_render.getContext("2d");
    this.canvas_render.className = "fade-hide absolute game-canvas";
    if (this.scale) this.canvas_render.className += " game-canvas-scale"
    this.parent.appendChild(this.canvas_render);
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
    if (cwidth > this.width || cheight > this.height) {
        if (this.scale) {
            var scale = this.scale;
            cwidth = width / scale;
            cheight = height / scale;
            cleft = (width - cwidth) / 2;
            ctop = (height - cheight) / 2;
            this.canvas_render.className += " game-canvas-scale";
            this.canvas_render.style.webkitTransform = "scale(" + this.scale + ")";            
        }
    } else {
        this.canvas_render.className = this.canvas_render.className.replace(/game-canvas-scale/g, '');
        this.canvas_render.style.webkitTransform = "scale(1)";
    }
    this.sizeCanvas(this.canvas_render, cleft, ctop, cwidth, cheight);
}

View.prototype.sizeCanvas = function(canvas, left, top, width, height) { 
    canvas.style.left = left + "px";
    canvas.style.top = top + "px";
    canvas.width = width;
    canvas.height = height;
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
    if (stage.level.itemrendermanager) {
        if (stage.level.itemrendermanager.theme && stage.level.itemrendermanager.theme.background) {
            this.canvas_render.style.background = stage.level.itemrendermanager.theme.background.color;
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
    this.renderer.render(now, stage, this.ctx_render, this.canvas_render.width, this.canvas_render.height);
}