"use strict";

function PartyView(id, width, height, scale) {
    this.view = new View(id, width, height, scale);
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
        y : 300,
        z : 500,
        name : "loose",
        tight : {
            x : 0,
            y : -150,
            z : 25
        },
        comfy : {
            x : 0,
            y : -50,
            z : 100
        },
        loose : {
            x : 0,
            y : 300,
            z : 500
        }
    };

    this.view.renderer.camera.blur.blur = false;
    this.view.renderer.camera.blur.shift = false;
    this.view.renderer.camera.drift.enabled = true;
}


PartyView.prototype.setCameraLoose = function() {
    this.offset.x = this.offset.loose.x;
    this.offset.y = this.offset.loose.y;
    this.offset.z = this.offset.loose.z;
    this.offset.name = "loose";
    updateDevViewCameraOffset(this);
}

PartyView.prototype.setCameraComfy = function() {
    this.offset.x = this.offset.comfy.x;
    this.offset.y = this.offset.comfy.y;
    this.offset.z = this.offset.comfy.z;
    this.offset.name = "Comfy";
    updateDevViewCameraOffset(this);
}

PartyView.prototype.setCameraTight = function() {
    this.offset.x = this.offset.tight.x;
    this.offset.y = this.offset.tight.y;
    this.offset.z = this.offset.tight.z;
    this.offset.name = "tight";
    updateDevViewCameraOffset(this);
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

PartyView.prototype.initialize = function(world) {
    this.view.initialize(world);
}

PartyView.prototype.update = function(now, delta, game) {
    this.view.update(now, delta, game.world);
}

PartyView.prototype.render = function(now, game) { 

    var world = game.world;
    this.view.renderer.mbr = world.players.getMbr(this.view.renderer.mbr);

    var offx = this.offset.x;
    this.view.renderer.mbr.x -= offx;
    this.view.renderer.mbr.width += offx;
    
    var offy = this.offset.y;
    this.view.renderer.mbr.y -= offy;
    this.view.renderer.mbr.height += offy;
    
    var offz = this.offset.z;
    this.view.renderer.mbr.z -= offz;
    this.view.renderer.mbr.depth += offz;
    
    this.view.render(now, world);
}

PartyView.prototype.setMessage = function(message) { }

PartyView.prototype.updateUI = function() { }
PartyView.prototype.updatePlayerUI = function(player, ui) { }

