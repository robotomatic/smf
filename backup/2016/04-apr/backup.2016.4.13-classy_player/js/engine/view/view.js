"use strict";

function View(id, width, height, quality, scale) {
    if (!id) return;
    this.id = id;
    this.width = width;
    this.height = height;
    this.renderer = new ViewRenderer(quality);
    this.scale = scale;
    this.parent = document.getElementById(this.id);

    // todo: start with 1 bg & 1 fg canvas at first. bg will never have to be wiped!!!!
    this.canvas_buffer = document.createElement('canvas');
    this.ctx_buffer = this.canvas_buffer.getContext("2d");
    this.canvas_render = document.createElement('canvas');
    this.ctx_render = this.canvas_render.getContext("2d");
    this.canvas_render.className = "fade-hide absolute game-canvas";
    if (this.scale) this.canvas_render.className += " game-canvas-scale"
    this.parent.appendChild(this.canvas_render);
}

View.prototype.setLevel = function(level) { 
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]); 
}

View.prototype.addLayer = function(layer) { }

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
    this.sizeCanvas(this.canvas_buffer, cleft, ctop, cwidth, cheight);
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

View.prototype.update = function(now, stage) {
    this.updateUI();
    return true;
}

View.prototype.setMessage = function(message) { }

View.prototype.updateUI = function() {
    // todo: debounce UI updates
}

View.prototype.render = function(now, stage) {
    if (!this.ready) {
        if (stage.level.itemrenderer) {
            if (stage.level.itemrenderer.theme && stage.level.itemrenderer.theme.background) {
                this.canvas_render.style.background = stage.level.itemrenderer.theme.background.color;
            }
        }
        this.ready = true;
    }
    this.renderer.render(now, stage, this.ctx_buffer, this.canvas_render.width, this.canvas_render.height);
    clearRect(this.ctx_render, 0, 0, this.canvas_render.width, this.canvas_render.height);
    this.ctx_render.drawImage(this.canvas_buffer, 0, 0);
}