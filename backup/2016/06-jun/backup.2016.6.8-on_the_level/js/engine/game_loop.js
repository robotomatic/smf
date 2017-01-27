"use strict";

function GameLoop(input, devtools) {
    this.input = input;
    this.running = false;
    this.stage = new Stage();
    this.devtools = devtools;
    this.now = null;
    this.dt = 0;
    this.last = timestamp();

    this.stepspeed = 60;
    this.step = 1 / this.stepspeed;
    
    this.steprender = true;
    this.steprender = false;
    
    this.dorender = false;
}
GameLoop.prototype.loadLevel = function(level) { this.stage.setLevel(level); }
GameLoop.prototype.loadPlayers = function(players) { this.stage.setPlayers(players); }
GameLoop.prototype.loadNPCs = function(npcs) { this.stage.setNPCs(npcs); }
GameLoop.prototype.loadViews = function(views) { this.stage.setViews(views); }

GameLoop.prototype.showViews = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].show(); }
GameLoop.prototype.hideViews = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].hide(); }

GameLoop.prototype.resize = function() { 
    if (this.stage.views) {
        for (var i = 0; i < this.stage.views.length; i++) {
            this.stage.views[i].resize(); 
            this.stage.views[i].resizeUI(); 
        }
    }
    if (this.devtools) this.devtools.resize();
}

GameLoop.prototype.start = function() {
    this.running = true;
    this.run();
}
GameLoop.prototype.stop = function() {
    this.running = false;
}

GameLoop.prototype.run = function(now) {

    if (!now) return;
    if (!this.running) return;
    
    this.now = now;
    var delta = Math.min(1, (this.now - this.last) / 1000);
    this.dt = delta;

    if (this.steprender) {
        while(this.dt > this.step) {
            this.dt = this.dt - this.step;
            if (this.dt > this.step) this.now += this.step;
            this.update(this.now);
        }
    } else {
        this.update(this.now);
    }
    
    this.render(this.now);
    
    this.last = this.now;
}

GameLoop.prototype.update = function(now) {
    this.input.update(now); 
    this.stage.update(now); 
}
                                                  
GameLoop.prototype.render = function(now) { this.stage.render(now); }

GameLoop.prototype.setMessage = function(message) { this.stage.setMessage(message); }
GameLoop.prototype.doAction = function(action, args, key, val, callback) { this.stage.doAction(action, args, key, val, callback); }
