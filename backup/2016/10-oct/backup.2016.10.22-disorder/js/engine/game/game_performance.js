"use strict"

function GamePerformance(step) {
    
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
}

GamePerformance.prototype.tick = function(when) {
    this.nt += 1;
    if (this.lt) {
        this.tps = this.calculateFPS(when, this.lt);
        this.ttps += this.tps;
        this.atps = this.calculateAverageFPS(this.ttps, this.nt);
    }
    this.lt = when;
    this.logFPS("tick", this.tps, this.atps);
}

GamePerformance.prototype.updateStart = function(when) {
    this.nu += 1;
    if (this.lu) {
        this.ups = this.calculateFPS(when, this.lu);
        this.tups += this.ups;
        this.aups = this.calculateAverageFPS(this.tups, this.nu);
    }
    this.lu = when;
    this.logFPS("update", this.ups, this.aups);
}

GamePerformance.prototype.updateEnd = function(when) {
}

GamePerformance.prototype.renderStart = function(when) {
    this.nr += 1;
    if (this.lr) {
        this.rps = this.calculateFPS(when, this.lr);
        this.trps += this.rps;
        this.arps = this.calculateAverageFPS(this.trps, this.nr);
    }
    this.lr = when;
    this.logFPS("render", this.rps, this.arps);
}

GamePerformance.prototype.renderEnd = function(when) {
}

GamePerformance.prototype.calculateFPS = function(when, last) {
    return 1000 / (when - last); 
}

GamePerformance.prototype.calculateAverageFPS = function(fps, num) {
    return fps / num;
}

GamePerformance.prototype.logFPS = function(type, fps, avg) {
    logDevFPS(type, clamp(fps), clamp(avg));
}

GamePerformance.prototype.reset = function(when) {
    logDev();
    logDev("Reset Graphics ---> " + when);
    logDev();
}