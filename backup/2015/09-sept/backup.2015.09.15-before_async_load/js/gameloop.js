function GameLoop(stage) {
    this.stage = stage;
    this.colliders = new Array();
    for (var i = 0; i < stage.players.length; i++) this.colliders.push(stage.players[i]);
    for (var ii = 0; ii < stage.level.items.length; ii++) this.colliders.push(stage.level.items[ii]);
    this.now = null;
    this.dt = 0;
    this.last = timestamp();
    this.step = 1 / 60;
    this.views = new Array();
}

GameLoop.prototype.resize = function() { for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].resize(); }

GameLoop.prototype.run = function() {
    this.now = timestamp();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
    while(this.dt > this.step) {
        this.dt = this.dt - this.step;
        this.update(this.step);
    }
    this.render();
    this.last = this.now;
}

GameLoop.prototype.update = function(step) { for (var i = 0; i < this.stage.players.length; i++) this.updatePlayer(this.stage.players[i]); }
GameLoop.prototype.updatePlayer = function(player) {    
    player.fall();
    for (var i = 0; i < this.colliders.length; i++) {
        
        // todo: filter by quad
        
        var collider = this.colliders[i];
        if (collider===player) continue;
        player.collideWith(collider);
    }
    player.update(this.stage.physics);
}

GameLoop.prototype.render = function() { for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].render(this.dt, this.stage); }