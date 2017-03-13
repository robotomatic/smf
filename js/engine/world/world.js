"use strict";

function World(level, players, npcs) {
    this.level = level;
    this.items = new Array();
    this.players = players;
    this.npcs = npcs;
    this.physics = new Physics();
    this.worldbuilder = new WorldBuilder();
    this.worldcollider = new WorldCollider();
    this.worldrenderer = new WorldRenderer();
}

World.prototype.setTheme = function(themename, theme, materials) { 
    this.worldrenderer.setTheme(themename, theme, materials);
}

World.prototype.setLevel = function(level) { 
    this.level = level;
    if (this.level.gravity) this.physics.gravity = this.level.gravity;
    return this.level; 
}

World.prototype.getLevel = function() { 
    return this.level; 
}

World.prototype.setPlayers = function(players) { 
    this.players = players;
    return this.players; 
}

World.prototype.getPlayers = function() { 
    return this.players; 
}

World.prototype.setNPCs = function(npcs) { 
    this.npcs = npcs;
    return this.npcs; 
}

World.prototype.getNPCs = function() { 
    return this.npcs; 
}

World.prototype.setPhysics = function(physics) { 
    this.physics = physics;
    return this.physics; 
}

World.prototype.getPhysics = function() { 
    return this.physics; 
}

World.prototype.init = function(now) { 
    this.worldbuilder.buildWorld(now, this);
}
    
World.prototype.update = function(now, delta) { 
    this.updateItems(now, delta);
    this.updateNPCs(now, delta);
    this.updatePlayers(now, delta);
    this.worldcollider.collide(this);
}

World.prototype.updateItems = function(now, delta) { 
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        this.items[i].update();
    }
}

World.prototype.updateNPCs = function(now, delta) { if (this.npcs) this.npcs.update(now, delta); }

World.prototype.updatePlayers = function(now, delta) { 
    if (!this.players || !this.players.players) return;
    this.players.update(now, delta);
    for (var i = 0; i < this.players.players.length; i++) this.updatePlayer(now, delta, this.players.players[i]);
}
World.prototype.updatePlayer = function(now, delta, player) {
    if (!player) return;
    player.update(now, delta, this.physics);
}

World.prototype.render = function(now, graphics, camera, mbr, window) { 
    this.worldrenderer.render(now, graphics, camera, this, mbr, window);
}

World.prototype.reset = function(now, graphics) { 
    this.worldrenderer.reset(now, graphics);
}

World.prototype.doAction = function(action, args, key, val, callback) { if (this.npcs) this.npcs.doAction(action, args, key, val, callback); }
