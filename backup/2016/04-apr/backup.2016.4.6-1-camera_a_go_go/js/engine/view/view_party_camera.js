"use strict";

function PartyViewCamera() {
    this.speed = .2;
    this.shake = {
        magnitude: 0,
        duration: 0,
        start: null,
        elapsed : null
    }
    this.lastview = null;
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

PartyViewCamera.prototype.getCenterPoint = function(now, mbr, p) {
    p.x = round(mbr.x + (mbr.width / 2));
    p.y = round(mbr.y + (mbr.height / 2));
    if (!this.isShaking()) return p;
    var percent = this.shake.duration / this.shake.elapsed;
    if (!isFinite(percent)) percent = 1;
    percent /= 10;
    var m = this.shake.magnitude;
    var x = random(-m, m);
    var y = random(-m, m);
    p.x += x * percent;
    p.y += y * percent;
    this.shake.elapsed = now - this.shake.start;
    p.x = round(p.x);
    p.y = round(p.y);
    return p;
}

PartyViewCamera.prototype.getView = function(mbr, width, height) {
    mbr = this.scaleMbr(mbr, width, height);
    mbr = this.getCameraBox(mbr);
    return mbr;
}
    
PartyViewCamera.prototype.scaleMbr = function(mbr, width, height) {
    var scale = round(width / mbr.width);
    var svh = round(height / scale);
    if (svh < mbr.height) {
        var d = mbr.height / svh;
        mbr.y = round(mbr.y + (mbr.height - svh) / 2);
        mbr.height = svh;
        var dw = round(mbr.width * d);
        mbr.x = round(mbr.x + (mbr.width - dw) / 2);
        mbr.width = dw;
    }
    return mbr;
}
    
PartyViewCamera.prototype.getCameraBox = function(mbr) {
    mbr.x = round(mbr.x);
    mbr.y = round(mbr.y);
    mbr.width = round(mbr.width);
    mbr.height = round(mbr.height);
    if (!this.lastview) {
        this.lastview = {
            x : mbr.x,
            y: mbr.y,
            width: mbr.width,
            height: mbr.height
        }
        return mbr;
    }
    mbr = this.getCameraBoxHorizontal(mbr);
    mbr = this.getCameraBoxVertical(mbr);
    return mbr;
}

PartyViewCamera.prototype.getCameraBoxHorizontal = function(mbr) {
    var threshx = 0;
    var mx = mbr.x;
    var lx = this.lastview.x;
    if (mx < lx) {
        var d = lx - mx;
        var amount = d * this.speed;
        if (d >= threshx) {
            mbr.x = this.lastview.x - amount;
            this.lastview.x = mbr.x;
        }
    } else if (mx > lx) {
        var d = mx - lx;
        var amount = d * this.speed;
        if (d >= threshx) {
            mbr.x = this.lastview.x + amount;
            this.lastview.x = mbr.x;
        }
    }
    var mw = mbr.width;
    var lw = this.lastview.width;
    if (mw < lw) {
        var d = lw - mw;
        var amount = d * this.speed;
        if (d >= threshx) {
            mbr.width = this.lastview.width - amount;
            this.lastview.width = mbr.width;
        }
    } else if (mw > lw) {
        var d = mw - lw;
        var amount = d * this.speed;
        if (d >= threshx) {
            mbr.width = this.lastview.width + amount;
            this.lastview.width = mbr.width;
        }
    }
    return mbr;
}

PartyViewCamera.prototype.getCameraBoxVertical = function(mbr) {
    var threshy = 0;
    var my = mbr.y;
    var ly = this.lastview.y;
    if (my < ly) {
        var d = ly - my;
        var amount = d * this.speed;
        if (d >= threshy) {
            mbr.y = this.lastview.y - amount;
            this.lastview.y = mbr.y;
        }
    } else if (my > ly) {
        var d = my - ly;
        var amount = d * this.speed;
        if (d >= threshy) {
            mbr.y = this.lastview.y + amount;
            this.lastview.y = mbr.y;
        }
    }
    var mh = mbr.height;
    var lh = this.lastview.height;
    if (mh < lh) {
        var d = lh - mh;
        var amount = d * this.speed;
        if (d >= threshy) {
            mbr.height = this.lastview.height - amount;
            this.lastview.height = mbr.height;
        }
    } else if (mh > lh) {
        var d = mh - lh;
        var amount = d * this.speed;
        if (d >= threshy) {
            mbr.height = this.lastview.height + amount;
            this.lastview.height = mbr.height;
        }
    }
    return mbr;
}

