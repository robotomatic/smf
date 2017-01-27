function Animations() {
    this.animations = {};
}

Animations.prototype.loadJson = function(json) {
    for (var anim in json) {
        this.animations[anim] = new Animation().loadJson(json[anim]);
    }
    return this.animations;
}