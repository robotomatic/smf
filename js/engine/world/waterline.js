"use strict";

function Waterline() {
    this.flow = false;
    this.level = 0;
    this.y = 0;
    this.z = 0;
    this.amount = 0;
    this.miny = 0;
    this.maxy = 0;
    this.down = true;
    this.waterline = 0;
}

Waterline.prototype.getFlood = function() {
    if (!this.flow) return null;
    if (this.down) {
        this.level += this.amount;
        if (this.level > this.maxy) {
            this.down = false;
        }
    } else {
        this.level -= this.amount;
        if (this.level < this.miny) {
            this.down = true;
        }
    }
    this.waterline = round(this.y + this.level);
}