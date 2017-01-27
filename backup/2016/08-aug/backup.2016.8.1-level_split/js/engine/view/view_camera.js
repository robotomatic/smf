"use strict";

function ViewCamera() {
    
    this.hspeed = 1;
    this.vspeed = 1;
    
    this.shake = {
        magnitude: 0,
        duration: 0,
        start: null,
        elapsed : null
    }
    
    this.center = new Point(0, 0);
    this.lastview = null;
    
    this.box = new Rectangle(0, 0, 0, 0);
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
    
//    mbr.x = round(mbr.x);
//    mbr.y = round(mbr.y);
//    mbr.width = round(mbr.width);
//    mbr.height = round(mbr.height);
    
    return mbr;
}

ViewCamera.prototype.getCenterPoint = function(now, mbr, p) {

    p.x = mbr.x + (mbr.width / 2);
    p.y = mbr.y + (mbr.height / 2);
    
//    p.x = round(p.x);
//    p.y = round(p.y);

    if (!this.isShaking()) return p;
    
    var e = (this.shake.duration - (this.shake.elapsed / this.shake.duration)) - (this.shake.duration - 1);
    var percent = e * 10;
    var m = this.shake.magnitude * percent;
    var x = random(-m, m);
    var y = random(-m, m);

    p.x += x;
    p.y += y;
    
//    p.x = round(p.x);
//    p.y = round(p.y);
    
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
    
//    this.lastview.x = round(mbr.x);
//    this.lastview.y = round(mbr.y);
//    this.lastview.width = round(mbr.width);
//    this.lastview.height = round(mbr.height);
    
    return mbr;
}

ViewCamera.prototype.smoothCameraBox = function(mbr) {

    // todo: jank
    this.box.x = mbr.x;
    this.box.y = mbr.y;
    this.box.width = mbr.width;
    this.box.height = mbr.height;

    var d = 10;
    
    var dx = (mbr.x - this.lastview.x) / d;
    if (Math.abs(dx)) mbr.x = this.lastview.x + dx;

    var dy = (mbr.y - this.lastview.y) / d;
    if (Math.abs(dy)) mbr.y =  this.lastview.y + dy;

    var dw = (mbr.width - this.lastview.width) / d;
    if (Math.abs(dw)) mbr.width = this.lastview.width + dw;
    
    var dh = (mbr.height - this.lastview.height) / d;
    if (Math.abs(dh)) mbr.height =  this.lastview.height + dh;
    
//    mbr.x = round(mbr.x);
//    mbr.y = round(mbr.y);
//    mbr.width = round(mbr.width);
//    mbr.height = round(mbr.height);
    
    return mbr;
}