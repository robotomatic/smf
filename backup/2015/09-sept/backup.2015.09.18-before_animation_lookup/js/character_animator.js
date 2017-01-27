function CharacterAnimator(animations) {
    this.animations = animations;
    this.transforms = {};
    this.animchar = null;
    this.currentAnimation;
    this.currentAnimationFrame = 0;
    this.lastAnimationRender;
}

CharacterAnimator.prototype.animate = function(box, state, direction, character) {

    // todo: need to not modify original object parts - return a mittful of updated parts?
    //       remove need to lookup nested character parts
    
    
    //return { "box" : box, "character" : character };
    
    var animbox = Object.create(box);
    
    // well here's your problem...
    this.animchar = JSON.parse(JSON.stringify(character));
    //this.animchar = Object.create(character);
    //this.animchar = character;
    
    if (this.animations[direction]) {
        var diranim = this.animations[direction];
        box = this.animateCharacterBox(diranim, box);
        var parts = diranim.parts;
        for (var part in parts) this.animateCharacterDirection(diranim.parts[part], box, part);
    }
    
    if (this.animations[state]) {
        var stateanim = this.animations[state];
        box = this.animateCharacterBox(stateanim, box);
        
        if (!this.currentAnimation || stateanim.name != this.currentAnimation.name) {
            this.currentAnimation = stateanim;
            this.lastAnimationRender = null;
            this.currentAnimationFrame = 0;
        } else {
            var now = timestamp();
            var dt = (now - this.lastAnimationRender) / 1000;
            if (dt >= stateanim.duration) {
                this.currentAnimationFrame++;
                this.lastAnimationRender = timestamp();
            }
        }
        var parts = stateanim.parts;
        for (var part in parts) this.animateCharacterState(stateanim.parts[part], box, part);
    }

    return { "box" : animbox, "character" : this.animchar }
}

CharacterAnimator.prototype.animateCharacterDirection = function(animation, box, partname) {
    part = this.getPart(partname, this.animchar.parts);
    if (!part) {
        console.log("CharacterAnimator.animateCharacterDirection : Unable to locate part - " + partname);
        return;
    }
    var frame = (animation.frames) ? animation.frames[0] : animation;
    part = this.applyAnimation(frame, box, part);
    if (part.parts) {
        for (var partpart in part.parts) {
            this.animateCharacterDirection(animation, box, partpart);
        }
    }
}

CharacterAnimator.prototype.animateCharacterState = function(animation, box, partname) {
    part = this.getPart(partname, this.animchar.parts);
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
            else framenum = this.currentAnimationFrame = 0;
        }
        frame = animation.frames[framenum];
    } else frame = animation;
    part = this.applyAnimation(frame, box, part);
    if (part.parts) {
        for (var partpart in part.parts) {
            this.animateCharacterState(animation, box, partpart);
        }
    }
}

CharacterAnimator.prototype.getPart = function(partname, parts) {
    
    //return parts[partname];
    
    for (var part in parts) {
        if (partname == part) return parts[part];
        else if (parts[part].parts) {
            var partpart = this.getPart(partname, parts[part].parts);
            if (partpart) return partpart;
        }
    }
}

CharacterAnimator.prototype.applyAnimation = function(animation, box, part) {
    //var newpart = Object.create(part);
    var newpart = part;
    if (part.height && part.width) {
        if (animation.height) newpart.height *= animation.height / 100;
        if (animation.width) newpart.width *= animation.width / 100;
        if (animation.x) newpart.x += animation.x;
        if (animation.y) newpart.y += animation.y;
    }
    return newpart;
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
