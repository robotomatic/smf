"use strict";

function View(gamecontroller, id, width, height, scale) {
    if (!id) return;
    this.gamecontroller = gamecontroller;
    this.id = id;
    this.width = width;
    this.height = height;
    this.maxwidth = width;
    this.maxheight = height;
    this.renderer = new ViewRenderer();
    this.scale = scale;
    this.parent = document.getElementById("main");
    
    this.bluramount = 2;
    var v = new ViewGraphics(this.bluramount);
    this.graphics = v.graphics;
    this.blur = true;
    
    this.rendertarget = {
        canvas : null,
        ctx : null,
        fit : true,
        auto : true,
        scale : 0
    }

    this.viewscale = 1;
    
    this.fps = 0;
    this.avg = 0;
    this.tx = 20;
    this.ty = 20;
    this.fpstext = new Text(this.tx, this.ty, "FPS: ");

    this.ready = false;
    this.paused = false;
    
    this.doublebuffer = true;
    
    this.createGraphics();
    this.createView(gamecontroller);
    
    this.image = new Image(null, 0, 0, 0, 0);
    
}

View.prototype.reset = function(when) { 
    this.parent.style.background = "white";
    this.rendertarget.canvas.setBackground("white");
    this.ready = false;
}

View.prototype.pause = function(when) { 
    this.paused = true;
}

View.prototype.resume = function(when) { 
    this.paused = false;
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
    this.rendertarget.fit = !this.rendertarget.fit;
    this.resize();
}

View.prototype.toggleAuto = function() { 
    this.rendertarget.auto = !this.rendertarget.auto;
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
    graphics.canvas = new GameCanvas("");
    var classname = "absolute game-canvas";
    if (graphics.css) classname += " " + graphics.css;
    graphics.canvas.setClassName(classname);
}

View.prototype.createView = function(gamecontroller) {
    this.rendertarget.canvas = new GameCanvas("gamecanvas");
    this.rendertarget.canvas.setClassName("absolute game-canvas");
    var main = document.getElementById("main-content");
    if (main) {
        this.rendertarget.canvas.attach(main);
    }
}

View.prototype.resize = function() {

    var rect = this.parent.getBoundingClientRect();
    var rwidth = rect.width;
    var rheight = rect.height;
    
    if (!rwidth || !rheight) return;
    
    logDev("window: " + rwidth + " x " + rheight);

    var cwidth = this.width;
    var cheight = this.height;

    if (this.rendertarget.auto) {
        var r = rheight / rwidth;
        cheight = cwidth * r;
    }
    
    if (cwidth > rwidth) {
        cwidth = rwidth;
    }
    
    if (cheight > rheight) {
        cheight = rheight;
    }

    this.height = round(cheight);
    this.width = round(cwidth);
    
    var p = round(cwidth / this.width) * 100;
    logDev("canvas: " + cwidth + " x " + cheight + " == " + p + "%");
    
    var ctop = (rheight - cheight) / 2;
    var cleft = (rwidth - cwidth) / 2;
    
    this.sizeViewGraphics(cleft, ctop, cwidth, cheight);
    
    logDev("");
}

View.prototype.sizeViewGraphics = function(left, top, width, height) { 
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = this.graphics[keys[i]];
        this.sizeGraphics(g, left, top, width, height);
    }
    this.sizeGraphics(this.rendertarget, left, top, width, height);
}

View.prototype.sizeGraphics = function(graphics, left, top, width, height) { 
    
    var canvas = graphics.canvas;
    canvas.setPosition(left, top);
    canvas.setSize(width, height);
    
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
        var testheight = height * s;
        if (testheight > rheight) {
            var newheight = rheight / s;
            canvas.setSize(width, newheight);
            var newtop = round((rheight - newheight) / 2);
            canvas.setPosition(left, newtop);
            sh = newheight * s;
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

View.prototype.resizeUI = function() { }
    
View.prototype.resizeText = function() { }

View.prototype.show = function() { 
}

View.prototype.hide = function() { 
    return;
}

View.prototype.setBackground = function(world) {
    if (this.paused) return;
    if (world.worldrenderer.debug.level.level || world.worldrenderer.debug.level.render || world.worldrenderer.debug.level.hsr) {
        this.parent.style.background = "white";
        this.rendertarget.canvas.setBackground("white");
        this.ready = false;
    } else if (world.worldrenderer.itemrenderer) {
        if (!this.ready) {
            if (world.worldrenderer.itemrenderer.theme && world.worldrenderer.itemrenderer.theme.background) {
                this.parent.style.background = world.worldrenderer.itemrenderer.theme.background.color;
                this.rendertarget.canvas.setBackground(world.worldrenderer.itemrenderer.theme.background.canvas.color);
            } else {
                this.parent.style.background = "";
                this.rendertarget.canvas.setBackground("");
            }
            this.ready = true;
        }
    }
}

View.prototype.update = function(now, delta, world) {
    this.updateUI();
    return true;
}

View.prototype.setMessage = function(message) { }

View.prototype.updateUI = function() {
}

View.prototype.render = function(now, world, render) {
    this.setBackground(world);
    if (this.doublebuffer) {
        this.clearGraphics();
        this.renderer.render(now, world, this.rendertarget.canvas.width, this.rendertarget.canvas.height, this.graphics["main"], render, this.gamecontroller.paused);
        this.renderView();
    } else {
        this.clearViewGraphics(this.rendertarget);
        this.renderer.render(now, world, this.rendertarget.canvas.width, this.rendertarget.canvas.height, this.rendertarget, render, this.gamecontroller.paused);
    }
    this.renderFPS();
}

View.prototype.clearGraphics = function() {
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        this.clearViewGraphics(this.graphics[keys[i]]);
    }
    this.clearViewGraphics(this.rendertarget);
}

View.prototype.clearViewGraphics = function(graphics) {
    graphics.canvas.clear()
}

View.prototype.renderView = function() {
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        this.renderViewGraphics(this.graphics[keys[i]]);
    }
}

View.prototype.renderViewGraphics = function(graphics) {
    graphics.canvas.commit();
    this.image.width = graphics.canvas.width;
    this.image.height = graphics.canvas.height;
    this.image.data = graphics.canvas.getData();
    this.image.draw(this.rendertarget.canvas);
}

View.prototype.updateFPS = function(type, fps, avg) {
    this.fps = fps;
    this.avg = avg;
}

View.prototype.renderFPS = function() {
    if (!__dev) return;
    var fps = round(this.fps);
    if (fps < 10) fps = "0" + fps;
    var avg = round(this.avg);
    if (avg < 10) avg = "0" + avg;
    this.fpstext.message = this.paused ? "PAUSE" : "FPS: " + fps + "\n" + "AVG: " + avg;
    this.fpstext.x = this.tx;
    this.fpstext.y = this.ty;
    this.rendertarget.canvas.setFillStyle("black");
    this.rendertarget.canvas.beginPath();
    this.fpstext.draw(this.rendertarget.canvas, 8);
}