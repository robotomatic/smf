"use strict";

function Stage(level, players, npcs, views) {
    this.level = level;
    this.players = players;
    this.npcs = npcs;
    this.views = views;
    this.physics = new Physics();
}

Stage.prototype.setLevel = function(level) { 
    this.level = level;
    if (this.level.gravity) this.physics.gravity = this.level.gravity;
    return this.level; 
}
Stage.prototype.getLevel = function() { return this.level; }

Stage.prototype.setPlayers = function(players) { 
    this.players = players;
    return this.players; 
}
Stage.prototype.getPlayers = function() { return this.players; }

Stage.prototype.setNPCs = function(npcs) { 
    this.npcs = npcs;
    return this.npcs; 
}
Stage.prototype.getNPCs = function() { return this.npcs; }

Stage.prototype.setViews = function(views) { 
    this.views = views;
    return this.views; 
}
Stage.prototype.getViews = function() { return this.views; }

Stage.prototype.setPhysics = function(physics) { 
    this.physics = physics;
    return this.physics; 
}
Stage.prototype.getPhysics = function() { return this.physics; }

Stage.prototype.update = function(now, delta) { 
    this.updateLevel(now, delta);
    this.updateNPCs(now, delta);
    this.updatePlayers(now, delta);
    this.updateViews(now, delta);
}

Stage.prototype.updateLevel = function(now, delta) { this.level.update(now, delta); }

Stage.prototype.updateNPCs = function(now, delta) { if (this.npcs) this.npcs.update(now, delta); }

Stage.prototype.updatePlayers = function(now, delta) { 
    if (!this.players || !this.players.players) return;
    for (var i = 0; i < this.players.players.length; i++) this.updatePlayer(now, delta, this.players.players[i]);
}
Stage.prototype.updatePlayer = function(now, delta, player) {
    if (!player) return;
    player.update(now, delta, this.physics);
    this.collide(player);
}

Stage.prototype.collide = function(player) {
    this.collideWithPlayers(player);
    this.collideWithLevel(player);
}
Stage.prototype.collideWithPlayers = function(player) { if (this.players) this.players.collidePlayer(player); } 
Stage.prototype.collideWithLevel = function(player) { if (this.level) this.level.collidePlayer(player); }

Stage.prototype.updateViews = function(now, delta) { if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].update(now, delta, this); }

Stage.prototype.render = function(now) { 
    if (!this.views) return;
    var t = this.views.length;
    for (var i = 0; i < t; i++) this.views[i].render(now, this); 
}

Stage.prototype.setMessage = function(message) { if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].setMessage(message); }
Stage.prototype.doAction = function(action, args, key, val, callback) { if (this.npcs) this.npcs.doAction(action, args, key, val, callback); }
