//  todo: level needs to be array i think

function Stage(level, players, npcs, views) {
    this.level = level;
    this.players = players;
    this.npcs = npcs;
    this.views = views;
    this.physics = {
        friction: 0.8,
        airfriction: .95,
        gravity: 0.3,
        terminalVelocity: 50,
        wallfriction: .25
    };
}

Stage.prototype.setLevel = function(level) { 
    this.level = level;
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

Stage.prototype.update = function(step) { 
    this.updateLevel(step);
    this.updateNPCs(step);
    this.updatePlayers(step);
}

Stage.prototype.updateLevel = function(step) { this.level.update(step); }

Stage.prototype.updateNPCs = function(step) { if (this.npcs) this.npcs.update(step); }

Stage.prototype.updatePlayers = function(step, players) { 
    if (this.players) for (var i = 0; i < this.players.length; i++) this.updatePlayer(step, this.players[i]);
}
Stage.prototype.updatePlayer = function(step, player) {
    if (!player) return;
    player.fall();
    this.collide(player);
    player.update(step, this.physics);
}

Stage.prototype.collide = function(player) {
    //this.collideWithPlayers(player);
    this.collideWithLevel(player);
}

Stage.prototype.collideWithLevel = function(player) { if (this.level) this.level.collidePlayer(player); }

Stage.prototype.collideWithPlayers = function(player) {
    if (this.players) for (var i = 0; i < this.players.length; i++) {
        var p = this.players[i];
        if (p===player) continue;
        player.collideWith(p);
    }
}

Stage.prototype.render = function(dt) { if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].render(dt, this); }

Stage.prototype.setMessage = function(message) { if (this.views) for (var i = 0; i < this.views.length; i++) this.views[i].setMessage(message); }

Stage.prototype.doAction = function(action, args, key, val, callback) { if (this.npcs) this.npcs.doAction(action, args, key, val, callback); }
