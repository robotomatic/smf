"use strict";

function CharactersView(id, playernum, width, height, scale) {
    this.quality = 5;
    this.view = new View(id, width, height, this.quality, scale);
    this.playernum = playernum;
};

CharactersView.prototype.view;
CharactersView.prototype.setLevel = function(level) { this.view.setLevel(level); }
CharactersView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
CharactersView.prototype.resizeText = function() { this.view.resizeText(); }
CharactersView.prototype.show = function() { this.view.show(); }
CharactersView.prototype.hide = function() { this.view.hide(); }

CharactersView.prototype.resize = function() { this.view.resize(); }
CharactersView.prototype.resizeUI = function() { }

CharactersView.prototype.update = function(now, stage) {
    this.view.update(now, stage);
}

CharactersView.prototype.setMessage = function(message) { 
    this.view.setMessage(message);
}

CharactersView.prototype.updateUI = function(stage) {
    if (!this.view.updateUI()) return;
}

CharactersView.prototype.render = function(now, stage) { 

    this.view.renderer.mbr.x = (stage.level.width / 2) - 25;
    
    var numplayers = 4;
    var n = numplayers - this.playernum;
    var pad = (n == 1) ?  99 : 98 + (n * 5);
    this.view.renderer.mbr.y = pad + (this.playernum * 200);
    
    this.view.renderer.mbr.width = 50;
    this.view.renderer.mbr.height = 100;
    
    this.view.render(now, stage, this.playernum);
}

