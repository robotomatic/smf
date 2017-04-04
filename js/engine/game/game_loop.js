"use strict";

function GameLoop(input) {
    this.input = input;
    this.running = false;
    this.gameworld = new GameWorld();
    this.now = null;
    this.last = null;

    this.paused = false;
    
    this.stepspeed = 60;
    this.step = 1000 / this.stepspeed;
    
    this.steprender = true;

    this.delta = 0;
    
    this.maxskip = 100;
    this.maxdelta = this.maxskip * this.step;
    
    this.dorender = false;
    
    this.gameperformance = new GamePerformance(this.step);
}

GameLoop.prototype.loadLevel = function(level) { 
    this.gameworld.setLevel(level); 
}

GameLoop.prototype.loadMaterials = function(materials) { 
    this.gameworld.loadMaterials(materials);
}
    
GameLoop.prototype.loadTheme = function(theme) { 
    this.gameworld.loadTheme(theme); 
}

GameLoop.prototype.unloadThemes = function() { 
    this.gameworld.unloadThemes();
}

GameLoop.prototype.loadPlayers = function(players) { 
    this.gameworld.setPlayers(players);
}

GameLoop.prototype.loadNPCs = function(npcs) { 
    this.gameworld.setNPCs(npcs);
}

GameLoop.prototype.loadViews = function(views) { 
    this.gameworld.setViews(views); 
}

GameLoop.prototype.removePlayer = function(player) { 
    this.gameworld.removePlayer(player); 
}

GameLoop.prototype.showViews = function() { 
    this.gameworld.showViews();
}

GameLoop.prototype.hideViews = function() { 
    this.gameworld.hideViews();
}

GameLoop.prototype.resize = function() { 
    this.gameworld.resize();
}

GameLoop.prototype.start = function() {
    this.running = true;
    this.run();
}

GameLoop.prototype.stop = function() {
    this.running = false;
}

GameLoop.prototype.pause = function(when) {
    this.paused = true;
    this.gameworld.pause(when);
    this.gameperformance.pauseStart(when);
}

GameLoop.prototype.resume = function(when) {
    this.paused = false;
    this.last = when;
    this.gameworld.resume(when);
    this.gameperformance.pauseEnd(when);
}

GameLoop.prototype.run = function(now) {
    if (!this.running) return;
    if (!now) return;
    this.gameperformance.loopStart(now);
    geometryfactory.reset();
    if (!this.paused) {
        if (this.steprender) this.runStep(now);
        else this.runUpdate(now);
    }
    this.render(timestamp());
    this.gameperformance.loopEnd(now);
    this.gameworld.fps("FPS", this.gameperformance);
}

GameLoop.prototype.runStep = function(now) {
    this.now = now;
    if (!this.last) this.last = this.now;
    this.delta = this.now - this.last;
    if (this.delta > this.maxdelta) this.delta = this.maxdelta;
    while(this.delta >= this.step) {
        this.last += this.step;
        this.update(this.last, 1); 
        this.delta -= this.step;
    }
    this.last = this.now;
}

GameLoop.prototype.runUpdate = function(when) {
    this.update(when, this.step / 10);
}
    
GameLoop.prototype.update = function(when, delta) {
    this.gameperformance.updateStart(when);
    this.input.update(when); 
    this.gameworld.update(when, delta); 
    this.gameperformance.updateEnd(when);
}
                                                  
GameLoop.prototype.render = function(when) { 
    this.gameperformance.renderStart(when);
    this.gameworld.render(when);
    this.gameperformance.renderEnd(when);
}

GameLoop.prototype.reset = function(when) { 
    this.gameperformance.reset(when);
    this.gameworld.reset(when);
}

GameLoop.prototype.doAction = function(action, args, key, val, callback) { 
    this.gameworld.doAction(action, args, key, val, callback); 
}
