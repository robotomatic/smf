function CharacterAnimator(animations) {
    this.animations = this.loadAnimations(animations);
    this.animbox = null;
    this.animchar = null;
    this.currentAnimations = new Array();
    this.newCurrent = new Array();
    this.animstates = new Array();
    this.random = false;
    this.idlespeed = ".1";
}

CharacterAnimator.prototype.getMbr = function() {
    return this.animbox;
}
    
CharacterAnimator.prototype.getCharacter = function() {
    return this.animchar;
}
    
CharacterAnimator.prototype.loadAnimations = function(charanimations) {
    var animout = new Array();
    for (var a in charanimations) {
        var fu = charanimations[a];
        if (fu !== undefined) animout[a] = JSON.parse(JSON.stringify(fu));
    }
    for (var animname in animout) {
        var animation = animout[animname];
        for (var statename in animation) {
            var stateanim = animation[statename];
            if (!stateanim) continue;
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
    
    // todo: this can be optimized:
    //          - local cache box and character puppet objects
    //          - move puppet relative to master character object
    this.animbox = Object.create(box);
    this.animchar = JSON.parse(JSON.stringify(character.parts));

    this.idlespeed = character.idlespeed;
    
    this.animstates.length = 0;

    this.animstates[this.animstates.length] = "default";
    
    if (direction) this.animstates[this.animstates.length] = direction;
    if (state) this.animstates[this.animstates.length] = state;
    if (state && direction) this.animstates[this.animstates.length] = state + "_" + direction;

    var blink = false;
    var keys = Object.keys(this.currentAnimations);
    for (var ii = 0; ii < keys.length; ii++) {
        if (this.currentAnimations[keys[ii]].name == "blink") {
            if (!this.currentAnimations[keys[ii]].animationOver) {
                this.animstates[this.animstates.length] = "blink";
                blink = true;
            }
            break;
        }
    }

    if (!blink) {
        var r = random(0, 1000);
        for (var animtype in this.animations) {
            var animations = this.animations[animtype];
            if (!animations["blink"]) continue;
            var stateanim = animations["blink"];
            if (stateanim) {
                if (r <= stateanim.chance) {
                    this.animstates[this.animstates.length] = "blink";
                }
            }
        }
    }

    var rando = false;
    var keys = Object.keys(this.currentAnimations);
    for (var ii = 0; ii < keys.length; ii++) {
        if (this.currentAnimations[keys[ii]].name == "random") {
            if (!this.currentAnimations[keys[ii]].animationOver) {
                this.animstates[this.animstates.length] = "random";
                rando = true;
            }
            break;
        }
    }

    if (!rando) {
        var r = random(0, 1000);
        for (var animtype in this.animations) {
            var animations = this.animations[animtype];
            if (!animations["random"]) continue;
            var stateanim = animations["random"];
            if (stateanim) {
                if (r <= stateanim.chance) {
                    this.animstates[this.animstates.length] = "random";
                }
            }
        }
    }
    
    this.currentAnimations = this.reapAnimations(this.animstates);
    for (var i = 0; i < this.animstates.length; i++) {
        if (!this.animstates[i]) continue;
        this.animateState(now, this.animstates[i]);
    }
}

CharacterAnimator.prototype.reapAnimations = function(animations) {
    this.newCurrent = [];
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
        
        if (state == "idle") stateanim.duration = this.idlespeed;
        
        this.animateCharacterBox(stateanim);
        var animname = animtype + "-" + state;
        
        if (this.currentAnimations[animname]) {
            this.currentAnimations[animname].next(now, this.animchar);
            //
            // check for animation over here ? --> can remove reaper if trustworthy(!)
            // store last animation state for parts and pass to animation start because lerp
            //
        } else {
            this.currentAnimations[animname] = new AnimationManager(state, stateanim);
            this.currentAnimations[animname].start(now, this.animchar);
        }
    }
}

CharacterAnimator.prototype.animateCharacterBox = function(animation) {
    if (animation.width || animation.width == 0) {
        var aw = animation.width / 100;
        var nw = this.animbox.width * aw;
        var wd = this.animbox.width - nw;
        this.animbox.width = nw;
        this.animbox.x += wd / 2;
    }
    if (animation.height || animation.height == 0) {
        var ah = animation.height / 100;
        var nh = this.animbox.height * ah;
        var hd = this.animbox.height - nh;
        this.animbox.height = nh;
        this.animbox.y -= hd / 2;
    }
    if (animation.x)  this.animbox.x += animation.x;
    if (animation.y) this.animbox.y += animation.y;
    if (animation.draw === false) this.animbox.draw = false;
    if (animation.draw === true) this.animbox.draw = true;
}