AnimationManager = function(name, animation, character) {
    this.name = name;
    this.animation = animation;
    this.animationRepeat = animation.repeat;
    this.currentFrame = 0;
    this.lastRender = timestamp();
    this.animationOver = false;
}

AnimationManager.prototype.start = function(character) {
    this.lastRender = timestamp();
    this.currentFrame = 0;
    this.animationOver = false;
    this.animate(character);
}

AnimationManager.prototype.next = function(character) {
    if (!this.animation) return;
    var now = timestamp();
    var dt = (now - this.lastRender) / 1000;
    if (dt >= this.animation.duration) {
        this.currentFrame++;
        this.lastRender = timestamp();
    }
    this.animate(character);
}

AnimationManager.prototype.animate = function(character) {
    if (!this.animation || this.animationOver) return;
    var parts = this.animation.parts;
    for (var part in parts) this.animateCharacterState(character, part, parts[part]);
}

AnimationManager.prototype.animateCharacterState = function(character, partname, animation) {
    part = this.getPart(partname, character);
    if (!part) return;
    var frame;
    if (animation.frames) {
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
        }
        frame = animation.frames[framenum];
    } else frame = animation;
    this.applyAnimation(frame, part);
    if (part.parts) {
        for (var partpart in part.parts) {
            this.animateCharacterState(character, partpart, animation);
        }
    }
}

AnimationManager.prototype.getPart = function(partname, parts) {
    for (var part in parts) {
        if (partname == part) return parts[part];
        else if (parts[part].parts) {
            var partpart = this.getPart(partname, parts[part].parts);
            if (partpart) return partpart;
        }
    }
}

AnimationManager.prototype.applyAnimation = function(animation, part) {
    if (part.height && part.width) {
        if (animation.height) part.height *= animation.height / 100;
        if (animation.width) part.width *= animation.width / 100;
        if (animation.x) part.x += animation.x;
        if (animation.y) part.y += animation.y;
    }
    return part;
}