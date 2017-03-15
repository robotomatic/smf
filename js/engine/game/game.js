"use strict";

function Game(views) {
    this.views = views ? views : new Array();
    this.world = new World();
}

Game.prototype.setLevel = function(level) { this.world.setLevel(level); }
Game.prototype.setTheme = function(themename, theme, materials) { this.world.setTheme(themename, theme, materials); }
Game.prototype.setPlayers = function(players) { this.world.setPlayers(players); }
Game.prototype.setNPCs = function(npcs) { this.world.setNPCs(npcs); }

Game.prototype.setViews = function(views) { 
    this.views = views;
    return this.views; 
}

Game.prototype.init = function(now) { 
    this.world.init();
}

Game.prototype.update = function(now, delta) { 
    this.world.update(now, delta);
    if (!this.views) return;
    var t = this.views.length;
    for (var i = 0; i < t; i++) {
        this.views[i].update(now, delta, this); 
    }
}

Game.prototype.render = function(now) { 
    if (!this.views) return;
    var t = this.views.length;
    for (var i = 0; i < t; i++) {
        this.views[i].render(now, this);
    }
}

Game.prototype.fps = function(type, fps, avg) {
    if (!this.views) return;
    var t = this.views.length;
    for (var i = 0; i < t; i++) {
        this.views[i].view.updateFPS(type, fps, avg); 
    }
}

Game.prototype.reset = function(now) {
    this.world.reset(now);
    benchmark("world reset");
}

Game.prototype.setMessage = function(message) { 
    if (!this.views) return;
    var t = this.views.length;
    for (var i = 0; i < t; i++) {
        this.views[i].setMessage(message); 
    }
}

Game.prototype.doAction = function(action, args, key, val, callback) { 
    this.world.doAction(action, args, key, val, callback); 
}
