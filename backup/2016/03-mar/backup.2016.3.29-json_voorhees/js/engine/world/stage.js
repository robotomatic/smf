"use strict";

//  todo: level needs to be array i think

function Stage(level, players, npcs, views) {
    this.level = level;
    this.players = players;
    this.npcs = npcs;
    this.views = views;
    this.physics = {
        friction: 0.5,
        airfriction: .05,
        gravity: 0.3,
        terminalVelocity: 10,
        wallfriction: .25
    };
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
    if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].setLevel(this.level);
    return this.views; 
}
Stage.prototype.getViews = function() { return this.views; }

Stage.prototype.setPhysics = function(physics) { 
    this.physics = physics;
    return this.physics; 
}
Stage.prototype.getPhysics = function() { return this.physics; }

Stage.prototype.update = function(now, step) { 
    this.updateLevel(now, step);
    this.updateNPCs(now, step);
    this.updatePlayers(now, step);
    this.updateViews(now, step);
}

Stage.prototype.updateLevel = function(now) { this.level.update(now); }

Stage.prototype.updateNPCs = function(now) { if (this.npcs) this.npcs.update(now); }

Stage.prototype.updatePlayers = function(now, players) { 
    if (this.players && this.players.players) for (var i = 0; i < this.players.players.length; i++) this.updatePlayer(now, this.players.players[i]);
}
Stage.prototype.updatePlayer = function(now, player) {
    if (!player) return;
    this.collide(player);
    player.update(now, this.physics);
}

Stage.prototype.collide = function(player) {
    //this.collideWithPlayers(player);
    this.collideWithLevel(player);
}

Stage.prototype.collideWithLevel = function(player) { if (this.level) this.level.collidePlayer(player); }

Stage.prototype.collideWithPlayers = function(player) {
    if (this.players && this.players.players) {
        for (var i = 0; i < this.players.players.length; i++) {
            var p = this.players.players[i];
            if (p===player) continue;
            player.collideWith(p);
        }
    }
}

Stage.prototype.updateViews = function(now) { if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].update(now, this); }

Stage.prototype.render = function(now) { if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].render(now, this); }

Stage.prototype.setMessage = function(message) { if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].setMessage(message); }

Stage.prototype.doAction = function(action, args, key, val, callback) { if (this.npcs) this.npcs.doAction(action, args, key, val, callback); }
