"use strict";

function LevelView(id, width, height, scale, quality) {
    this.quality = quality;
    this.view = new View(id, width, height, scale, this.quality);
    this.view.canvas_render.style.background = "white";
    this.view.canvas_render.className += " round-corners";
}

LevelView.prototype.view;
LevelView.prototype.setLevel = function(level) { 
    level.background = "";
    this.view.setLevel(level); 
}
LevelView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
LevelView.prototype.resizeText = function() { this.view.resizeText(); }
LevelView.prototype.show = function() { 
    this.resizeUI();
    this.view.show(); 
}
LevelView.prototype.hide = function() { this.view.hide(); }

LevelView.prototype.resize = function() { 
    this.view.resize(); 
    this.resizeUI();
}
LevelView.prototype.resizeUI = function() { this.view.resizeUI(); }

LevelView.prototype.render = function(now, stage) {
    this.view.renderer.mbr.x = 0;
    this.view.renderer.mbr.y = 0;
    this.view.renderer.mbr.width = stage.level.width;
    this.view.renderer.mbr.height = stage.level.height;
    this.view.render(now, stage);
}

LevelView.prototype.update = function(now, delta, stage) {
    this.view.update(now, delta, stage);
}

LevelView.prototype.setMessage = function(message) { 
//    this.view.setMessage(message);
}

LevelView.prototype.updateUI = function() {
//    if (!this.view.updateUI()) return;
//    //this.view.ui.setMessage("Ready");
}