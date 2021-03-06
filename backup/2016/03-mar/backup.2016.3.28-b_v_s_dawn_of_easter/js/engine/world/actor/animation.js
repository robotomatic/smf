"use strict";

function Animation() {
    this.name;
    this.duration = 0;
    this.repeat = false;
    this.loop;
    this.width;
    this.height;
    this.x;
    this.y;
    this.parts = {};
    this.override = false;
    this.reset = true;
    this.chance = 0;
}

Animation.prototype.loadJson = function(json) {
    this.name = json.name;
    this.duration = json.duration;
    this.repeat = json.repeat;
    this.loop = json.loop;
    this.width = json.width;
    this.height = json.height;
    this.x = json.x;
    this.y = json.y;
    var keys = json.parts ? Object.keys(json.parts) : null;
    if (keys) for (var i = 0; i < keys.length; i++) this.parts[keys[i]] = json.parts[keys[i]];
    this.override = json.override;
    this.reset = json.reset === false ? false : true;
    this.chance = json.chance;
    return this;
}