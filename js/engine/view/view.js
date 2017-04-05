"use strict";

function View(game, id, quality, action) {
    this.id = id;
    this.game = game;
    
    this.width = quality.width;
    this.height = quality.height;
    this.maxwidth = quality.width;
    this.maxheight = quality.height;
    this.scale = quality.scale;

    this.viewscale = 1;
    this.paused = false; 
    
    this.parent = document.getElementById("main");
    if (action) {
        var v = this;
        this.parent.onclick = function(e) {
            if (v.paused) return;
            action(e, game);
        }
    }
    
    this.renderer = new ViewRenderer(this);
    this.viewsizer = new ViewSizer(this);
    
    this.rendertarget = {
        canvas : null,
        ctx : null,
        fit : true,
        auto : true,
        scale : 0
    }
    
    this.createView();
}




View.prototype.setCameraAll = function() {
    this.setCameraZoom("all");
}

View.prototype.setCameraFit = function() {
    this.setCameraZoom("fit");
}

View.prototype.setCameraLoose = function() {
    this.setCameraZoom("loose");
}

View.prototype.setCameraComfy = function() {
    this.setCameraZoom("comfy");
}

View.prototype.setCameraTight = function() {
    this.setCameraZoom("tight");
}

View.prototype.setCameraZoom = function(zoom) {
    this.renderer.setCameraZoom(zoom);
    this.game.gamecontroller.gamesettings.settings.camera.view = zoom;
    this.game.gamecontroller.saveGameSettings();
    updateDevViewCameraOffset(this);
}





View.prototype.createView = function() {
    this.rendertarget.canvas = new GameCanvas("gamecanvas");
    this.rendertarget.canvas.setClassName("absolute game-canvas");
    var main = document.getElementById("main-content");
    if (main) {
        this.rendertarget.canvas.attach(main);
    }
}




View.prototype.reset = function(when) { 
    this.parent.style.background = "white";
    this.rendertarget.canvas.setBackground("white");
    this.renderer.reset(when);
}




View.prototype.pause = function(when) { 
    this.paused = true;
}

View.prototype.resume = function(when) { 
    this.paused = false;
}




View.prototype.toggleBlur = function() { 
    this.renderer.camera.blur.blur = !this.renderer.camera.blur.blur;
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
    this.width = Number(w);
    this.height = Number(h);
    this.resize();
}

View.prototype.setRatio = function(r) { 
    if (!r || !isNumeric(r)) return;
    this.width = this.height * r;
    this.resize();
}




View.prototype.resize = function() {
    this.viewsizer.resize();
}




View.prototype.show = function() { }

View.prototype.hide = function() { }




View.prototype.update = function(now, delta, world, paused) {
}




View.prototype.render = function(now, world, paused) {
    this.renderer.render(now, world, paused);
}

View.prototype.updateFPS = function(type, fps, avg) {
    this.renderer.updateFPS(type, fps, avg);
}
