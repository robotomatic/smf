"use strict";

function CharacterAnimator(animations) {
    this.loader = new CharacterAnimationLoader(animations);
    this.puppet = new CharacterAnimationPuppet();
    this.currentAnimations = new Array();
    this.animstates = new Array();
    this.idlespeed = .1;
}

CharacterAnimator.prototype.animate = function(now, character) {
    this.puppet.initialize(character);
    this.idlespeed = character.idlespeed;
    this.updateAnimations(now, character.direction, character.state);
    this.reapAnimations(now);
    this.runAnimations(now);
    this.blendAnimations(now);
}
    
CharacterAnimator.prototype.updateAnimations = function(now, direction, state) {
    this.animstates.length = 0;
    this.animstates[0] = "default";
    if (direction) {
        this.animstates[this.animstates.length] = "default_" + direction;
        this.animstates[this.animstates.length] = direction;
    }
    if (state) this.animstates[this.animstates.length] = state;
    if (state && direction) this.animstates[this.animstates.length] = state + "_" + direction;
    this.addBlink();
    if (state == "idle") {
        this.addRandom("random");
        if (direction) this.addRandom("random_" + direction);
        if (state) this.addRandom("random_" + state);
    }
}
    
CharacterAnimator.prototype.reapAnimations = function(now) {
    var keys = Object.keys(this.currentAnimations);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var curanim = this.currentAnimations[key];
        curanim.running = false;
        var tt = this.animstates.length;
        for (var ii = 0; ii < tt; ii++) {
            var animname = this.animstates[ii];
            if (!animname) continue;
            if (curanim.name == animname) {
                this.currentAnimations[key].running = true;            
                break;
            }
        }
    }
}

CharacterAnimator.prototype.runAnimations = function(now) {
    for (var i = 0; i < this.animstates.length; i++) {
        if (!this.animstates[i]) continue;
        this.animateState(now, this.animstates[i]);
    }
}

CharacterAnimator.prototype.animateState = function(now, state) {
    if (!this.loader.stateAnimations[state]) return;
    var sa = this.loader.stateAnimations[state];
    for (var animtype in sa) {
        var animations = this.loader.animations[animtype];
        var stateanim = animations[state];
        if (!stateanim) continue;
        if (state == "idle") stateanim.duration = this.idlespeed;
        this.animateCharacterBox(stateanim);
        var animname = animtype + "-" + state;
        if (this.currentAnimations[animname]) {
            if (this.currentAnimations[animname].running && !this.currentAnimations[animname].animationOver) {            
                this.currentAnimations[animname].next(now, this.puppet.indexchar);
            } else {
                this.currentAnimations[animname].reset(state, stateanim);
                this.currentAnimations[animname].start(now, this.puppet.indexchar);
            }
        } else {
            this.currentAnimations[animname] = new CharacterAnimationManager(state, stateanim);
            this.currentAnimations[animname].start(now, this.puppet.indexchar);
        }
    }
}

CharacterAnimator.prototype.blendAnimations = function(now) {
    var p = Object.keys(this.puppet.indexchar);
    for (var i = 0 ; i < p.length; i++) {
        if (p[i] == "pad" || p[i] == "keys" || p[i] == "group") continue;
        var pp = this.puppet.indexchar[p[i]];
        this.applyBlend(pp);
    }
}

CharacterAnimator.prototype.applyBlend = function(part) {    
    
    if (!part.width || !part.height) return;
    
    var trans = .3;
    
    var lx = part.last.box.x;
    var blendx = lx - part.x;
    var bx = blendx * trans;
    part.x = part.x + bx;
        
    var ly = part.last.box.y;
    var blendy = ly - part.y;
    var by = blendy * trans;
    part.y = part.y + by;
        
    var lh = part.last.box.height;
    var blendh = lh - part.height;
    var bh = blendh * trans;
    part.height = part.height + bh;
        
    var lw = part.last.box.width;
    var blendw = lw - part.width;
    var bw = blendw * trans;
    part.width = part.width + bw;
    
    var la = part.last.angle;
    if (la || la === 0) {
        var blenda = la - part.angle;
        var ba = blenda * trans;
        part.angle = part.angle + ba;
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
    for (var animtype in this.loader.animations) {
        var animations = this.loader.animations[animtype];
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
        for (var animtype in this.loader.animations) {
            var animations = this.loader.animations[animtype];
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

CharacterAnimator.prototype.animateCharacterBox = function(animation) {
    if (animation.width || animation.width == 0) {
        var aw = animation.width / 100;
        var nw = this.puppet.animbox.width * aw;
        var wd = this.puppet.animbox.width - nw;
        this.puppet.animbox.width = nw;
        this.puppet.animbox.x += wd / 2;
    }
    if (animation.height || animation.height == 0) {
        var ah = animation.height / 100;
        var nh = this.puppet.animbox.height * ah;
        var hd = this.puppet.animbox.height - nh;
        this.puppet.animbox.height = nh;
        this.puppet.animbox.y -= hd / 2;
    }
    if (animation.x) this.puppet.animbox.x = animation.x;
    if (animation.y) this.puppet.animbox.y += animation.y;
    
    this.puppet.animbox.draw = animation.draw;
}