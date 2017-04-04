"use strict";

function Layer() {
    this.name;
    this.collide = false;
    this.draw = true;
    this.cache = false;
    this.items = new Items();
}

Layer.prototype.loadJson = function(json) {
    this.name = json.name;
    this.collide = json.collide;
    this.draw = json.draw;
    this.items.loadJson(json.items, this.collide);
    return this;
}

Layer.prototype.update = function(now, delta, renderer) { 
    this.items.update(now, delta, renderer, this.depth);
}