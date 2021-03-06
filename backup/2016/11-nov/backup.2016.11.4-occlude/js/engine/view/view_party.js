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
    
    this.offset = {
        x : 0,
        y : 0,
        z : 100
    }
    
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
    this.view.renderer.mbr = stage.players.getMbr(this.view.renderer.mbr);

    var offx = this.offset.x;
    this.view.renderer.mbr.x -= offx;
    this.view.renderer.mbr.width += offx;
    
    var offy = this.offset.y;
    this.view.renderer.mbr.y -= offy;
    this.view.renderer.mbr.height += offy;
    
    var offz = this.offset.z;
    this.view.renderer.mbr.z -= offz;
    this.view.renderer.mbr.depth += offz;
    
    stage.players.sortByHeight();
    this.view.render(now, stage);
}

PartyView.prototype.setMessage = function(message) { }

PartyView.prototype.updateUI = function() { }
PartyView.prototype.updatePlayerUI = function(player, ui) { }

