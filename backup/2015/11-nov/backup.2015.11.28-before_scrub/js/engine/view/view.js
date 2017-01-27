function View(id, width, height, scale, canvasclass) {
    if (!id) return;
    this.id = id;
    this.width = width;
    this.height = height;

    this.maxwidth = 1200;
    this.maxheight = 800;
    
    this.parent = document.getElementById(this.id);
    this.canvas = new Array();
    this.dirty = false;
    this.ui = null;
    this.uiready = false;
    
    this.drawoutlines = false;

    this.drawshadows = false;
    this.shadowblur = 1;
    this.shadowcolor = "#585858";
    
    this.canvas_buffer = document.createElement('canvas');
    this.ctx_buffer = this.canvas_buffer.getContext("2d");
    this.canvas_render = document.createElement('canvas');
    this.canvas_render.className = "fade-hide absolute ";
    this.canvas_render.className += (canvasclass) ? canvasclass : "game-canvas";

    this.scale = scale;
    if (this.scale) this.canvas_render.className += " game-canvas-scale"
    
    this.ctx_render = this.canvas_render.getContext("2d");
    
    this.parent.appendChild(this.canvas_render);
    this.dorender = false;
    this.renderdelay = 1;
    this.last = timestamp();
    this.alpha = 0;
    var uie = document.getElementById(this.id + "-text");
    if (uie) this.ui = new UI(uie);
}

View.prototype.removeCanvases = function() { 
    var canvas = this.parent.getElementsByTagName("canvas");
    for(var i = 0; i < canvas.length; i++) this.parent.removeChild(canvas[i]);
}

View.prototype.setLevel = function(level) { 
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]); 
}

View.prototype.addLayer = function(layer) {
    if (layer.outline) {
        var oc = document.createElement('canvas');
        var octx = oc.getContext("2d");
        this.canvas[layer.name + "-outline"] = {"canvas" : oc, "context" : octx};
    }
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    this.canvas[layer.name] = {"canvas" : c, "context" : ctx};
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
    var doscale = false;
    if (cwidth > this.maxwidth || cheight > this.maxheight) {
        if (this.scale) {
            var scale = this.scale;
            cwidth = width / scale;
            cheight = height / scale;
            cleft = (width - cwidth) / 2;
            ctop = (height - cheight) / 2;
            doscale = true;
            this.canvas_render.className += " game-canvas-scale";
        }
    } else this.canvas_render.className = this.canvas_render.className.replace(/game-canvas-scale/g, '');
    for (var layername in this.canvas) {
        if (this.canvas[String(layername + "-outline")]) this.sizeCanvas(this.canvas[String(layername + "-outline")].canvas, cleft, ctop, cwidth, cheight);
        this.sizeCanvas(this.canvas[layername].canvas, cleft, ctop, cwidth, cheight);
    }
    this.sizeCanvas(this.canvas_buffer, cleft, ctop, cwidth, cheight);
    this.sizeCanvas(this.canvas_render, cleft, ctop, cwidth, cheight)
    if (doscale) this.canvas_render.style.webkitTransform = "scale(" + this.scale + ")";
    else this.canvas_render.style.webkitTransform = "scale(1)";
    this.dirty = true;
}

View.prototype.sizeCanvas = function(canvas, left, top, width, height) { 
    canvas.style.left = left + "px";
    canvas.style.top = top + "px";
    canvas.width = width;
    canvas.height = height;
}

View.prototype.resizeUI = function() { 
    if (this.ui) {
        var view = getViewWindow(this.canvas_render, this.width, this.height);
        var bw = ((this.canvas_render.offsetWidth) - view.width) / 2;
        var bh = (this.canvas_render.offsetHeight - view.height) / 2;
        var pad = 15;
        this.ui.setLocation(view.x +bw + pad, view.y +bh + pad + 5);
        this.resizeText();
    }
}
    
View.prototype.resizeText = function() {
    if (this.ui) {
        var ui = this.ui.getUI();
        var p = ui.parentNode;
        var pw = ui.offsetWidth;
        var fs = Number(pw / 30);
        if (fs > 15) fs = 15;
        ui.style.fontSize = fs + "px";
    }
}

View.prototype.show = function() { 
    fadeIn(this.canvas_render);
}

View.prototype.hide = function() { 
    fadeOut(this.canvas_render);
    if (this.ui) fadeOut(this.ui.getUI());
}

View.prototype.render = function(delta, stage) {
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
        if (this.ui) fadeIn(this.ui.getUI());
        this.uiready = true;
    }
    if (this.devtools) this.devtools.update();
    return this.uiready;
}