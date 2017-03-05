"use strict";

function StageFlood() {
    this.doflood = false;
    this.level = 0;
    this.y = 0;
    this.amount = 1;
    this.max = 5;
    this.min = -2;
    this.down = true;
    this.waterline = 0;
}

StageFlood.prototype.init = function(level) {
    this.y = level;
    this.doflood = true;
}

StageFlood.prototype.getFlood = function() {
    if (!this.doflood) return null;
    if (this.down) {
        this.level += this.amount;
        if (this.level > this.max) {
            this.down = false;
        }
    } else {
        this.level -= this.amount;
        if (this.level < this.min) {
            this.down = true;
        }
    }
    this.waterline = this.y + this.level;
}