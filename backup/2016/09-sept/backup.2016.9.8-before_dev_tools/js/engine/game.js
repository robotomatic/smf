"use strict";

function Game(views) {
    this.views = views ? views : new Array();
    this.stage = new Stage();
}

Game.prototype.setLevel = function(level) { this.stage.setLevel(level); }
Game.prototype.setPlayers = function(players) { this.stage.setPlayers(players); }
Game.prototype.setNPCs = function(npcs) { this.stage.setNPCs(npcs); }

Game.prototype.setViews = function(views) { 
    this.views = views;
    return this.views; 
}

Game.prototype.update = function(now, delta) { 
    this.stage.update(now, delta);
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

Game.prototype.setMessage = function(message) { 
    if (!this.views) return;
    var t = this.views.length;
    for (var i = 0; i < t; i++) {
        this.views[i].setMessage(message); 
    }
}

Game.prototype.doAction = function(action, args, key, val, callback) { 
    this.stage.doAction(action, args, key, val, callback); 
}
