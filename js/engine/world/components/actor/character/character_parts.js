"use strict";

function CharacterParts(width, height, parts) {
    this.box = new Rectangle(0, 0, 0, 0);;
    this.parts = null;
    this.index = new Array();
    this.keys = new Array();
    if (parts) this.initialise(width, height, parts);
}

CharacterParts.prototype.initialize = function(width, height, parts) {
    this.box.x = 0;
    this.box.y = 0;
    this.box.width = width;
    this.box.height = height;
    this.parts = parts;
    this.buildParts(this.parts);
}

CharacterParts.prototype.buildParts = function(parts) {
    var keys = Object.keys(parts);
    if (!keys.length) return;
    parts.keys = new Array();
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var key = keys[i];
        var part = parts[key];
        this.indexPart(key, part);
        parts.keys[parts.keys.length] = key;
        this.keys.push(key);
        if (part.parts) this.buildParts(part.parts);
    }
}

CharacterParts.prototype.indexPart = function(key, part) {
    part.reset = new CharacterPartsPartInfo(part);
    part.last = new CharacterPartsPartInfo(part);
    this.index[key] = part;
}

CharacterParts.prototype.reset = function() {
    var keys = this.keys;
    var t = keys.length;
    for (var i = 0 ; i < t; i++) {
        var key = keys[i];
        var part = this.index[key];
        this.resetPart(part);
    }
}
        
CharacterParts.prototype.resetPart = function(part) {
    part.last.reset(part);
    part.x = part.reset.box.x;
    part.y = part.reset.box.y;
    part.width = part.reset.box.width;
    part.height = part.reset.box.height;
    part.angle = part.reset.angle;
    part.draw = part.reset.draw;
    part.zindex = part.reset.zindex;
    part.outline = part.reset.outline;
    part.pointinfo = part.reset.pointinfo;
    part.color = part.reset.color;
}