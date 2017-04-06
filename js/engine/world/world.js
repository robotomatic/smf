"use strict";

function World(level, players, npcs) {
    this.level = level;
    this.items = new Array();
    this.renderitems = new Array();
    this.players = players;
    this.npcs = npcs;
    this.physics = new Physics();
    this.worldbuilder = new WorldBuilder();
    this.worldcollider = new WorldCollider();
    this.worldrenderer = new WorldRenderer();
    this.bounds = new Rectangle(0, 0, 0, 0);
}

World.prototype.unloadThemes = function() { 
    this.worldrenderer.unloadThemes();
    this.physics.reset();
}

World.prototype.loadMaterials = function(materials) { 
    this.worldrenderer.loadMaterials(materials);
}

World.prototype.loadTheme = function(theme) { 
    this.worldrenderer.loadTheme(theme);
    this.physics.setPhysics(theme.physics);
}

World.prototype.setLevel = function(level) { 
    this.level = level;
    this.pad = level.pad ? level.pad : 0;
    this.buildLevel();
    return this.level; 
}

World.prototype.getLevel = function() { 
    return this.level; 
}

World.prototype.setPlayers = function(players) { 
    this.players = players;
    return this.players; 
}

World.prototype.removePlayer = function(player) { 
    this.npcs.removeNPC(player);
    this.players.removePlayer(player);
    this.worldrenderer.removePlayer(player);
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

World.prototype.buildLevel = function(now) { 
    benchmark("build world - start", "build");
    this.worldbuilder.buildWorld(now, this);
    benchmark("build world - end", "build");
}
    
World.prototype.setBounds = function(bounds) { 
    this.bounds.x = bounds.min.x - this.pad;
    this.bounds.width = (bounds.max.x - bounds.min.x) + (this.pad * 2);
    this.bounds.y = bounds.min.y;
    this.bounds.height = bounds.max.y - bounds.min.y;
    this.bounds.z = bounds.min.z - this.pad;
    this.bounds.depth = (bounds.max.z- bounds.min.z) + (this.pad * 2);
}
    
World.prototype.pause = function(now) { 
    this.players.pause(now);
    this.npcs.pause(now);
}
    
World.prototype.resume = function(now) { 
    this.players.resume(now);
    this.npcs.resume(now);
}
    
World.prototype.reset = function(when) { 
    benchmark("world reset - start", "reset");
    this.level.reset();
    delete(this.level);
    this.items.length = 0;
    this.renderitems.length = 0;
    this.worldbuilder.reset();
    this.worldrenderer.reset();
    this.worldcollider.reset();
    if (this.players) this.players.reset(when);
    if (this.npcs) this.npcs.reset(when);
    benchmark("world reset - end", "reset");
}

World.prototype.resetPlayers = function() { 
    this.worldcollider.resetPlayers(this.players.players);
}

World.prototype.update = function(now, delta, paused) { 
    this.updateItems(now, delta, paused);
    this.updateNPCs(now, delta, paused);
    this.updatePlayers(now, delta, paused);
    this.worldcollider.collide(this);
}

World.prototype.updateItems = function(now, delta, paused) { 
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        this.items[i].update(now, delta, paused);
    }
}

World.prototype.updateNPCs = function(now, delta, paused) { 
    if (this.npcs) {
        this.npcs.update(now, delta, this, paused); 
    }
}

World.prototype.updatePlayers = function(now, delta, paused) { 
    if (!this.players || !this.players.players) return;
    this.players.update(now, delta, paused);
    for (var i = 0; i < this.players.players.length; i++) this.updatePlayer(now, delta, this.players.players[i], paused);
}

World.prototype.updatePlayer = function(now, delta, player, paused) {
    if (!player) return;
    player.update(now, delta, this.physics, paused);
}

World.prototype.render = function(now, graphics, camera, mbr, window, paused) { 
    this.worldrenderer.renderWorld(now, graphics, camera, this, mbr, window, paused);
}

World.prototype.doAction = function(action, args, key, val, callback) { 
    if (!this.npcs) return;
    this.npcs.doAction(action, args, key, val, callback); 
}
