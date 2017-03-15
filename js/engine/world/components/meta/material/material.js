"use strict";

function Material() {
    this.name = "";
    this.renderer = "";
    this.color = null;
    this.waterline = null;
    this.damage = null;
}

Material.prototype.loadJson = function(json) {
    this.name = json.name;
    this.renderer = json.renderer;
    this.color = json.color;
    this.waterline = json.waterline;
    this.damage = json.damage;
    this.properties = json.properties;
    return this;
}
