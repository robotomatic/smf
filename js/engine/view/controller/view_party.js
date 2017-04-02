"use strict";

function PartyView(gamecontroller, id, width, height, scale) {
    this.view = new View(gamecontroller, id, width, height, scale);
    var controller = this;
    gamecontroller.main.onclick = function(e) {
        /*
        toggleFullScreen();
        controller.resize();
        */
        if (controller.paused) return;
        if (e.target.id != "gamecanvas") return;
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

    this.offset.name = (gamecontroller.gamesettings.settings.camera && gamecontroller.gamesettings.settings.camera.view) || "fit";
    this.setCameraZoom(this.offset.name);
    
    this.paused = false;
    
    this.rendercount = 0;
    this.renderwait = 10;
    this.renderall = true;
    
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
    this.offset.name = name;
    this.view.gamecontroller.gamesettings.settings.camera.view = name;
    this.view.gamecontroller.saveGameSettings();
    updateDevViewCameraOffset(this);
}


PartyView.prototype.pause = function(when) { 
    this.paused = true;
    this.view.pause(when);
}

PartyView.prototype.resume = function(when) { 
    this.paused = false;
    this.view.resume(when);
}

PartyView.prototype.show = function() { 
    this.view.show(); 
}
PartyView.prototype.hide = function() { this.view.hide(); }

PartyView.prototype.resize = function() { 
    this.view.resize();
}
PartyView.prototype.update = function(now, delta, game) {
    this.view.update(now, delta, game.world);
}

PartyView.prototype.reset = function() {
    this.view.reset();
    this.view.renderer.mbr.width = 0;
    this.view.renderer.mbr.height = 0;
    this.rendercount = 0;
    this.renderall = true;
    this.view.renderer.camera.lastview = null;
}

PartyView.prototype.render = function(now, game) { 

    var world = game.world;

    var offx = this.offset.x;
    var offy = this.offset.y;
    var offz = this.offset.z;
    
    this.view.renderer.mbr = world.players.getMbr(this.view.renderer.mbr);
    
    var follow = true;
    if (this.view == "fit" || this.view.renderer.mbr && !this.view.renderer.mbr.width && !this.view.renderer.mbr.height) {
        offx = 0;
        offy = 0;
        offz = 0;
        this.view.renderer.mbr = this.getViewBounds(world, this.view.renderer.mbr);
        follow = false;
        this.renderall = true;
        this.view.renderer.camera.lastview = null;
    } else if (this.renderall) {
        follow = false;
        this.renderall = false;
        this.view.renderer.camera.lastview = null;
    }
    
    var render = true;
    if (this.rendercount < 10) {
        render = false;
        follow = false;
    }
    
    if (!this.paused) this.rendercount++;
    
    this.view.renderer.camera.offset.x = offx;
    this.view.renderer.camera.offset.y = offy;
    this.view.renderer.camera.offset.z = offz;
    
    this.view.render(now, world, render, follow);
}

PartyView.prototype.getViewBounds = function(world, mbr) {
    var b = world.worldbuilder.collidebuilder.collisionindex.bounds;
    mbr.x = b.min.x;
    mbr.y = 0;
    mbr.z = -2500;
    mbr.width = b.max.x - mbr.x;
    if (world.level) {

        mbr.height = world.level.height;
        
        var width = this.view.width;
        if (width < mbr.width) {
            var dw = width / mbr.width;

             var newheight = mbr.height * dw;
             var newy = mbr.height - newheight;
             mbr.y -= (newy / 2);
             mbr.height = newheight;

            var newx = mbr.width - width;
            mbr.x += (newx / 2);
            mbr.width = width;
        }

        var height = this.view.height;
        if (height < mbr.height) {
            var dh = height / mbr.height;

            var newwidth = mbr.width * dh;
            var newx = mbr.width - newwidth;
            mbr.x += (newx / 2);
            mbr.width = newwidth;

            var newy = mbr.height - height;
            mbr.y += (newy / 2);
            mbr.height = height;
        } else {
            mbr.height = world.level.height;
        }
    } else {
        mbr.height = b.max.y - mbr.y;
    }
    mbr.depth = 0;
    return mbr;
}