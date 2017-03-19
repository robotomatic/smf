"use strict";

function PartyView(gamecontroller, id, width, height, scale) {
    this.view = new View(gamecontroller, id, width, height, scale);
    var controller = this;
    gamecontroller.main.onclick = function() {
        /*
        toggleFullScreen();
        controller.resize();
        */
        if (controller.paused) return;
        controller.view.renderer.camera.shakeScreen(1.2, 800);
    }
    
    this.offset = {
        x : 0,
        y : 300,
        z : 500,
        name : "loose",
        tight : {
            x : 0,
            y : -125,
            z : 25
        },
        cosy : {
            x : 0,
            y : -50,
            z : 100
        },
        comfy : {
            x : 0,
            y : 100,
            z : 150
        },
        loose : {
            x : 0,
            y : 300,
            z : 500
        }
    };

    this.rendercount = 0;
    this.renderwait = 10;
    
    this.view.renderer.camera.blur.blur = false;
    this.view.renderer.camera.blur.shift = false;
    this.view.renderer.camera.drift.enabled = true;
}

PartyView.prototype.setCameraLoose = function() {
    this.setCameraZoom("loose");
}

PartyView.prototype.setCameraComfy = function() {
    this.setCameraZoom("comfy");
}

PartyView.prototype.setCameraCosy = function() {
    this.setCameraZoom("cosy");
}

PartyView.prototype.setCameraTight = function() {
    this.setCameraZoom("tight");
}

PartyView.prototype.setCameraZoom = function(name) {
    if (!this.offset[name]) return;
    this.offset.x = this.offset[name].x;
    this.offset.y = this.offset[name].y;
    this.offset.z = this.offset[name].z;
    this.offset.name = "name";
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
    this.view.renderer.mbr.x = world.worldbuilder.collidebuilder.collisionindex.bounds.min.x;
    this.view.renderer.mbr.y = world.worldbuilder.collidebuilder.collisionindex.bounds.min.y;
    this.view.renderer.mbr.z = world.worldbuilder.collidebuilder.collisionindex.bounds.min.z;
    this.view.renderer.mbr.width = world.worldbuilder.collidebuilder.collisionindex.bounds.max.x = this.view.renderer.mbr.x;
    this.view.renderer.mbr.height = world.worldbuilder.collidebuilder.collisionindex.bounds.max.y = this.view.renderer.mbr.y;
}

PartyView.prototype.update = function(now, delta, game) {
    this.view.update(now, delta, game.world);
}

PartyView.prototype.reset = function() {
    this.view.reset();
    this.render = false;
    this.view.renderer.mbr.width = 0;
    this.view.renderer.mbr.height = 0;
    this.rendercount = 0;
}

PartyView.prototype.render = function(now, game) { 

    var world = game.world;

    
    //
    // TODO: Fix camera swimmyness when changing levels...
    //
    
    var render = false;
    this.view.renderer.mbr = world.players.getMbr(this.view.renderer.mbr);
    if (this.view.renderer.mbr && this.view.renderer.mbr.width && this.view.renderer.mbr.height) {
        if (this.rendercount++ >= this.renderwait) {
            render = true;
        }
    }

    var offx = this.offset.x;
    this.view.renderer.mbr.x -= offx;
    this.view.renderer.mbr.width += offx;
    
    var offy = this.offset.y;
    this.view.renderer.mbr.y -= offy;
    this.view.renderer.mbr.height += offy;
    
    var offz = this.offset.z;
    this.view.renderer.mbr.z -= offz;
    this.view.renderer.mbr.depth += offz;
    
    this.view.render(now, world, render);
}

PartyView.prototype.setMessage = function(message) { }

PartyView.prototype.updateUI = function() { }
PartyView.prototype.updatePlayerUI = function(player, ui) { }

