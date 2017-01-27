"use strict";

function CharacterAnimator(animations) {
    this.stateAnimations = new Array();
    this.animations = this.loadAnimations(animations);
    this.animbox = null;
    this.animchar = null;
    this.indexchar = null;
    this.character = null;
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
    this.stateAnimations.length = 0;
    let animout = new Array();
    for (let a in charanimations) {
        let fu = charanimations[a];
        if (fu !== undefined) animout[a] = JSON.parse(JSON.stringify(fu));
    }
    for (let animname in animout) {
        let animation = animout[animname];
        for (let statename in animation) {
            let stateanim = animation[statename];
            if (!stateanim) continue;
            if (stateanim.override) animout = this.removeAnimation(animout, animname, stateanim.name);
            for (let partname in stateanim.parts) {
                let part = stateanim.parts[partname];
                if (part && part.override)  animout = this.removeAnimation(animout, animname, stateanim.name, partname);
            }
            if (!this.stateAnimations[statename]) this.stateAnimations[statename] = new Array();
            this.stateAnimations[statename][animname] = animname;
        }
    }
    return animout;
}

CharacterAnimator.prototype.removeAnimation = function(animations, remtypename, remstatename, rempartname) {
    for (let animname in animations) {
        if (animname == remtypename) continue;
        let animation = animations[animname];
        for (let statename in animation) {
            if (statename != remstatename) continue;
            if (rempartname) {
                let stateanim = animation[statename];
                for (let partname in stateanim.parts) {
                    if (partname != rempartname) continue;
                    stateanim.parts[partname] = null;
                }
            } else animation[statename] = null;
        }
    }
    return animations;
}

CharacterAnimator.prototype.animate = function(now, box, direction, state, character) {
    
    if (!this.animbox) this.animbox = new Rectangle(box.x, box.y, box.width, box.height);
    else {
        this.animbox.x = box.x;
        this.animbox.y = box.y;
        this.animbox.width = box.width;
        this.animbox.height = box.height;
    }
    if (!this.character) this.character = character;
    
    if (!this.animchar) {
        this.animchar = JSON.parse(JSON.stringify(character.parts));
        if (character.pad) this.animchar.pad = character.pad;
    }
    if (!this.indexchar) this.createCharacterPuppet(this.character);
    else this.resetCharacterPuppet();

    this.idlespeed = character.idlespeed;
    
    this.animstates.length = 0;

    this.animstates[this.animstates.length] = "default";
    
    if (direction) this.animstates[this.animstates.length] = direction;
    if (state) this.animstates[this.animstates.length] = state;
    if (state && direction) this.animstates[this.animstates.length] = state + "_" + direction;

    this.addBlink();
    
    if (state == "idle") {
        this.addRandom("random");
        if (direction) this.addRandom("random_" + direction);
        if (state) this.addRandom("random_" + state);
    }
    
    this.currentAnimations = this.reapAnimations(this.animstates);
    for (let i = 0; i < this.animstates.length; i++) {
        if (!this.animstates[i]) continue;
        this.animateState(now, this.animstates[i]);
    }
}

CharacterAnimator.prototype.createCharacterPuppet = function(character) {
    this.indexchar = new Array();
    this.indexCharacterPuppetParts(this.animchar);
}

CharacterAnimator.prototype.indexCharacterPuppetParts = function(parts) {
    let p = Object.keys(parts);
    for (let i = 0 ; i < p.length; i++) {
        if (p[i] == "pad") continue;
        let pp = parts[p[i]];
        pp.reset = new CharacterAnimationInfo();
        pp.reset.box = new Rectangle(pp.x, pp.y, pp.width, pp.height);
        pp.reset.angle = pp.angle;
        pp.reset.draw = pp.draw;
        pp.reset.zindex = pp.zindex;
        pp.reset.pointinfo = pp.pointinfo;
        pp.reset.color = pp.color;
        this.indexchar[p[i]] = pp;
        if (pp.parts) this.indexCharacterPuppetParts(pp.parts);
    }
}

