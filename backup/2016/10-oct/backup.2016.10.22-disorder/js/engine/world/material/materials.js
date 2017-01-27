"use strict";

function Materials() {
    this.json = null;
    this.materials = new Array();
}

Materials.prototype.loadJson = function(json) {
    this.json = json;
    for (var material in json) {
        var m = new Material();
        m.loadJson(json[material]);
        this.materials[material] = m;
    }
    return this.materials;
}