"use strict";

function View(id, width, height, scale, levelquality, playerquality) {
    if (!id) return;
    this.id = id;
    this.width = width;
    this.height = height;
    this.maxwidth = width;
    this.maxheight = height;
    this.renderer = new ViewRenderer(levelquality, playerquality);
    this.scale = scale;
    this.parent = document.getElementById(this.id);
    
    this.bluramount = 2;
    var v = new ViewGraphics(this.bluramount);
    this.graphics = v.graphics;
    this.blur = true;
    
    this.view = {
        canvas : null,
        ctx : null,
        fit : true,
        auto : true,
        scale : 0
    }
    
    this.viewscale = 1;

    this.ready = false;
    this.createGraphics();
    this.createView();
}

View.prototype.setBlur = function(amount) { 
    this.blur = amount > 0 ? true : false;
    this.bluramount = amount;
    this.setGraphicsBlur(amount);
}

View.prototype.toggleBlur = function() { 
    this.blur = !this.blur;
    var amount = this.blur ? this.bluramount : 0;
    this.setGraphicsBlur(amount);
}

View.prototype.setGraphicsBlur = function(blur) { 
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        if (this.graphics[keys[i]].blur != undefined) this.graphics[keys[i]].blur = this.blur ? this.bluramount : false;
    }
}

View.prototype.toggleStretch = function() { 
    this.view.fit = !this.view.fit;
    this.resize();
}

View.prototype.toggleAuto = function() { 
    this.view.auto = !this.view.auto;
    this.resize();
}

View.prototype.setSize = function(s) { 
    if (!s.length == 2) return;
    var w = s[0];
    var h = s[1];
    if (!w || !isNumeric(w) || !h || !isNumeric(h)) return;
    this.width = w;
    this.height = h;
    this.resize();
}

View.prototype.setRatio = function(r) { 
    if (!r || !isNumeric(r)) return;
    this.width = this.height * r;
    this.resize();
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
    if (graphics.css) graphics.canvas.className += " " + graphics.css;
}


View.prototype.createView = function() {
    this.view.canvas = document.createElement('canvas');
    this.view.ctx = this.view.canvas.getContext("2d");
    this.view.canvas.className = "absolute game-canvas";
    this.parent.appendChild(this.view.canvas);
}

View.prototype.resize = function() {

    var rect = this.parent.getBoundingClientRect();
    var rwidth = rect.width;
    var rheight = rect.height;
    
    logDev();
    logDev("window: " + rwidth + " x " + rheight);

    var cwidth = this.width;
    var cheight = this.height;

    if (this.view.auto) {
        var r = rheight / rwidth;
        cheight = cwidth * r;
    }
    
    if (cwidth > rwidth) {
        cwidth = rwidth;
    } else if (cwidth < this.maxwidth) {
        cwidth = rwidth;
    }
    
    if (cheight > rheight) {
        cheight = rheight;
    } else if (cheight < this.maxheight) {
        cheight = rheight;
    }

    this.height = round(cheight);
    this.width = round(cwidth);
    
    var p = round(cwidth / this.width) * 100;
    logDev("canvas: " + cwidth + " x " + cheight + " == " + p + "%");
    
    var ctop = (rheight - cheight) / 2;
    var cleft = (rwidth - cwidth) / 2;
    
    this.sizeViewGraphics(cleft, ctop, cwidth, cheight);
    
    logDev();
}

View.prototype.sizeViewGraphics = function(left, top, width, height) { 
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = this.graphics[keys[i]];
        this.sizeGraphics(g, left, top, width, height);
    }
    this.sizeGraphics(this.view, left, top, width, height);
}

View.prototype.sizeGraphics = function(graphics, left, top, width, height) { 
    var canvas = graphics.canvas;
    canvas.style.left = left + "px";
    canvas.style.top = top + "px";
    canvas.width = width;
    canvas.height = height;
    
    var rect = this.parent.getBoundingClientRect();
    var rwidth = rect.width;
    var rheight = rect.height;
    var s = round(rwidth / width);
    this.viewscale = s;
    
    var sw = round(width * s);
    var dw = round(sw - width);
    var sh = round(height * s);
    var dh = round(sh - height);

    if (graphics.fit) {
        canvas.style.left -= dw / 2;
        canvas.style.top -= dh / 2;
        canvas.style.webkitTransform = "scale(" + (s) + ")";
        graphics.scale = s;
        logDev("view scale: " + s); 
        logDev("width: " + sw + ", height: " + sh);
        return;
    }

    // this.viewscale = 1;
    canvas.style.webkitTransform = "scale(1)";
    graphics.scale = 0;
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
            this.view.canvas.style.background = stage.level.itemrenderer.theme.background.canvas.color;
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
}

View.prototype.render = function(now, stage) {
    if (!this.ready) this.initialize(stage);
    this.renderer.render(now, stage, this.view, this.graphics);
}