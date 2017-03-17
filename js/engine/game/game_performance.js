"use strict"

function GamePerformance(game, step) {

    this.game = game;
    this.step = step;
    
    this.lt = 0;
    this.tps = 0;
    this.ttps = 0;
    this.atps = 0;
    this.nt = 0;
    
    this.lu = 0;
    this.ups = 0;
    this.tups = 0;
    this.aups = 0;
    this.nu = 0;
    
    this.lr = 0;
    this.rps = 0;
    this.trps = 0;
    this.arps = 0;
    this.nr = 0;
    
    this.start = 0;
    this.frame = 0;
    this.fps = 0;
    
    this.last = timestamp();
    this.count = 1;
    this.total = 0;
    this.avg = 0;
}


GamePerformance.prototype.getFPS = function (when) {
    this.frame++;		
    var d = timestamp();
    var time = ( d - this.start ) / 1000;
    this.fps = floor((this.frame / time));		
    if( time > 1 ){			
        this.start = timestamp();			
        this.frame = 0;		
    }		
    this.total += this.fps;
    this.count++;
    this.avg = clamp(this.total / this.count);
}

GamePerformance.prototype.tick = function(when) {}
GamePerformance.prototype.loopStart = function(when) {}

GamePerformance.prototype.loopEnd = function(when) {
    this.getFPS(timestamp());
    this.game.fps("FPS", this.fps, this.avg);
}


GamePerformance.prototype.updateStart = function(when) {}
GamePerformance.prototype.updateEnd = function(when) {}
GamePerformance.prototype.renderStart = function(when) {}
GamePerformance.prototype.renderEnd = function(when) {}

GamePerformance.prototype.reset = function(when) {
    this.start = when;
}

GamePerformance.prototype.pauseStart = function(when) {
}

GamePerformance.prototype.pauseEnd = function(when) {
    this.start = when;
}