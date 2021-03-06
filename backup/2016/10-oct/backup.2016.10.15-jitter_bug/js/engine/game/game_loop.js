"use strict";

function GameLoop(input) {
    this.input = input;
    this.running = false;
    this.game = new Game();
    this.now = null;
    this.last = null;

    this.stepspeed = 60;
    this.step = 1000 / this.stepspeed;
    
    this.steprender = true;
//    this.steprender = false;

    this.delta = 0;
    
    this.maxskip = 100;
    this.maxdelta = this.maxskip * this.step;
    
    this.dorender = false;
    
    this.gameperformance = new GamePerformance(this.step);
}
GameLoop.prototype.loadLevel = function(level) { this.game.setLevel(level); }
GameLoop.prototype.loadPlayers = function(players) { this.game.setPlayers(players); }
GameLoop.prototype.loadNPCs = function(npcs) { this.game.setNPCs(npcs); }
GameLoop.prototype.loadViews = function(views) { this.game.setViews(views); }

GameLoop.prototype.showViews = function() { if (this.game.views) for (var i = 0; i < this.game.views.length; i++) this.game.views[i].show(); }
GameLoop.prototype.hideViews = function() { if (this.game.views) for (var i = 0; i < this.game.views.length; i++) this.game.views[i].hide(); }

GameLoop.prototype.resize = function() { 
    if (this.game.views) {
        for (var i = 0; i < this.game.views.length; i++) {
            this.game.views[i].resize(); 
            this.game.views[i].resizeUI(); 
        }
    }
}

GameLoop.prototype.start = function() {
    this.running = true;
    this.run();
}
GameLoop.prototype.stop = function() {
    this.running = false;
}

GameLoop.prototype.run = function(now) {
    if (!this.running) return;
    if (!now) return;
    this.gameperformance.tick(now);
    if (this.steprender) this.runStep(now);
    else this.runUpdate(now);
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
    
//    var d = this.step / this.delta;
//    var dd = this.step * d;
//    this.delta -= dd;
//    
//    if (this.delta != 0) console.log("sdfdfdfs " + dd + "   ==  " + d);
    
    this.last = this.now;
//    if (this.delta) this.update(this.last, 1); 
}

GameLoop.prototype.runUpdate = function(when) {
    this.update(when, this.step / 10);
}
    
GameLoop.prototype.update = function(when, delta) {
    this.gameperformance.updateStart(when);
    this.input.update(when); 
    this.game.update(when, delta); 
    this.gameperformance.updateEnd(when);
}
                                                  
GameLoop.prototype.render = function(when) { 
    this.gameperformance.renderStart(when);
    this.game.render(when);
    this.gameperformance.renderEnd(when);
}

GameLoop.prototype.reset = function(when) { 
    this.gameperformance.reset(when);
    this.game.reset(when);
}

GameLoop.prototype.setMessage = function(message) { this.game.setMessage(message); }
GameLoop.prototype.doAction = function(action, args, key, val, callback) { this.game.doAction(action, args, key, val, callback); }
