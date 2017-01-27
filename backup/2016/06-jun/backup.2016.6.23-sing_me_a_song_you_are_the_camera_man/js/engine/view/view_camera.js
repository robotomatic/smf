"use strict";

function ViewCamera() {
    
    this.hspeed = .1;
    this.vspeed = .1;
    
    this.shake = {
        magnitude: 0,
        duration: 0,
        start: null,
        elapsed : null
    }
    this.center = new Point(0, 0);
    this.lastview = null;
}

ViewCamera.prototype.shakeScreen = function(magnitude, duration) {
    this.shake.magnitude = magnitude;
    this.shake.duration = duration;
    this.shake.start = timestamp();
    this.shake.elapsed = 0;
}

ViewCamera.prototype.isShaking = function() {
    return this.shake.elapsed < this.shake.duration;
}

ViewCamera.prototype.getView = function(now, mbr, width, height) {
    
    mbr = this.scaleMbr(mbr, width, height);
    
    mbr = this.getCameraBox(mbr);
    
    this.center = this.getCenterPoint(now, mbr, this.center);
    
    mbr.x = this.center.x - (mbr.width / 2);
    mbr.y = this.center.y - (mbr.height / 2);
    
    mbr.x = round(mbr.x);
    mbr.y = round(mbr.y);
    mbr.width = round(mbr.width);
    mbr.height = round(mbr.height);
    
    return mbr;
}

ViewCamera.prototype.getCenterPoint = function(now, mbr, p) {

    p.x = mbr.x + (mbr.width / 2);
    p.y = mbr.y + (mbr.height / 2);
    
    p.x = round(p.x);
    p.y = round(p.y);

    if (!this.isShaking()) return p;
    
    var e = (this.shake.duration - (this.shake.elapsed / this.shake.duration)) - (this.shake.duration - 1);
    var percent = e * 10;
    var m = this.shake.magnitude * percent;
    var x = random(-m, m);
    var y = random(-m, m);

    p.x += x;
    p.y += y;
    
    p.x = round(p.x);
    p.y = round(p.y);
    
    this.shake.elapsed = now - this.shake.start;
    return p;
}

ViewCamera.prototype.scaleMbr = function(mbr, width, height) {
    var scale = width / mbr.width;
    var svh = height / scale;
    if (svh < mbr.height) {
        var d = mbr.height / svh;
        mbr.y = mbr.y + (mbr.height - svh) / 2;
        mbr.height = svh;
        var dw = mbr.width * d;
        mbr.x = mbr.x + (mbr.width - dw) / 2;
        mbr.width = dw;
    }
    return mbr;
}
    
ViewCamera.prototype.getCameraBox = function(mbr) {

    if (!this.lastview) {
        this.lastview = {
            x : mbr.x,
            y: mbr.y,
            width: mbr.width,
            height: mbr.height
        }
    }
    
    mbr = this.smoothCameraBox(mbr);
    
    this.lastview.x = mbr.x;
    this.lastview.y = mbr.y;
    this.lastview.width = mbr.width;
    this.lastview.height = mbr.height;
    
    return mbr;
}

ViewCamera.prototype.smoothCameraBox = function(mbr) {

    var d = 10;
    var threshold = 0;
    
    var dx = round((mbr.x - this.lastview.x) / d);
    mbr.x = Math.abs(dx) < threshold ? this.lastview.x : this.lastview.x + dx;
    
    var dy = round((mbr.y - this.lastview.y) / d);
    mbr.y = Math.abs(dy) < threshold ? this.lastview.y : this.lastview.y + dy;

    var dw = round((mbr.width - this.lastview.width) / d);
    mbr.width = Math.abs(dw) < threshold ? this.lastview.width : this.lastview.width + dw;
    
    var dh =  round((mbr.height - this.lastview.height) / d);
    mbr.height = Math.abs(dh) < threshold ? this.lastview.height : this.lastview.height + dh;
    
//    mbr.x = round(mbr.x);
//    mbr.y = round(mbr.y);
//    mbr.width = round(mbr.width);
//    mbr.height = round(mbr.height);
    
    return mbr;
}