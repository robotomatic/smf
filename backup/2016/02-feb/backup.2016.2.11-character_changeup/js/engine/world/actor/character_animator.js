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
            if (!this.stateAnimations[statename]) this.stateAnimations[statename] = new Array();
            this.stateAnimations[statename][animname] = animname;
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
    
    if (!this.animbox) this.animbox = new Rectangle(box.x, box.y, box.width, box.height);
    else {
        this.animbox.x = box.x;
        this.animbox.y = box.y;
        this.animbox.width = box.width;
        this.animbox.height = box.height;
    }
    if (!this.character) this.character = character;
    
    if (!this.animchar) this.animchar = JSON.parse(JSON.stringify(character.parts));
    if (!this.indexchar) this.createCharacterPuppet(this.character);
    else this.resetCharacterPuppet();

    this.idlespeed = character.idlespeed;
    
    this.animstates.length = 0;

    this.animstates[this.animstates.length] = "default";
    
    if (direction) this.animstates[this.animstates.length] = direction;
    if (state) this.animstates[this.animstates.length] = state;
    if (state && direction) this.animstates[this.animstates.length] = state + "_" + direction;

    this.addBlink();
    this.addRandom("random");
    if (direction) this.addRandom("random_" + direction);
    if (state) this.addRandom("random_" + state);
    
    this.currentAnimations = this.reapAnimations(this.animstates);
    for (var i = 0; i < this.animstates.length; i++) {
        if (!this.animstates[i]) continue;
        this.animateState(now, this.animstates[i]);
    }
}

CharacterAnimator.prototype.createCharacterPuppet = function(character) {
    this.indexchar = new Array();
    this.indexCharacterPuppetParts(this.animchar);
}

CharacterAnimator.prototype.indexCharacterPuppetParts = function(parts) {
    var p = Object.keys(parts);
    for (var i = 0 ; i < p.length; i++) {
        var pp = parts[p[i]];
        pp.reset = new characterAnimationInfo();
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
    var p = Object.keys(this.indexchar);
    for (var i = 0 ; i < p.length; i++) {
        var pp = this.indexchar[p[i]];
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
    var blink = false;
    var keys = Object.keys(this.currentAnimations);
    for (var i = 0; i < keys.length; i++) {
        if (this.currentAnimations[keys[i]].name == "blink") {
            if (!this.currentAnimations[keys[i]].animationOver) {
                this.animstates[this.animstates.length] = "blink";
                blink = true;
            }
            break;
        }
    }
    if (blink) return;
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

CharacterAnimator.prototype.addRandom = function(rand) {
    var rando = false;
    var keys = Object.keys(this.currentAnimations);
    for (var i = 0; i < keys.length; i++) {
        if (this.currentAnimations[keys[i]].name == rand) {
            if (!this.currentAnimations[keys[i]].animationOver) {
                this.animstates[this.animstates.length] = rand;
                rando = true;
            }
            break;
        }
    }
    if (!rando) {
        var r = random(0, 1000);
        for (var animtype in this.animations) {
            var animations = this.animations[animtype];
            if (!animations[rand]) continue;
            var stateanim = animations[rand];
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
    
    if (!this.stateAnimations[state]) return;
    var sa = this.stateAnimations[state];
    
    for (var animtype in sa) {
        
        var animations = this.animations[animtype];
        
        var stateanim = animations[state];
        if (!stateanim) continue;
        
        if (state == "idle") stateanim.duration = this.idlespeed;
        
        this.animateCharacterBox(stateanim);
        var animname = animtype + "-" + state;
        
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
        var debug = true;
        return;
    }
    
    
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