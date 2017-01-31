function AnimationManager(name, animation, character) {
    this.name = name;
    this.animation = animation;
    this.animationRepeat = animation.repeat ? animation.repeat : false;
    this.animationReset = animation.reset;
    this.currentFrame = 0;
    this.lastRender = timestamp();
    this.animationOver = false;
    this.partCache = new Array();
}

AnimationManager.prototype.start = function(now, character, puppet) {
    this.lastRender = now;
    this.currentFrame = 0;
    this.animationOver = false;
    this.partCache.length = 0;
    this.animate(puppet, 0);
}

AnimationManager.prototype.next = function(now, character, puppet) {
    if (!this.animation) return;
    var lerp = 0;
    var dt = (now - this.lastRender) / 1000;
    var lerp = (this.animation.duration) ? dt / this.animation.duration : 1;
    if (dt >= this.animation.duration) {
        this.currentFrame++;
        this.lastRender = now;
        lerp = 0;
    }
    if (lerp > 1) lerp = 1;
    else if (lerp < 0) lerp = 0;
    this.animate(puppet, lerp);
}

AnimationManager.prototype.animate = function(character, lerp) {
    if (!this.animation || this.animationOver) return;
    var parts = this.animation.parts;
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) this.animateCharacterState(character, keys[i], parts[keys[i]], lerp, null);
}

AnimationManager.prototype.animateCharacterState = function(character, partname, animation, lerp, parent) {
    part = this.getPart(partname, character);
    if (!part) return;
    var f = this.getNextFrame(animation, lerp);
    if (!f) return;
    this.applyAnimation(f.prevframe, f.frame, part, f.lerp, parent);
    if (part.parts) {
        var keys = Object.keys(part.parts);
        for (var i = 0; i < keys.length; i++) {
            this.animateCharacterState(character, keys[i], animation, f.lerp, part);
        }
    }
}

AnimationManager.prototype.getNextFrame = function(animation, lerp) {
    var prevframe;
    var frame;
    if (animation && animation.frames) {
        var t = animation.frames.length;
        var framenum = 0;
        if (t > 1) {
            if (this.currentFrame == 0) framenum = 0;
            else if (this.currentFrame < t) framenum = this.currentFrame;
            else {
                if (this.animationRepeat) {
                    if (this.animationReset) framenum = this.currentFrame = 0;
                    else {
                        framenum = t - 1;
                        lerp = 1;
                        prevframe = animation.frames[framenum];

                    }
                } else {
                    this.animationOver = true;
                    this.animation = null;
                    return false;
                }
            }
        } else {
            if (this.currentFrame > 0 && !this.animationRepeat) {
                this.animationOver = true;
                this.animation = null;
                return false;
            }
            lerp = 1;
        }
        frame = animation.frames[framenum];
        if (framenum > 0) prevframe = animation.frames[framenum - 1];
        else {
            if (animation.loop == "start") {
                prevframe = animation.frames[0];
                lerp = 1;
            } else prevframe = animation.frames[animation.frames.length - 1];
        }
    } else frame = animation;
    return { prevframe : prevframe, frame : frame, lerp : lerp };
}
    
AnimationManager.prototype.getPart = function(partname, parts) {

    
//    if (this.partCache[partname]) return this.partCache[partname];
    
    // todo: cache this shit somewhere, somehow...
    
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = keys[i];
        if (partname == part) {
            this.partCache[partname] = parts[part];
            return parts[part];
        }
        else if (parts[part].parts) {
            var partpart = this.getPart(partname, parts[part].parts);
            if (partpart) {
                this.partCache[partname] = partpart;
                return partpart;
            }
        }
    }
}





AnimationManager.prototype.applyAnimation = function(prevanimation, animation, part, t, parent) {
    if (!animation || !part.height || !part.width) return;
    part = this.applyAnimationSize(prevanimation, animation, part, t);
    part = this.applyAnimationPosition(prevanimation, animation, part, t);
    if ((animation.angle || animation.angle == 0) && !parent) part = this.applyAnimationAngle(prevanimation, animation, part, t);
    if (animation.zindex || animation.zindex === 0) part.zindex = animation.zindex;
    if (animation.pointinfo) part.pointinfo = animation.pointinfo;
    if (animation.color && !part.color) part.color = animation.color;
    if (animation.draw === false) part.draw = false;
    else if (animation.draw === true) part.draw = true;
    return part;
}

AnimationManager.prototype.applyAnimationSize = function(prevanimation, animation, part, t) {
    if (animation.height || animation.height == 0) {
        var ph = prevanimation ? (prevanimation.height || 0) : 0;
        if (animation.height > ph.height) part.height = lerp(part.height, part.height * (animation.height / 100), t);
        else part.height = lerp(part.height * (ph / 100), part.height * (animation.height / 100), t);
    }
    if (animation.width || animation.width == 0) {
        var pw = prevanimation ? (prevanimation.width || 0) : 0;
        if (animation.width > pw.width) part.width = lerp(part.width, part.width * (animation.width / 100), t);
        else part.width = lerp(part.width * (pw / 100), part.width * (animation.width / 100), t);
    }
    return part;
}

AnimationManager.prototype.applyAnimationPosition = function(prevanimation, animation, part, t) {
    if (animation.x || animation.x == 0) {
        var px = prevanimation ? (prevanimation.x || 0) : 0;
        if (animation.x >= px || animation.x < 0) {
            if (px < 0)  part.x = lerp(part.x + px, part.x + animation.x, t);                    
            else part.x = lerp(part.x, part.x + animation.x, t);                    
        } else {
            part.x = lerp(part.x + px, part.x - animation.x, t);                    
        }
    }
    if (animation.y || animation.y == 0) {
        var py = prevanimation ? (prevanimation.y || 0) : 0;
        if (animation.y >= py || animation.y < 0) {
            if (py < 0) part.y = lerp(part.y + py, part.y + animation.y, t);                    
            else part.y = lerp(part.y, part.y + animation.y, t);                    
        } else {
            part.y = lerp(part.y + py, part.y - animation.y, t);                    
        }
    }
    return part;
}

AnimationManager.prototype.applyAnimationAngle = function(prevanimation, animation, part, t) {
    var na;
    if (!part.angle) part.angle = 0;
    var pa = prevanimation ? (prevanimation.angle || 0) : 0;
    if (animation.angle >= pa || animation.angle < 0) {
        if (pa < 0)  na = lerp(part.angle + pa, part.angle + animation.angle, t);                    
        else if (part.angle == 0) na = lerp(pa, animation.angle, t);                    
        else na = lerp(part.angle, part.angle + animation.angle, t);                    

    } else {
        if (part.angle == 0) na = lerp(pa, animation.angle, t);                    
        else na = lerp(part.angle + pa, part.angle - animation.angle, t);                    
    }
    part.angle = na;
    return part;
}