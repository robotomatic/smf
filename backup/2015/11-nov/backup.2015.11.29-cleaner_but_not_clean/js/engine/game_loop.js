function GameLoop(devtools) {
    this.running = false;
    this.stage = new Stage();
    this.devtools = devtools;
    this.now = null;
    this.dt = 0;
    this.last = timestamp();
    this.stepspeed = 60;
    this.step = 1 / this.stepspeed;
    this.steprender = true;
    this.dorender = false;
}
GameLoop.prototype.loadLevel = function(level) { this.stage.setLevel(level); }
GameLoop.prototype.loadPlayers = function(players) { this.stage.setPlayers(players); }
GameLoop.prototype.loadNPCs = function(npcs) { this.stage.setNPCs(npcs); }
GameLoop.prototype.loadViews = function(views) { this.stage.setViews(views); }

GameLoop.prototype.showViews = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].show(); }
GameLoop.prototype.hideViews = function() { if (this.stage.views) for (var i = 0; i < this.stage.views.length; i++) this.stage.views[i].hide(); }

GameLoop.prototype.resize = function() { 
    if (this.stage.views) {
        for (var i = 0; i < this.stage.views.length; i++) {
            this.stage.views[i].resize(); 
            this.stage.views[i].resizeUI(); 
        }
    }
    if (this.devtools) this.devtools.resize();
}

GameLoop.prototype.start = function() {
    this.running = true;
    this.run();
}
GameLoop.prototype.stop = function() {
    this.running = false;
}

GameLoop.prototype.run = function() {
    if (!this.running) return;
    this.now = timestamp();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
    this.step = 1 / this.stepspeed;
    
    if (this.steprender) while(this.dt > this.step) {
        this.dt = this.dt - this.step;
        this.update(this.step);
        if (this.devtools) this.devtools.update(this);
    } else {
        this.update(0);
    }
    
    this.render(this.dt);
    this.last = this.now;
}

GameLoop.prototype.update = function(step) {  this.stage.update(step); }
GameLoop.prototype.render = function(delta) { this.stage.render(delta); }
GameLoop.prototype.setMessage = function(message) { this.stage.setMessage(message); }
GameLoop.prototype.doAction = function(action, args, key, val, callback) { this.stage.doAction(action, args, key, val, callback); }
