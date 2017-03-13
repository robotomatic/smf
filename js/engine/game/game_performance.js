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

GamePerformance.prototype.tick = function(when) {
//    this.nt += 1;
//    if (this.lt) {
//        this.tps = this.calculateFPS(when, this.lt);
//        this.ttps += this.tps;
//        this.atps = this.calculateAverageFPS(this.ttps, this.nt);
//    }
//    this.lt = when;
//    this.logFPS("tick", this.tps, this.atps);
}



GamePerformance.prototype.loopStart = function(when) {
}

GamePerformance.prototype.loopEnd = function(when) {
    this.getFPS(timestamp());
    this.game.fps("FPS", this.fps, this.avg);
}




GamePerformance.prototype.updateStart = function(when) {
//    this.nu += 1;
//    if (this.lu) {
//        this.ups = this.calculateFPS(when, this.lu);
//        this.tups += this.ups;
//        this.aups = this.calculateAverageFPS(this.tups, this.nu);
//    }
//    this.lu = when;
//    this.logFPS("update", this.ups, this.aups);
}

GamePerformance.prototype.updateEnd = function(when) {
}




GamePerformance.prototype.renderStart = function(when) {
//    this.nr += 1;
//    if (this.lr) {
//        this.rps = this.calculateFPS(when, this.lr);
//        this.trps += this.rps;
//        this.arps = this.calculateAverageFPS(this.trps, this.nr);
//    }
//    this.lr = when;
//    this.logFPS("render", this.rps, this.arps);
}

GamePerformance.prototype.renderEnd = function(when) {
}






GamePerformance.prototype.calculateFPS = function(when, last) {
//    return 1000 / (when - last); 
}

GamePerformance.prototype.calculateAverageFPS = function(fps, num) {
//    return fps / num;
}

GamePerformance.prototype.logFPS = function(type, fps, avg) {
//    if (!__dev) return;
//    this.game.fps(type, fps, avg);
}

GamePerformance.prototype.reset = function(when) {
//    logDev();
//    logDev("Reset Graphics ---> " + when);
//    logDev();
}



