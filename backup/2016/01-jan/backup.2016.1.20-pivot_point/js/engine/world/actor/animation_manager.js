function AnimationManager(name, animation, character) {
    this.name = name;
    this.animation = animation;
    this.animationRepeat = animation.repeat ? animation.repeat : false;
    this.currentFrame = 0;
    this.lastRender = timestamp();
    this.animationOver = false;
}

AnimationManager.prototype.start = function(now, character) {
    this.lastRender = now;
    this.currentFrame = 0;
    this.animationOver = false;
    this.animate(character, 0);
}

AnimationManager.prototype.next = function(now, character) {
    
    
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
    
    this.animate(character, lerp);
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
    
    var prevframe;
    var frame;
    if (animation && animation.frames) {
        var t = animation.frames.length;
        var framenum = 0;
        if (t > 1) {
            if (this.currentFrame < t) framenum = this.currentFrame;
            else {
                if (this.animationRepeat) framenum = this.currentFrame = 0;
                else {
                    this.animationOver = true;
                    this.animation = null;
                    return;
                }
            }
        } else {
            if (this.currentFrame > 0 && !this.animationRepeat) {
                this.animationOver = true;
                this.animation = null;
                return;
            }
            lerp = 1;
        }
        frame = animation.frames[framenum];
        
        if (framenum > 0) prevframe = animation.frames[framenum - 1];
        else {
            if (animation.loop == "start") prevframe = animation.frames[0];
            else prevframe = animation.frames[animation.frames.length - 1];
        }
        
    } else frame = animation;
    
    this.applyAnimation(prevframe, frame, part, lerp, parent);
    if (part.parts) {
        var keys = Object.keys(part.parts);
        for (var i = 0; i < keys.length; i++) {
            this.animateCharacterState(character, keys[i], animation, lerp, part);
        }
    }
}

AnimationManager.prototype.getPart = function(partname, parts) {
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = keys[i];
        if (partname == part) return parts[part];
        else if (parts[part].parts) {
            var partpart = this.getPart(partname, parts[part].parts);
            if (partpart) return partpart;
        }
    }
}

AnimationManager.prototype.applyAnimation = function(prevanimation, animation, part, t, parent) {

    if (animation && part.height && part.width) {
        

        if (animation.height || animation.height == 0) {
            var ph = prevanimation.height || 0;
            if (animation.height > ph.height) part.height = lerp(part.height, part.height * (animation.height / 100), t);
            else part.height = lerp(part.height * (ph / 100), part.height * (animation.height / 100), t);
        }
        
        if (animation.width || animation.width == 0) {
            var pw = prevanimation.width || 0;
            if (animation.width > pw.width) part.width = lerp(part.width, part.width * (animation.width / 100), t);
            else part.width = lerp(part.width * (pw / 100), part.width * (animation.width / 100), t);
        }
        
        if (animation.x || animation.x == 0) {
            var px = prevanimation.x || 0;
            if (animation.x >= px || animation.x < 0) {
                if (px < 0)  part.x = lerp(part.x + px, part.x + animation.x, t);                    
                else part.x = lerp(part.x, part.x + animation.x, t);                    
            } else {
                part.x = lerp(part.x + px, part.x - animation.x, t);                    
            }
        }
        
        if (animation.y || animation.y == 0) {
            var py = prevanimation.y || 0;
            if (animation.y >= py || animation.y < 0) {
                if (py < 0) part.y = lerp(part.y + py, part.y + animation.y, t);                    
                else part.y = lerp(part.y, part.y + animation.y, t);                    
            } else {
                part.y = lerp(part.y + py, part.y - animation.y, t);                    
            }
        }
        
        if (animation.zindex || animation.zindex === 0) {
            part.zindex = animation.zindex;
        }
        
        if (animation.pointinfo) part.pointinfo = animation.pointinfo;
 
        if (animation.angle || animation.angle == 0) {
            
            if (!parent) {
                if (!part.angle) part.angle = 0;
                var pa = prevanimation.angle || 0;
                if (animation.angle >= pa || animation.angle < 0) {
                    if (pa < 0)  part.angle = lerp(part.angle + pa, part.angle + animation.angle, t);                    
                    else part.angle = lerp(part.angle, part.angle + animation.angle, t);                    
                } else {
                    part.angle = lerp(part.angle + pa, part.angle - animation.angle, t);                    
                }
            }
        }
        
        if (animation.draw === false) part.draw = false;
        else if (animation.draw === true) part.draw = true;
    }
    return part;
}