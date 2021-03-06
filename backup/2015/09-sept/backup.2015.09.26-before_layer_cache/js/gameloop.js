function GameLoop() {
    this.stage = new Stage();
    this.now = null;
    this.dt = 0;
    this.last = timestamp();
    this.step = 1 / 60;
}
GameLoop.prototype.loadLevel = function(level) { this.stage.setLevel(level); }
GameLoop.prototype.loadPlayers = function(players) { this.stage.setPlayers(players); }
GameLoop.prototype.loadViews = function(views) { this.stage.setViews(views); }

GameLoop.prototype.resize = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].resize(); }

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

GameLoop.prototype.update = function(step) { if (this.stage.players) for (var i = 0; i < this.stage.players.length; i++) this.updatePlayer(this.stage.players[i]); }
GameLoop.prototype.updatePlayer = function(player) {    
    player.fall();
    this.collide(player);
    player.update(this.stage.physics);
}

GameLoop.prototype.collide = function(player) {
    this.collideWithPlayers(player);
    this.collideWithLevel(player);
}

GameLoop.prototype.collideWithLevel = function(player) {
    if (this.stage.level && this.stage.level.layers) {
        for (var i = 0; i < this.stage.level.layers.length; i++) {
            var layer = this.stage.level.layers[i];
            if (layer.collide === false) continue;
            for (var ii = 0; ii < this.stage.level.layers[i].items.length; ii++) {
                var item = this.stage.level.layers[i].items[ii];
                if (item.collide===false) continue;
                player.collideWith(item);
            }
        }
    }
}

GameLoop.prototype.collideWithPlayers = function(player) {
    if (this.stage.players) for (var i = 0; i < this.stage.players.length; i++) {
        var p = this.stage.players[i];
        if (p===player) continue;
        player.collideWith(p);
    }
}

GameLoop.prototype.render = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].render(this.dt, this.stage); }