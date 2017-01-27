function GameLoop() {
    this.stage = new Stage();
    this.now = null;
    this.dt = 0;
    this.last = timestamp();
    this.step = 1 / 60;
    this.dorender = false;
}
GameLoop.prototype.loadLevel = function(level) { this.stage.setLevel(level); }
GameLoop.prototype.loadPlayers = function(players) { this.stage.setPlayers(players); }
GameLoop.prototype.loadViews = function(views) { this.stage.setViews(views); }

GameLoop.prototype.showViews = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].show(); }
GameLoop.prototype.hideViews = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].hide(); }

GameLoop.prototype.resize = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].resize(); }

GameLoop.prototype.run = function() {
    this.now = timestamp();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
    while(this.dt > this.step) {
        this.dt = this.dt - this.step;
        this.update(this.step);
    }
    this.render(this.dt);
    this.last = this.now;
}

GameLoop.prototype.update = function(step) {  this.stage.update(step); }
GameLoop.prototype.render = function(delta) { this.stage.render(delta); }