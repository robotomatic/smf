"use strict";

function Waterline() {
    this.dowaterline = false;
    this.level = 0;
    this.y = 0;
    this.z = 0;
    this.amount = 0.3;
    this.max = 20;
    this.min = -20;
    this.down = true;
    this.waterline = 0;
}

Waterline.prototype.init = function(item) {
    this.y = item.y;
    this.z = item.z;
    this.dowaterline = true;
}

Waterline.prototype.getFlood = function() {
    if (!this.dowaterline) return null;
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