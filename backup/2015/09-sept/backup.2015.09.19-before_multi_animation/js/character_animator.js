function CharacterAnimator(animations) {
    this.animations = animations;
    this.lastRender = null;
    this.idleWaitTime = 1;
    this.currentAnimation;
    this.currentAnimationFrame = 0;
    this.lastAnimationRender;
    this.currentAnimationRepeat = false;
    this.currentAnimationOver = false;
}

CharacterAnimator.prototype.animate = function(box, state, direction, character) {
    var animbox = Object.create(box);
    var animchar = JSON.parse(JSON.stringify(character.parts));
    
    if (direction && this.animations[direction]) {
        var diranim = this.animations[direction];
        box = this.animateCharacterBox(diranim, box);
        var parts = diranim.parts;
        for (var part in parts) this.animateCharacterDirection(animchar, diranim.parts[part], box, part);
        this.lastRender = timestamp();
    }
    
    if (this.animations[state]) {
        var stateanim = this.animations[state];
        var now = timestamp();
        var lastrender = null;
        var go = false;
        if (state=="idle") {
            if (this.currentAnimation && stateanim.name == this.currentAnimation.name &&  !this.currentAnimationOver) go = true;
            else {
                if (!direction) {
                    var dt = (now - this.lastRender) / 1000;
                    if (dt >= this.idleWaitTime) {
                        var min = 1;
                        var max = 300;
                        var r = Math.floor(Math.random() * (max - min + 1)) + min;
                        go = r == 1;
                        if (go) this.lastRender = timestamp();
                    }
                }
            }
        } else go = true;
        
        if (go) {
            box = this.animateCharacterBox(stateanim, box);
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
                for (var part in parts) this.animateCharacterState(animchar, stateanim.parts[part], box, part);
            }
        }
    }
    
    return { "box" : animbox, "character" : animchar }
}

CharacterAnimator.prototype.animateCharacterDirection = function(character, animation, box, partname) {
    part = this.getPart(partname, character);
    if (!part) {
        console.log("CharacterAnimator.animateCharacterDirection : Unable to locate part - " + partname);
        return character;
    }
    var frame = (animation.frames) ? animation.frames[0] : animation;
    this.applyAnimation(frame, box, part);
    if (part.parts) {
        for (var partpart in part.parts) {
            this.animateCharacterDirection(character, animation, box, partpart);
        }
    }
}

CharacterAnimator.prototype.animateCharacterState = function(character, animation, box, partname) {
    part = this.getPart(partname, character);
    if (!part) {
        console.log("CharacterAnimator.animateCharacterState : Unable to locate part - " + partname);
        return;
    }
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
    this.applyAnimation(frame, box, part);
    if (part.parts) {
        for (var partpart in part.parts) {
            this.animateCharacterState(character, animation, box, partpart);
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

CharacterAnimator.prototype.applyAnimation = function(animation, box, part) {
    if (part.height && part.width) {
        if (animation.height) part.height *= animation.height / 100;
        if (animation.width) part.width *= animation.width / 100;
        if (animation.x) part.x += animation.x;
        if (animation.y) part.y += animation.y;
    }
    return part;
}

CharacterAnimator.prototype.animateCharacterBox = function(animation, box) {
    if (animation.width) {
        var aw = animation.width / 100;
        var nw = box.width * aw;
        var wd = box.width - nw;
        box.width = nw;
        box.x += wd / 2;
    }
    if (animation.height) {
        var ah = animation.height / 100;
        var nh = box.height * ah;
        var hd = box.height - nh;
        box.height = nh;
        box.y -= hd / 2;
    }
    if (animation.x)  box.x += animation.x;
    if (animation.y) box.y += animation.y;
    return box;
}