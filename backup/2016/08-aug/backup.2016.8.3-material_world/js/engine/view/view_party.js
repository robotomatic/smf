"use strict";

function PartyView(id, width, height, scale, levelquality, playerquality) {
    this.levelquality = levelquality;
    this.playerquality = playerquality;
    this.view = new View(id, width, height, scale, this.levelquality, this.playerquality);
    var controller = this;
    this.view.canvas_render.onclick = function() {
        toggleFullScreen();
        controller.resize();
        controller.view.renderer.camera.shakeScreen(1.2, 800);
    }
    this.viewpad = 150;
    
    var mobile = isMobile();
    this.playerpad = mobile ? 100 : 100;
}

PartyView.prototype.view;
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

PartyView.prototype.initialize = function(stage) {
    this.view.initialize(stage);
}

PartyView.prototype.update = function(now, delta, stage) {
    this.view.update(now, delta, stage);
}

PartyView.prototype.render = function(now, stage) { 
    var pad = (stage.players.players.length == 1) ? this.playerpad : this.viewpad;
    this.view.renderer.mbr = stage.players.getMbr(pad, this.view.renderer.mbr);
    stage.players.sortByHeight();
    this.view.render(now, stage);
}

PartyView.prototype.setMessage = function(message) { }

PartyView.prototype.updateUI = function() { }
PartyView.prototype.updatePlayerUI = function(player, ui) { }

