function Stage(level, players, views) {
    this.level = level;
    this.players = players;
    this.views = views;
    this.physics = {
        friction: 0.8,
        airfriction: .9,
        gravity: 0.3,
        terminalVelocity: 12,
        wallfriction: 0
    };
}

Stage.prototype.setLevel = function(level) { 
    this.level = level;
    if (this.views) this.setViews(this.views);
    return this.level; 
}
Stage.prototype.getLevel = function() { return this.level; }

Stage.prototype.setPlayers = function(players) { 
    this.players = players;
    return this.players; 
}
Stage.prototype.getPlayers = function() { return this.players; }

Stage.prototype.setViews = function(views) { 
    this.views = views;
    for (var i = 0; i < this.views.length; i++) this.views[i].setLevel(this.level);
    return this.views; 
}
Stage.prototype.getViews = function() { return this.views; }

Stage.prototype.setPhysics = function(physics) { 
    this.physics = physics;
    return this.physics; 
}
Stage.prototype.getPhysics = function() { return this.physics; }