function CharacterAnimator(animations) {
    this.animations = animations;
    this.animbox = null;
    this.animchar = null;
    this.currentAnimations = new Array();
}

CharacterAnimator.prototype.animate = function(box, animstates, character) {

    this.animbox = Object.create(box);
    this.animchar = JSON.parse(JSON.stringify(character.parts));
    
    this.currentAnimations = this.reapAnimations(animstates);
    for (var i = 0; i < animstates.length; i++) {
        if (!animstates[i]) continue;
        this.animateState(animstates[i]);
    }
    return { "box" : this.animbox, "character" : this.animchar };
}

CharacterAnimator.prototype.reapAnimations = function(animations) {
    var newCurrent = new Array();
    if (animations.length) {
        for (var i = 0; i < animations.length; i++) {
            var key = animations[i];
            if (!key) continue;
            if (this.currentAnimations[key]) newCurrent[key] = this.currentAnimations[key];
        }
    }
    return newCurrent;
}
    
CharacterAnimator.prototype.animateState = function(state) {
    var animations = this.animations["default"];  
    if (!animations[state]) return;
    
    var stateanim = animations[state];
    this.animateCharacterBox(stateanim);
    
    if (this.currentAnimations[state]) this.currentAnimations[state].next(this.animchar);
    else {
        this.currentAnimations[state] = new AnimationManager(state, stateanim);
        this.currentAnimations[state].start(this.animchar);
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

/*    
    
    if (!this.currentAnimation || stateanim.name != this.currentAnimation.name) {
        this.currentAnimation = stateanim;
        this.lastAnimationRender = timestamp();
        this.currentAnimationFrame = 0;
        this.currentAnimationRepeat = stateanim.repeat;
        this.currentAnimationOver = false;
    } else {
        var dt = (now - this.lastAnimationRender) / 1000;
        if (dt >= stateanim.duration) {
            this.currentAnimationFrame++;
            this.lastAnimationRender = timestamp();
        }
    }
    if (this.currentAnimation && !this.currentAnimationOver) {
        var parts = stateanim.parts;
        for (var part in parts) this.animateCharacterState(part, stateanim.parts[part]);
    }
}

CharacterAnimator.prototype.animateCharacterState = function(partname, animation) {
    part = this.getPart(partname, this.animchar);
    if (!part)  return;
    
    var frame;
    if (animation.frames) {
        var t = animation.frames.length;
        var framenum = 0;
        if (t > 1) {
            if (this.currentAnimationFrame < t) framenum = this.currentAnimationFrame;
            else {
                if (this.currentAnimationRepeat) framenum = this.currentAnimationFrame = 0;
                else {
                    this.currentAnimationOver = true;
                    this.currentAnimation = null;
                    return;
                }
            }
        } else {
            if (this.currentAnimationFrame > 0 && !this.currentAnimationRepeat) {
                this.currentAnimationOver = true;
                this.currentAnimation = null;
                return;
            }
        }
        frame = animation.frames[framenum];
    } else frame = animation;
    this.applyAnimation(frame, part);
    if (part.parts) {
        for (var partpart in part.parts) {
            this.animateCharacterState(partpart, animation);
        }
    }
}

CharacterAnimator.prototype.getPart = function(partname, parts) {
    for (var part in parts) {
        if (partname == part) return parts[part];
        else if (parts[part].parts) {
            var partpart = this.getPart(partname, parts[part].parts);
            if (partpart) return partpart;
        }
    }
}

CharacterAnimator.prototype.applyAnimation = function(animation, part) {
    if (part.height && part.width) {
        if (animation.height) part.height *= animation.height / 100;
        if (animation.width) part.width *= animation.width / 100;
        if (animation.x) part.x += animation.x;
        if (animation.y) part.y += animation.y;
    }
    return part;
}

*/