"use strict";

function PartyViewCamera() {

    this.lastview = null;
    
    this.shake = {
        magnitude: 0,
        duration: 0,
        start: null,
        elapsed : null
    }
}

PartyViewCamera.prototype.shakeScreen = function(magnitude, duration) {
    this.shake.magnitude = magnitude;
    this.shake.duration = duration;
    this.shake.start = timestamp();
    this.shake.elapsed = 0;
}

PartyViewCamera.prototype.isShaking = function() {
    return this.shake.elapsed < this.shake.duration;
}


PartyViewCamera.prototype.getCenterPoint = function(now, p) {
    if (!this.isShaking()) return p;
    let percent = this.shake.duration / this.shake.elapsed;
    let x = Math.random() * 2 * this.shake.magnitude - this.shake.magnitude;
    let y = Math.random() * 2 * this.shake.magnitude - this.shake.magnitude;
    
    if (!isFinite(percent) || percent > 10) percent = 10;
    percent /= 10;
    
    p.x += x * percent;
    p.y += y * percent;
    this.shake.elapsed = now - this.shake.start;
    return p;
}

PartyViewCamera.prototype.getCameraBox = function(mbr, testx, amount) {
    
    if (!this.lastview) {
        this.lastview = {
            x : mbr.x,
            y: mbr.y,
            width: mbr.width,
            height: mbr.height
        }
        return mbr;
    }
        
    if (!testx) {
        this.lastview.x = mbr.x;
        this.lastview.width = mbr.width;
    }

    let threshx = .1;

    let mx = clamp(mbr.x);
    let lx = clamp(this.lastview.x);

    if (mx < lx) {
        let d = lx - mx;
        if (d >= threshx) {
            this.lastview.x = this.lastview.x - amount;
            mbr.x = this.lastview.x;
        }
    } else if (mx > lx) {
        let d = mx - lx;
        if (d >= threshx) {
            this.lastview.x = this.lastview.x + (amount * 2);
            mbr.x = this.lastview.x;
        }
    }


    let mw = clamp(mbr.width);
    let lw = clamp(this.lastview.width);

    if (mw < lw) {
        let d = lw - mw;
        if (d >= threshx) {
            this.lastview.width = this.lastview.width - amount;
            mbr.width = this.lastview.width;
        }
    } else if (mw > lw) {
        let d = mw - lw;
        if (d >= threshx) {
            this.lastview.width = this.lastview.width + (amount * 2);
            mbr.width = this.lastview.width;
        }
    }


    let threshy = .1;

    let my = clamp(mbr.y);
    let ly = clamp(this.lastview.y);

    if (my < ly) {
        let d = ly - my;
        if (d >= threshy) {
            this.lastview.y = this.lastview.y - amount;
            mbr.y = this.lastview.y;
        }
    } else if (my > ly) {
        let d = my - ly;
        if (d >= threshy) {
            this.lastview.y = this.lastview.y + (amount * 2);
            mbr.y = this.lastview.y;
        }
    }

    let mh = clamp(mbr.height);
    let lh = clamp(this.lastview.height);

    if (mh < lh) {
        let d = lh - mh;
        if (d >= threshy) {
            this.lastview.height = this.lastview.height - amount;
            mbr.height = this.lastview.height;
        }
    } else if (mh > lh) {
        let d = mh - lh;
        if (d >= threshy) {
            this.lastview.height = this.lastview.height + (amount * 2);
            mbr.height = this.lastview.height;
        }
    }
    return mbr;
}


