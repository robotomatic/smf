"use strict";

function CharacterPartsPartInfo(part) {
    this.box = new Rectangle(0, 0, 0, 0);
    this.angle = 0;
    this.draw = true;
    this.zindex = 0;
    this.outline = false;
    this.pointinfo = null;
    this.color = "";
    if (part) this.reset(part);
}

CharacterPartsPartInfo.prototype.reset = function(part) {
    this.box.x = part.x;
    this.box.y = part.y;
    this.box.width = part.width;
    this.box.height = part.height;
    this.angle = part.angle;
    this.draw = part.draw;
    this.zindex = part.zindex;
    this.outline = part.outline;
    this.pointinfo = part.pointinfo;
    this.color = part.color;
}
