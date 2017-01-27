"use strict";

function Animations() {
    this.animations = {};
}

Animations.prototype.loadJson = function(json) {
    for (let anim in json) {
        this.animations[anim] = {};
        for (let a in json[anim]) {
            this.animations[anim][a] = new Animation().loadJson(json[anim][a]);
        }
    }
    return this.animations;
}