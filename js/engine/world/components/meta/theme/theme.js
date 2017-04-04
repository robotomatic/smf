"use strict";

function Theme(name) {
    this.name = name;
    this.background = "";
    this.physics = null;
    this.items = new Array();
}

Theme.prototype.loadJson = function(json) {
    this.background = json.background;
    this.items = json.items;
    this.physics = json.physics;
    return this;
}

Theme.prototype.reset = function() {
    this.name = name;
    this.background = "";
    this.physics = null;
    this.items = new Array();
}