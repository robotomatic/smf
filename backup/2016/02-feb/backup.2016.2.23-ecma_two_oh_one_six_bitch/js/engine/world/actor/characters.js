"use strict";

function Characters() {
    this.json = null;
    this.characters = new Array();
}

Characters.prototype.loadJson = function(json) {
    this.json = json;
    for (let char in json) {
        this.characters[char] = new Character().loadJson(json[char]);
    }
    return this.characters;
}