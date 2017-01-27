function CharacterAnimator(animations) {
    this.animations = this.loadAnimations(animations);
    this.animbox = null;
    this.animchar = null;
    this.currentAnimations = new Array();
    this.newCurrent = new Array();
    this.animstates = new Array();
}

CharacterAnimator.prototype.getMbr = function() {
    return this.animbox;
}
    
CharacterAnimator.prototype.getCharacter = function() {
    return this.animchar;
}
    
CharacterAnimator.prototype.loadAnimations = function(charanimations) {
    var animout = new Array();
    for (var a in charanimations) animout[a] = JSON.parse(JSON.stringify(charanimations[a]));
    for (var animname in animout) {
        var animation = animout[animname];
        for (var statename in animation) {
            var stateanim = animation[statename];
            if (stateanim.override) animout = this.removeAnimation(animout, animname, stateanim.name);
            for (var partname in stateanim.parts) {
                var part = stateanim.parts[partname];
                if (part && part.override)  animout = this.removeAnimation(animout, animname, stateanim.name, partname);
            }
        }
    }
    return animout;
}

CharacterAnimator.prototype.removeAnimation = function(animations, remtypename, remstatename, rempartname) {
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

CharacterAnimator.prototype.animate = function(now, box, direction, state, character) {
    
    
    // todo: idle & random states
    
    this.animbox = Object.create(box);
    this.animchar = JSON.parse(JSON.stringify(character.parts));

    this.animstates.length = 0;
    if (direction) this.animstates[this.animstates.length] = direction;
    if (state) this.animstates[this.animstates.length] = state;
    if (state && direction) this.animstates[this.animstates.length] = state + "_" + direction;
    
    this.currentAnimations = this.reapAnimations(this.animstates);
    for (var i = 0; i < this.animstates.length; i++) {
        if (!this.animstates[i]) continue;
        this.animateState(now, this.animstates[i]);
    }
}

CharacterAnimator.prototype.reapAnimations = function(animations) {
    this.newCurrent.length = 0;
    if (animations.length) {
        for (var i = 0; i < animations.length; i++) {
            var animname = animations[i];
            if (!animname) continue;
            var keys = Object.keys(this.currentAnimations);
            for (var ii = 0; ii < keys.length; ii++) {
                var key = keys[ii];
                if (this.currentAnimations[key].name == animname) this.newCurrent[key] = this.currentAnimations[key];
            }
        }
    }
    return this.newCurrent;
}
    
CharacterAnimator.prototype.animateState = function(now, state) {
    for (var animtype in this.animations) {
        var animations = this.animations[animtype];
        if (!animations[state]) continue;
        var stateanim = animations[state];
        this.animateCharacterBox(stateanim);
        var animname = animtype + "-" + state;
        if (this.currentAnimations[animname]) this.currentAnimations[animname].next(now, this.animchar);
        else {
            this.currentAnimations[animname] = new AnimationManager(state, stateanim);
            this.currentAnimations[animname].start(now, this.animchar);
        }
    }
}

CharacterAnimator.prototype.animateCharacterBox = function(animation) {
    if (animation.width) {
        var aw = animation.width / 100;
        var nw = this.animbox.width * aw;
        var wd = this.animbox.width - nw;
        this.animbox.width = nw;
        this.animbox.x += wd / 2;
    }
    if (animation.height) {
        var ah = animation.height / 100;
        var nh = this.animbox.height * ah;
        var hd = this.animbox.height - nh;
        this.animbox.height = nh;
        this.animbox.y -= hd / 2;
    }
    if (animation.x)  this.animbox.x += animation.x;
    if (animation.y) this.animbox.y += animation.y;
}