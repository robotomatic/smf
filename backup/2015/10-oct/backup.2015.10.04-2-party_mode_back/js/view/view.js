function View(id, width, height) {
    if (!id) return;
    this.id = id;
    this.width = width;
    this.height = height;
    this.maxwidth = 10000;
    this.maxheight = 10000;
    this.parent = document.getElementById(this.id);
    this.canvas = new Array();
    this.dirty = false;
    this.ui = null;
    this.uiready = false;
    this.dev = null;
    this.drawPlayerShadows = false;
    this.playerShadowBlur = 5;
    this.playerShadowColor = "#585858";
    this.canvas_buffer = document.createElement('canvas');
    this.ctx_buffer = this.canvas_buffer.getContext("2d");
    this.canvas_render = document.createElement('canvas');
    this.canvas_render.className = "fade-hide";
    this.ctx_render = this.canvas_render.getContext("2d");
    this.parent.appendChild(this.canvas_render);
    this.dorender = false;
    this.renderdelay = 1;
    this.last = timestamp();
    this.alpha = 0;
    var uie = document.getElementById(this.id + "-ui");
    if (uie) this.ui = new UI(uie);
}

View.prototype.removeCanvases = function() { 
    var canvas = this.parent.getElementsByTagName("canvas");
    for(var i = 0; i < canvas.length; i++) this.parent.removeChild(canvas[i]);
}

View.prototype.setLevel = function(level) { 
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]); 
    if (level.background && level.background.color) this.canvas_render.style.background = level.background.color;
}

View.prototype.addLayer = function(layer) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    this.canvas[layer.name] = {"canvas" : c, "context" : ctx};
}

View.prototype.resize = function() {
    var pw = this.parent.offsetWidth;
    var ph = this.parent.offsetHeight;
    for (var layername in this.canvas) {
        this.canvas[layername].canvas.width = (pw > this.maxwidth) ? this.maxwidth : pw;
        this.canvas[layername].canvas.height = (ph > this.maxheight) ? this.maxheight : ph;
        var dx = pw - this.canvas[layername].canvas.width;
        var dy = ph - this.canvas[layername].canvas.height;
        this.canvas[layername].canvas.style.left = (dx / 2) + "px";
        this.canvas[layername].canvas.style.top = (dy / 2) + "px";
    }
    this.canvas_buffer.width = (pw > this.maxwidth) ? this.maxwidth : pw;
    this.canvas_buffer.height = (ph > this.maxheight) ? this.maxheight : ph;
    this.canvas_render.width = (pw > this.maxwidth) ? this.maxwidth : pw;
    this.canvas_render.height = (ph > this.maxheight) ? this.maxheight : ph;
    var px = pw - this.canvas_render.width;
    var py = ph - this.canvas_render.height;
    var diff = (pw > ph) ? pw / this.canvas_render.width : ph / this.canvas_render.height;
    var pad = diff - (diff / 20);
    //this.canvas_render.style.webkitTransform = "scale(" + pad + ")";
    this.canvas_render.style.left = (px / 2) + "px";
    this.canvas_render.style.top = (py / 2) + "px";
    this.dirty = true;
}

View.prototype.resizeUI = function() { 
    if (this.ui) {
        var view = getViewWindow(this.canvas_render, this.width, this.height);
        var pad = 15;
        this.ui.setLocation(view.x + pad, view.y + pad);
        this.resizeText();
    }
}

View.prototype.resizeText = function() {
    if (this.ui) {
        var ui = this.ui.getUI();
        var p = ui.parentNode;
        var pw = ui.offsetWidth;
        var fs = Number(pw / 50);
        if (fs > 12) fs = 12;
        ui.style.fontSize = fs + "px";
    }
}

View.prototype.show = function() { 
    fadeIn(this.canvas_render);
}

View.prototype.hide = function() { 
    fadeOut(this.canvas_render);
    fadeOut(this.ui.getUI());
}

View.prototype.render = function() {
    if (!this.dorender) {
        var now = timestamp();
        var dt = (now - this.last) / 1000;
        if (dt < this.renderdelay) return false;
        this.dorender = true;
        this.last = now;
    }
    if (this.alpha < 1) {
        this.ctx_render.globalAlpha = this.alpha;
        this.alpha += .01;
    }
    return true;
}

View.prototype.setMessage = function(message) { 
    if (this.ui) this.ui.setMessage(message);
}

View.prototype.updateUI = function() { 
    if (this.aplha < 0) return false;
    if (!this.uiready) {
        fadeIn(this.ui.getUI());
        this.uiready = true;
    }
    return this.uiready;
}