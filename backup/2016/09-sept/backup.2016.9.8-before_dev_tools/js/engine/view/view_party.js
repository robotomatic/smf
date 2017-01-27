"use strict";

function PartyView(id, width, height, scale, levelquality, playerquality) {
    this.view = new View(id, width, height, scale, levelquality, playerquality);
    var controller = this;
    this.view.parent.onclick = function() {
        /*
        toggleFullScreen();
        controller.resize();
        */
        controller.view.renderer.camera.shakeScreen(1.2, 800);
    }
    this.viewpad = 250;
    
    var mobile = isMobile();
    this.playerpad = mobile ? 200 : 200;
    
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

PartyView.prototype.update = function(now, delta, game) {
    this.view.update(now, delta, game.stage);
}

PartyView.prototype.render = function(now, game) { 
    var stage = game.stage;
    var pad = (stage.players.players.length == 1) ? this.playerpad : this.viewpad;
    this.view.renderer.mbr = stage.players.getMbr(pad, this.view.renderer.mbr);
    stage.players.sortByHeight();
    this.view.render(now, stage);
}

PartyView.prototype.setMessage = function(message) { }

PartyView.prototype.updateUI = function() { }
PartyView.prototype.updatePlayerUI = function(player, ui) { }

