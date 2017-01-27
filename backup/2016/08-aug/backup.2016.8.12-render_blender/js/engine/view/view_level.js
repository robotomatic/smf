"use strict";

function LevelView(id, width, height, scale, quality) {
    this.quality = quality;
    this.view = new View(id, width, height, scale, this.quality);
    this.view.canvas_render.style.background = "white";
    this.view.canvas_render.className += " round-corners";
}

LevelView.prototype.view;
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

LevelView.prototype.initialize = function(stage) {
    this.view.initialize(stage);
}

LevelView.prototype.update = function(now, delta, game) {
    this.view.update(now, delta, game.stage);
}

LevelView.prototype.render = function(now, game) {
    var stage = game.stage;
    this.view.renderer.mbr.x = 0;
    this.view.renderer.mbr.y = 0;
    this.view.renderer.mbr.width = stage.level.width;
    this.view.renderer.mbr.height = stage.level.height;
    this.view.render(now, stage);
}

LevelView.prototype.setMessage = function(message) { 
//    this.view.setMessage(message);
}

LevelView.prototype.updateUI = function() {
//    if (!this.view.updateUI()) return;
//    //this.view.ui.setMessage("Ready");
}