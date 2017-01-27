"use strict";

function GameLoop(input, devtools) {
    this.input = input;
    this.running = false;
    this.stage = new Stage();
    this.devtools = devtools;
    this.now = null;
    this.last = null;

    this.stepspeed = 60;
    this.step = 1000 / this.stepspeed;
    
    this.steprender = false;
    this.steprender = true;

    this.maxskip = 100;
    this.maxdelta = this.maxskip * this.step;
    
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
    if (!this.running) return;
    if (!now) return;
    if (this.steprender) this.runStep(now);
    else this.runUpdate(now);
    this.render(now);
}

GameLoop.prototype.runStep = function(now) {

    this.now = round(now);
    if (!this.last) this.last = this.now;
    var delta = this.now - this.last;

    if (delta > this.maxdelta) delta = this.maxdelta;
    
    delta = round(delta);
    
    while(delta > this.step) {
        this.last += this.step;
        this.last = round(this.last);
        this.update(this.last, 1); 
        delta -= this.step;
        delta = round(delta);
    }
    
    var d = round(delta / this.step);
    if (d) this.update(this.now, d);
    
    this.last = this.now;
}

GameLoop.prototype.runUpdate = function(when) {
    this.update(when, 1);
}
    
GameLoop.prototype.update = function(when, delta) {

//    console.log("update: " + when + " == " + delta);
    
    this.input.update(when); 
    this.stage.update(when, delta); 
}
                                                  
GameLoop.prototype.render = function(when) { 
    
    when = round(when);
    
//    console.log("------>render: " + when);
    
    this.stage.render(when);
}

GameLoop.prototype.setMessage = function(message) { this.stage.setMessage(message); }
GameLoop.prototype.doAction = function(action, args, key, val, callback) { this.stage.doAction(action, args, key, val, callback); }
