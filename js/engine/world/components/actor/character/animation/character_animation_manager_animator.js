"use strict";

function CharacterAnimationManagerAnimator() { }

CharacterAnimationManagerAnimator.prototype.applyAnimation = function(prevanimation, animation, part, t, parent) {
    
    
    if (!animation || !part.height || !part.width) return;
    
    
    this.applyAnimationPosition(prevanimation, animation, part, t);
    this.applyAnimationSize(prevanimation, animation, part, t);
    if ((animation.angle || animation.angle == 0) && !parent) part = this.applyAnimationAngle(prevanimation, animation, part, t);
    
    if (animation.zindex || animation.zindex === 0) part.zindex = animation.zindex;
    if (animation.outline || animation.outline === false) {
        part.outline = animation.outline;
    }
    if (animation.pointinfo) part.pointinfo = animation.pointinfo;
    if (animation.color) part.color = fadeToColor(part.color, animation.color, t);
    if (animation.draw === false) part.draw = false;
    else if (animation.draw === true) part.draw = true;
}

CharacterAnimationManagerAnimator.prototype.applyAnimationPosition = function(prevanimation, animation, part, t) {
    if (!animation || !part.height || !part.width) return;
    if (animation.x || animation.x == 0) {
        if (animation.lerp === false) {
            part.x += animation.x;
        } else {
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
            part.x = round(nx);
        }
    }
    if (animation.y || animation.y == 0) {
        if (animation.lerp === false) {
            part.y += animation.y;
        } else {
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
            part.y = round(ny);
        }
    }
    return part;
}

CharacterAnimationManagerAnimator.prototype.applyAnimationSize = function(prevanimation, animation, part, t) {
    if (!animation || !part.height || !part.width) return;
    if (animation.height || animation.height == 0) {
        var ph = prevanimation ? (prevanimation.height || 0) : 0;
        var partheight = part.height;
        var nh;
        if (animation.height > ph) nh = lerp(partheight, partheight * (animation.height / 100), t);
        else nh = lerp(partheight * (ph / 100), partheight * (animation.height / 100), t);
        part.height = round(nh);
    }
    if (animation.width || animation.width == 0) {
        var pw = prevanimation ? (prevanimation.width || 0) : 0;
        var partwidth = part.width;
        var nw;
        if (animation.width > pw) nw = lerp(partwidth, partwidth * (animation.width / 100), t);
        else nw = lerp(partwidth * (pw / 100), partwidth * (animation.width / 100), t);
        part.width = round(nw);
    }
    return part;
}

CharacterAnimationManagerAnimator.prototype.applyAnimationAngle = function(prevanimation, animation, part, t, trans) {
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
    part.angle = round(na);
    return part;
}