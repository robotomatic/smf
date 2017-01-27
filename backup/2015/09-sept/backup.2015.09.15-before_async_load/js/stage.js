function Stage(level, players, views) {
    this.level = level;
    this.players = players;
    this.views = views;
    this.physics = {
        friction: 0.8,
        airfriction: .9,
        gravity: 0.3,
        terminalVelocity: 12,
        wallfriction: 0,
        jumpThreshold: 0.2,
        wallJumpThreshold: 0.2
    };
}

Stage.prototype.getLevel = function() { return this.level; }
Stage.prototype.getPlayers = function() { return this.players; }
Stage.prototype.getViews = function() { return this.views; }
Stage.prototype.getPhysics = function() { return this.physics; }