CharacterAnimator.prototype.resetCharacterPuppet = function() {
    let p = Object.keys(this.indexchar);
    for (let i = 0 ; i < p.length; i++) {
        let pp = this.indexchar[p[i]];
        pp.x = pp.reset.box.x;
        pp.y = pp.reset.box.y;
        pp.width = pp.reset.box.width;
        pp.height = pp.reset.box.height;
        pp.angle = pp.reset.angle;
        pp.draw = pp.reset.draw;
        pp.zindex = pp.reset.zindex;
        pp.pointinfo = pp.reset.pointinfo;
        pp.color = pp.reset.color;
    }
}

CharacterAnimator.prototype.addBlink = function() {
    let blink = false;
    let keys = Object.keys(this.currentAnimations);
    for (let i = 0; i < keys.length; i++) {
        if (this.currentAnimations[keys[i]].name == "blink") {
            if (!this.currentAnimations[keys[i]].animationOver) {
                this.animstates[this.animstates.length] = "blink";
                blink = true;
            }
            break;
        }
    }
    if (blink) return;
    let r = random(0, 1000);
    for (let animtype in this.animations) {
        let animations = this.animations[animtype];
        if (!animations["blink"]) continue;
        let stateanim = animations["blink"];
        if (stateanim) {
            if (r <= stateanim.chance) {
                this.animstates[this.animstates.length] = "blink";
            }
        }
    }
}

CharacterAnimator.prototype.addRandom = function(rand) {
    let rando = false;
    let keys = Object.keys(this.currentAnimations);
    for (let i = 0; i < keys.length; i++) {
        if (this.currentAnimations[keys[i]].name == rand) {
            if (!this.currentAnimations[keys[i]].animationOver) {
                this.animstates[this.animstates.length] = rand;
                rando = true;
            }
            break;
        }
    }
    if (!rando) {
        let r = random(0, 1000);
        for (let animtype in this.animations) {
            let animations = this.animations[animtype];
            if (!animations[rand]) continue;
            let stateanim = animations[rand];
            if (stateanim) {
                if (r <= stateanim.chance) {
                    this.animstates[this.animstates.length] = rand;
                }
            }
        }
    }
}
    
CharacterAnimator.prototype.reapAnimations = function(animations) {
    this.newCurrent = [];
    if (animations.length) {
        for (let i = 0; i < animations.length; i++) {
            let animname = animations[i];
            if (!animname) continue;
            let keys = Object.keys(this.currentAnimations);
            for (let ii = 0; ii < keys.length; ii++) {
                let key = keys[ii];
                if (this.currentAnimations[key].name == animname) this.newCurrent[key] = this.currentAnimations[key];
            }
        }
    }
    return this.newCurrent;
}
    
CharacterAnimator.prototype.animateState = function(now, state) {
    
    if (!this.stateAnimations[state]) return;
    let sa = this.stateAnimations[state];
    
    for (let animtype in sa) {
        
        let animations = this.animations[animtype];
        
        let stateanim = animations[state];
        if (!stateanim) continue;
        
        if (state == "idle") stateanim.duration = this.idlespeed;
        
        this.animateCharacterBox(stateanim);
        let animname = animtype + "-" + state;
        
        if (this.currentAnimations[animname]) {
            this.currentAnimations[animname].next(now, this.character, this.animchar, this.indexchar);
        } else {
            this.currentAnimations[animname] = new CharacterAnimationManager(state, stateanim);
            this.currentAnimations[animname].start(now, this.character, this.animchar, this.indexchar);
        }
    }
}

CharacterAnimator.prototype.animateCharacterBox = function(animation) {
    
    if (animation == null) {
        let debug = true;
        return;
    }
    
    
    if (animation.width || animation.width == 0) {
        let aw = animation.width / 100;
        let nw = this.animbox.width * aw;
        let wd = this.animbox.width - nw;
        this.animbox.width = nw;
        this.animbox.x += wd / 2;
    }
    if (animation.height || animation.height == 0) {
        let ah = animation.height / 100;
        let nh = this.animbox.height * ah;
        let hd = this.animbox.height - nh;
        this.animbox.height = nh;
        this.animbox.y -= hd / 2;
    }
    if (animation.x)  this.animbox.x += animation.x;
    if (animation.y) this.animbox.y += animation.y;
    if (animation.draw === false) this.animbox.draw = false;
    if (animation.draw === true) this.animbox.draw = true;
}