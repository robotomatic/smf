"use strict";

function Material() {
}

Material.prototype.loadJson = function(json) {
    for (var att in json) this[att] = json[att];
    return this;
}
