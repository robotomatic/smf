"use strict";

function CharactersView(id, playertotal, playernum, width, height, scale, quality) {
    this.quality = quality;
    this.view = new View(id, width, height, scale, this.quality);
    this.playertotal = playertotal;
    this.playernum = playernum;
};

CharactersView.prototype.view;
CharactersView.prototype.resizeText = function() { this.view.resizeText(); }
CharactersView.prototype.show = function() { this.view.show(); }
CharactersView.prototype.hide = function() { this.view.hide(); }

CharactersView.prototype.resize = function() { this.view.resize(); }
CharactersView.prototype.resizeUI = function() { }

CharactersView.prototype.initialize = function(stage) {
    this.view.initialize(stage);
}

CharactersView.prototype.update = function(now, delta, stage) {
    this.view.update(now, delta, stage);
}

CharactersView.prototype.setMessage = function(message) { 
    this.view.setMessage(message);
}

CharactersView.prototype.updateUI = function(stage) {
    if (!this.view.updateUI()) return;
}

CharactersView.prototype.render = function(now, stage) {
    
    // todo: this is fucked
    
    this.view.renderer.mbr.x = (stage.level.width / 2) - 25;
    var numplayers = this.playertotal;
    var n = numplayers - this.playernum;
    var pad = (numplayers == 1) ? 120 : (n == 1) ? 101 : 100 + (n * 5);
    this.view.renderer.mbr.y = pad + (this.playernum * 200);
    this.view.renderer.mbr.width = 50;
    this.view.renderer.mbr.height = 90;
    this.view.render(now, stage);
}

