"use strict";

function Stage(level, players, npcs) {
    this.level = level;
    this.items = new Array();
    this.players = players;
    this.npcs = npcs;
    this.physics = new Physics();
    this.stagebuilder = new StageBuilder();
    this.stagerenderer = new StageRenderer();
    this.stagecollider = new StageCollider();
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

Stage.prototype.setPhysics = function(physics) { 
    this.physics = physics;
    return this.physics; 
}
Stage.prototype.getPhysics = function() { return this.physics; }

Stage.prototype.init = function(now) { 
    this.stagebuilder.buildStage(now, this);
}
    
Stage.prototype.update = function(now, delta) { 
    this.updateLevel(now, delta);
    this.updateNPCs(now, delta);
    this.updatePlayers(now, delta);
    this.stagecollider.collide(this);
}

Stage.prototype.updateLevel = function(now, delta) { this.level.update(now, delta); }

Stage.prototype.updateNPCs = function(now, delta) { if (this.npcs) this.npcs.update(now, delta); }

Stage.prototype.updatePlayers = function(now, delta) { 
    if (!this.players || !this.players.players) return;
    this.players.update(now, delta);
    for (var i = 0; i < this.players.players.length; i++) this.updatePlayer(now, delta, this.players.players[i]);
}
Stage.prototype.updatePlayer = function(now, delta, player) {
    if (!player) return;
    player.update(now, delta, this.physics);
}

Stage.prototype.render = function(now, graphics, camera, mbr, window) { 
    this.stagerenderer.render(now, graphics, camera, this, mbr, window);
}

Stage.prototype.reset = function(now, graphics) { 
    this.level.reset(now);
    this.stagerenderer.reset(now, graphics);
}

Stage.prototype.doAction = function(action, args, key, val, callback) { if (this.npcs) this.npcs.doAction(action, args, key, val, callback); }
