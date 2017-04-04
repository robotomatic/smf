"use strict";

function GameWorld(views) {
    this.views = views ? views : new Array();
    this.world = new World();
}

GameWorld.prototype.setLevel = function(level) { 
    this.world.setLevel(level); 
}

GameWorld.prototype.loadMaterials = function(materials) { 
    this.world.loadMaterials(materials); 
}

GameWorld.prototype.loadTheme = function(theme) { 
    this.world.loadTheme(theme); 
}

GameWorld.prototype.unloadThemes = function() { 
    this.world.unloadThemes(); 
}

GameWorld.prototype.setPlayers = function(players) { 
    this.world.setPlayers(players);
}

GameWorld.prototype.setNPCs = function(npcs) { 
    this.world.setNPCs(npcs);
}

GameWorld.prototype.removePlayer = function(player) { 
    this.world.removePlayer(player);
}

GameWorld.prototype.setViews = function(views) { 
    this.views = views;
    return this.views; 
}

GameWorld.prototype.showViews = function() { 
    this.do("show");
}

GameWorld.prototype.hideViews = function() { 
    this.do("hide");
}

GameWorld.prototype.resize = function() { 
    this.do("resize");
}

GameWorld.prototype.pause = function(now) { 
    this.do("pause", now);
}

GameWorld.prototype.resume = function(now) { 
    this.world.resume(now);
    this.do("resume", now);
}

GameWorld.prototype.update = function(now, delta) { 
    this.world.update(now, delta);
    this.do("update", [now, delta, this.world]);
}

GameWorld.prototype.render = function(now) { 
    this.do("render", [now, this.world]);
}

GameWorld.prototype.fps = function(type, fps) {
    this.do("updateFPS", [type, fps.fps, fps.avg]);
}

GameWorld.prototype.reset = function(now) {
    this.world.reset(now);
    this.do("reset");
    benchmark("world reset");
}

GameWorld.prototype.do = function(f, a) { 
    if (!this.views) return;
    for (var i = 0; i < this.views.length; i++) {
        var v = this.views[i];
        if (a) {
            if (Array.isArray(a)) v[f].apply(v, a);
            else v[f](a);
        }
        else v[f]();
    }
}

GameWorld.prototype.doAction = function(action, args, key, val, callback) { 
    this.world.doAction(action, args, key, val, callback); 
}
