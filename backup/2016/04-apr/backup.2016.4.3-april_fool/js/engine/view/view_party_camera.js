"use strict";

function PartyViewCamera() {
    
    this.speed = .1;
    
    this.viewpad = 50;
    this.playerpad = 120;
    
    this.shake = {
        magnitude: 0,
        duration: 0,
        start: null,
        elapsed : null
    }

    this.lastview = null;
    this.mbr = null;
    
    this.ox = 0;
    this.oy = 0;
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
    var percent = this.shake.duration / this.shake.elapsed;
    var x = Math.random() * 2 * this.shake.magnitude - this.shake.magnitude;
    var y = Math.random() * 2 * this.shake.magnitude - this.shake.magnitude;
    if (!isFinite(percent) || percent > 10) percent = 10;
    percent /= 10;
    p.x += x * percent;
    p.y += y * percent;
    this.shake.elapsed = now - this.shake.start;
    
    p.x = round(p.x);
    p.y = round(p.y);
    
    return p;
}

PartyViewCamera.prototype.getMbr = function(stage) {

    var players = stage.players.players;
    
    this.mbr = getMbr(players, 0, this.mbr);
    
    var pad = 0;
    if (players.length == 1) {
        
        
        // todo: only zoom in if stationary for a while
        
//        var p = players[0];
//        var max = p.speed;
//        var s = Math.abs(p.velX);
//        
//        var d = 100 / (max / s);
//        
//        var spad = d / 5;
//        
//        
//        pad = this.playerpad + spad;
        pad = this.playerpad;
    } else {
        
        
        var t = players.length;
        
        
        // what do I want to do here? 
        
        pad = this.viewpad;
    }
    
    this.mbr.pad(pad, pad);
    
    this.mbr = this.getCameraBox(this.mbr);
    
    this.mbr.x = round(this.mbr.x);
    this.mbr.y = round(this.mbr.y);
    this.mbr.width = round(this.mbr.width);
    this.mbr.height = round(this.mbr.height);
    
    return this.mbr;
}
    
PartyViewCamera.prototype.getCameraBox = function(mbr) {
    if (!this.lastview) {
        this.lastview = {
            x : mbr.x,
            y: mbr.y,
            width: mbr.width,
            height: mbr.height
        }
        return mbr;
    }
    
    var mx = mbr.x;
    var my = mbr.y;
    
    mbr = this.getCameraBoxHorizontal(mbr);
    mbr = this.getCameraBoxVertical(mbr);
    
    this.ox = mbr.x - mx;
    this.oy = mbr.y - my;
    
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
            this.lastview.x = this.lastview.x - amount;
            mbr.x = this.lastview.x;
        }
    } else if (mx > lx) {
        var d = mx - lx;
        var amount = d * this.speed;
        if (d >= threshx) {
            this.lastview.x = this.lastview.x + amount;
            mbr.x = this.lastview.x;
        }
    }
    var mw = mbr.width;
    var lw = this.lastview.width;
    if (mw < lw) {
        var d = lw - mw;
        var amount = d * (this.speed / 2);
        if (d >= threshx) {
            this.lastview.width = this.lastview.width - amount;
            mbr.width = this.lastview.width;
        }
    } else if (mw > lw) {
        var d = mw - lw;
        var amount = d * this.speed;
        if (d >= threshx) {
            this.lastview.width = this.lastview.width + amount;
            mbr.width = this.lastview.width;
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
            this.lastview.y = this.lastview.y - amount;
            mbr.y = this.lastview.y;
        }
    } else if (my > ly) {
        var d = my - ly;
        var amount = d * this.speed;
        if (d >= threshy) {
            this.lastview.y = this.lastview.y + (amount * 2);
            mbr.y = this.lastview.y;
        }
    }
    var mh = mbr.height;
    var lh = this.lastview.height;
    if (mh < lh) {
        var d = lh - mh;
        var amount = d * (this.speed / 2);
        if (d >= threshy) {
            this.lastview.height = this.lastview.height - amount;
            mbr.height = this.lastview.height;
        }
    } else if (mh > lh) {
        var d = mh - lh;
        var amount = d * this.speed;
        if (d >= threshy) {
            this.lastview.height = this.lastview.height + (amount * 2);
            mbr.height = this.lastview.height;
        }
    }
    return mbr;
}

