"use strict";

function PartyView(id, width, height, scale, levelquality, playerquality) {
    this.levelquality = levelquality;
    this.playerquality = playerquality;
    this.view = new View(id, width, height, scale, this.levelquality, this.playerquality);
    var controller = this;
    this.view.canvas_render.onclick = function() {
        controller.view.renderer.camera.shakeScreen(1.2, 800);
    }
    this.viewpad = 150;
    this.playerpad = 250;
}

PartyView.prototype.view;
PartyView.prototype.setLevel = function(level) { this.view.setLevel(level); }
PartyView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
PartyView.prototype.resizeText = function() { this.view.resizeText(); }
PartyView.prototype.show = function() { 
    this.resizeUI();
    this.view.show(); 
}
PartyView.prototype.hide = function() { this.view.hide(); }

PartyView.prototype.resize = function() { 
    this.view.resize();
    this.resizeUI();
}
PartyView.prototype.resizeUI = function() { 
    this.view.resizeUI(); 
}

PartyView.prototype.render = function(now, stage) { 
    var pad = (stage.players.players.length == 1) ? pad = this.playerpad : pad = this.viewpad;
    this.view.renderer.mbr = stage.players.getMbr(pad, this.view.renderer.mbr);
    stage.players.sortByHeight();
    this.view.render(now, stage);
}

PartyView.prototype.setMessage = function(message) { }

PartyView.prototype.update = function(now, stage) {
    this.view.update(now, stage);
}

PartyView.prototype.updateUI = function() { }
PartyView.prototype.updatePlayerUI = function(player, ui) { }

