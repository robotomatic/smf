"use strict";

function CharacterAnimationLoader(animations) {
    this.stateAnimations = new Array();
    this.animations = new Array();
    this.loadAnimations(animations);
}

CharacterAnimationLoader.prototype.loadAnimations = function(charanimations) {
    this.stateAnimations.length = 0;
    this.animations = new Array();
    for (var a in charanimations) {
        var fu = charanimations[a];
        if (fu !== undefined) this.animations[a] = JSON.parse(JSON.stringify(fu));
    }
    for (var animname in this.animations) {
        var animation = this.animations[animname];
        for (var statename in animation) {
            var stateanim = animation[statename];
            if (!stateanim) continue;
            if (stateanim.override) this.animations = this.removeAnimation(this.animations, animname, stateanim.name);
            for (var partname in stateanim.parts) {
                var part = stateanim.parts[partname];
                if (part && part.override)  this.animations = this.removeAnimation(this.animations, animname, stateanim.name, partname);
            }
            if (!this.stateAnimations[statename]) this.stateAnimations[statename] = new Array();
            this.stateAnimations[statename][animname] = animname;
        }
    }
}

CharacterAnimationLoader.prototype.removeAnimation = function(animations, remtypename, remstatename, rempartname) {
    for (var animname in animations) {
        if (animname == remtypename) continue;
        var animation = animations[animname];
        for (var statename in animation) {
            if (statename != remstatename) continue;
            if (rempartname) {
                var stateanim = animation[statename];
                for (var partname in stateanim.parts) {
                    if (partname != rempartname) continue;
                    stateanim.parts[partname] = null;
                }
            } else animation[statename] = null;
        }
    }
    return animations;
}

