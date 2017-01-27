"use strict";

function StageFlood() {
    this.doflood = false;
    this.flood = {
        level : 0,
        y : 0,
        amount : 0.1,
        max : 5,
        min : -2,
        down : true
    }
    this.ready = false;
}



StageFlood.prototype.init = function(level) {
    this.flood.y = level;
    if (this.flood.down) {
        this.flood.level += this.flood.amount;
        if (this.flood.level > this.flood.max) {
            this.flood.down = false;
        }
    } else {
        this.flood.level -= this.flood.amount;
        if (this.flood.level < this.flood.min) {
            this.flood.down = true;
        }
    }
    this.ready = true;
}

StageFlood.prototype.getFlood = function() {
    return this.ready ? this.flood.level + this.flood.y : null;
}