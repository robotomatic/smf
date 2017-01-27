"use strict";

function GameLoop(input, devtools) {
    this.input = input;
    this.running = false;
    this.stage = new Stage();
    this.devtools = devtools;
    this.now = null;
    this.dt = 0;
    this.last = timestamp();

    this.stepspeed = 30;
    this.step = 1 / this.stepspeed;
    
    this.steprender = true;
    
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

GameLoop.prototype.run = function() {

    if (!this.running) return;
    
    this.now = timestamp();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);

    // todo: figurreout what is hapnin here
    
    if (this.steprender) {
        var s = 0;
        while(this.dt > this.step) {
            this.update(this.now);
            this.dt = this.dt - this.step;
            if (this.dt > this.step) this.now += this.step;
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
