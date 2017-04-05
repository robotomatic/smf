"use strict";

function GameLoop() {
    this.running = false;
    this.gameworld = new GameWorld();
    this.now = null;
    this.last = null;

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
    this.gameworld.pause(when);
    this.gameperformance.pauseStart(when);
}

GameLoop.prototype.resume = function(when) {
    this.last = when;
    this.gameworld.resume(when);
    this.gameperformance.pauseEnd(when);
}

GameLoop.prototype.run = function(now, paused) {
    if (!this.running) return;
    if (!now) return;
    this.gameperformance.loopStart(now);
    geometryfactory.reset();
    if (this.steprender) this.runStep(now, paused);
    else this.runUpdate(now, paused);
    this.render(timestamp(), paused);
    this.gameperformance.loopEnd(now);
    this.gameworld.fps("FPS", this.gameperformance);
}

GameLoop.prototype.runStep = function(now, paused) {
    this.now = now;
    if (!this.last) this.last = this.now;
    this.delta = this.now - this.last;
    if (this.delta > this.maxdelta) this.delta = this.maxdelta;
    while(this.delta >= this.step) {
        this.last += this.step;
        this.update(this.last, 1, paused); 
        this.delta -= this.step;
    }
    this.last = this.now;
}

GameLoop.prototype.runUpdate = function(when, paused) {
    this.update(when, this.step / 10, paused);
}
    
GameLoop.prototype.update = function(when, delta, paused) {
    this.gameperformance.updateStart(when);
    this.gameworld.update(when, delta, paused); 
    this.gameperformance.updateEnd(when);
}
                                                  
GameLoop.prototype.render = function(when, paused) { 
    this.gameperformance.renderStart(when);
    this.gameworld.render(when, paused);
    this.gameperformance.renderEnd(when);
}

GameLoop.prototype.reset = function(when) { 
    this.gameperformance.reset(when);
    this.gameworld.reset(when);
}

GameLoop.prototype.doAction = function(action, args, key, val, callback) { 
    this.gameworld.doAction(action, args, key, val, callback); 
}
