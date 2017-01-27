"use strict";

function CharacterAnimationManager(name, animation) {
    this.name = name;
    this.animation = animation;
    this.animationRepeat = animation.repeat ? animation.repeat : false;
    this.animationReset = animation.reset;
    this.currentFrame = 0;
    this.lastRender = timestamp();
    this.animationOver = false;
    this.partCache = new Array();
    this.prevframe = null;
    this.frame = null;
    this.lerp = null;
}

CharacterAnimationManager.prototype.start = function(now, character, puppet, indexchar) {
    this.lastRender = now;
    this.currentFrame = 0;
    this.animationOver = false;
    this.partCache.length = 0;
    this.animate(puppet, indexchar, 0);
}

CharacterAnimationManager.prototype.next = function(now, character, puppet, indexchar) {
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
    this.animate(puppet, indexchar, lerp);
}

CharacterAnimationManager.prototype.animate = function(character, indexchar, lerp) {
    if (!this.animation || this.animationOver) return;
    var parts = this.animation.parts;
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++)  {
        if (keys[i] == "keys" || keys[i] == "group") continue;
        this.animateCharacterState(character, indexchar, keys[i], parts[keys[i]], lerp, null);
    }
}

CharacterAnimationManager.prototype.animateCharacterState = function(character, indexchar, partname, animation, lerp, parent) {
    if (!indexchar || !indexchar[partname]) return;
    var part = indexchar[partname];
    if (!part) return;
    if (part.width && part.height) {
        if (!this.getNextFrame(animation, lerp)) return;
        this.applyAnimation(this.prevframe, this.frame, part, this.lerp, parent);
    }
    if (part.parts) {
        var keys = part.parts.keys;
        for (var i = 0; i < keys.length; i++) {
            this.animateCharacterState(character, indexchar, keys[i], animation, lerp, part);
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
    this.animation = null;
}

CharacterAnimationManager.prototype.applyAnimation = function(prevanimation, animation, part, t, parent) {
    if (!animation || !part.height || !part.width) return;
    part = this.applyAnimationSize(prevanimation, animation, part, t);
    part = this.applyAnimationPosition(prevanimation, animation, part, t);
    if ((animation.angle || animation.angle == 0) && !parent) part = this.applyAnimationAngle(prevanimation, animation, part, t);
    if (animation.zindex || animation.zindex === 0) part.zindex = animation.zindex;
    if (animation.pointinfo) part.pointinfo = animation.pointinfo;
    if (animation.color) part.color = fadeToColor(part.color, animation.color, t);
    if (animation.draw === false) part.draw = false;
    else if (animation.draw === true) part.draw = true;
    return part;
}

CharacterAnimationManager.prototype.applyAnimationSize = function(prevanimation, animation, part, t) {
    if (animation.height || animation.height == 0) {
        var ph = prevanimation ? (prevanimation.height || 0) : 0;
        var partheight = part.height;
        var nh;
        if (animation.height > ph.height) nh = lerp(partheight, partheight * (animation.height / 100), t);
        else nh = lerp(partheight * (ph / 100), partheight * (animation.height / 100), t);
        part.height = nh;
    }
    if (animation.width || animation.width == 0) {
        var pw = prevanimation ? (prevanimation.width || 0) : 0;
        var partwidth = part.width;
        var nw;
        if (animation.width > pw.width) nw = lerp(partwidth, partwidth * (animation.width / 100), t);
        else nw = lerp(partwidth * (pw / 100), partwidth * (animation.width / 100), t);
        part.width = nw;
    }
    return part;
}

CharacterAnimationManager.prototype.applyAnimationPosition = function(prevanimation, animation, part, t) {
    if (animation.x || animation.x == 0) {
        var px = prevanimation ? (prevanimation.x || 0) : 0;
        var partx = part.x;
        var nx;
        if (animation.x >= px || animation.x < 0) {
            if (px < 0)  nx = lerp(partx + px, partx + animation.x, t);                    
            else if (animation.x == px) nx = lerp(partx + px, partx + animation.x, t);                    
            else nx = lerp(partx, partx + animation.x, t);                    
        } else {
            nx = lerp(partx + px, partx - animation.x, t);                    
        }
        part.x = nx;
    }
    if (animation.y || animation.y == 0) {
        var py = prevanimation ? (prevanimation.y || 0) : 0;
        var party = part.y;
        var ny;
        if (animation.y >= py || animation.y < 0) {
            if (py < 0) ny = lerp(party + py, party + animation.y, t);                    
            else if (animation.y == py) ny = lerp(party + py, party + animation.y, t);                    
            else ny = lerp(party, party + animation.y, t);                    
        } else {
            ny = lerp(party + py, party - animation.y, t);                    
        }
        part.y = ny;
    }
    return part;
}

CharacterAnimationManager.prototype.applyAnimationAngle = function(prevanimation, animation, part, t) {
    var partangle = part.angle;
    if (!partangle) partangle = 0;
    var pa = prevanimation ? (prevanimation.angle || 0) : 0;
    var na;
    if (animation.angle >= pa || animation.angle < 0) {
        if (pa < 0)  na = lerp(partangle + pa, partangle + animation.angle, t);                    
        else if (partangle == 0) na = lerp(pa, animation.angle, t);                    
        else na = lerp(partangle, partangle + animation.angle, t);                    
    } else {
        if (partangle == 0) na = lerp(pa, animation.angle, t);                    
        else na = lerp(partangle + pa, partangle - animation.angle, t);                    
    }
    part.angle = na;
    return part;
}