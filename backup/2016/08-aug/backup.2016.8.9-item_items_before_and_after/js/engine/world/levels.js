"use strict";

function Levels() {
    this.json = null;
    this.levels = new Array();
}

Levels.prototype.loadJson = function(json) {
    this.json = json;
    for (var level in json) {
        this.levels[level] = json[level];
    }
    return this.levels;
}