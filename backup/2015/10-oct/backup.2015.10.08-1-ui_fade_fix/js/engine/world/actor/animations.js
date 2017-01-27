function Animations() {
    this.animations = {};
}

Animations.prototype.loadJson = function(json) {
    for (var anim in json) {
        this.animations[anim] = {};
        for (var a in json[anim]) {
            this.animations[anim][a] = new Animation().loadJson(json[anim][a]);
        }
    }
    return this.animations;
}