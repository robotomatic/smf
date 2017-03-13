"use strict";

function CharacterAnimationManager(name, animation) {
    this.name = "";
    this.animation = null;
    this.animationAnimator  = new CharacterAnimationManagerAnimator();
    this.animationRepeat = false;
    this.animationReset = false;
    this.currentFrame = 0;
    this.lastRender = 0;
    this.animationOver = false;
    this.running = false;
    this.prevframe = null;
    this.frame = null;
    this.lerp = null;
    this.reset(name, animation);
}

CharacterAnimationManager.prototype.reset = function(name, animation) {
    this.name = name;
    this.animation = animation;
    this.animationRepeat = animation.repeat ? animation.repeat : false;
    this.animationReset = animation.reset;
    this.currentFrame = 0;
    this.lastRender = timestamp();
    this.animationOver = false;
    this.running = false;
    this.prevframe = null;
    this.frame = null;
    this.lerp = null;
}


CharacterAnimationManager.prototype.start = function(now, indexchar) {
    this.lastRender = now;
    this.currentFrame = 0;
    this.running = true;
    this.animationOver = false;
    this.animate(indexchar, 0);
}

CharacterAnimationManager.prototype.next = function(now, indexchar) {
    if (!this.animation) return;
    var dt = (now - this.lastRender) / 1000;
    var lerp = (this.animation.duration) ? dt / this.animation.duration : 1;
    if (dt >= this.animation.duration) {
        this.currentFrame++;
        this.lastRender = now;
        lerp = 0;
    }
    if (lerp > 1) lerp = 1;
    else if (lerp < 0) lerp = 0;
    this.animate(indexchar, lerp);
}

CharacterAnimationManager.prototype.animate = function(indexchar, lerp) {
    if (!this.animation || this.animationOver) return;
    var animparts = this.animation.parts;
    var keys = Object.keys(animparts);
    for (var i = 0; i < keys.length; i++)  {
        if (keys[i] == "keys" || keys[i] == "group") continue;
        this.animateCharacterState(indexchar, keys[i], animparts[keys[i]], lerp, null);
    }
}

CharacterAnimationManager.prototype.animateCharacterState = function(indexchar, partname, animation, lerp, parent) {
    if (!indexchar || !indexchar[partname]) return;
    var part = indexchar[partname];
    if (!part) return;
    if (part.width && part.height) {
        if (!this.getNextFrame(animation, lerp)) return;
        this.animationAnimator.applyAnimation(this.prevframe, this.frame, part, this.lerp, parent);
    }
    if (part.parts) {
        var keys = part.parts.keys;
        for (var i = 0; i < keys.length; i++) {
            this.animateCharacterState(indexchar, keys[i], animation, lerp, part);
        }
    }
}

CharacterAnimationManager.prototype.getNextFrame = function(animation, lerp) {
    this.prevframe = null;
    this.frame = null;
    this.lerp = lerp;
    if (animation && animation.frames) {
        var t = animation.frames.length;
        var framenum = 0;
        if (t > 1) {
            if (this.currentFrame == 0) framenum = 0;
            else if (this.currentFrame < t) framenum = this.currentFrame;
            else {
                if (this.animationRepeat) {
                    if (this.animationReset) {
                        framenum = this.currentFrame = 0;
                    } else {
                        framenum = t - 1;
                        this.lerp = 1;
                        this.prevframe = animation.frames[framenum];
                    }
                } else {
                    this.finishAnimation();
                    return false;
                }
            }
        } else {
            if (this.currentFrame > 0 && !this.animationRepeat) {
                this.finishAnimation();
                return false;
            }
            this.lerp = 1;
        }
        this.frame = animation.frames[framenum];
        if (framenum > 0) this.prevframe = animation.frames[framenum - 1];
        else {
            if (animation.loop == "start") {
                this.prevframe = animation.frames[0];
                this.lerp = 1;
            } else this.prevframe = animation.frames[animation.frames.length - 1];
        }
    } else this.frame = animation;
    return true;
}

CharacterAnimationManager.prototype.finishAnimation = function() {
    this.animationOver = true;
    this.running = false;
}