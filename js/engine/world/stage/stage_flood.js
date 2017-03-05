"use strict";

function StageFlood() {
    this.doflood = false;
    this.level = 0;
    this.y = 0;
    this.amount = 0.5;
    this.max = 0;
    this.min = -40;
    this.down = true;
    this.waterline = 0;
}

StageFlood.prototype.init = function(item) {
    this.y = item.y;
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
    this.waterline = round(this.y + this.level);
}