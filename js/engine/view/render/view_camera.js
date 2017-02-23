"use strict";

function ViewCamera() {
    
    this.speed = 3;
    
    this.shake = {
        magnitude: 0,
        duration: 0,
        start: null,
        elapsed : null
    };
    
    this.drift = {
        x : 0,
        y : 0,
        z : 0,
        newx : 0,
        newy : 0,
        newz : 0,
        min : 1,
        max : 3,
        amount : 0.05,
        speed : 1,
        enabled : true
    }

    this.blur = {
        blur : false,
        shift : true,
        near : {
            min_distance : 0,
            max_distance : 100,
            amount : .25,
            shift : 2.5
        }, 
        far : {
            min_distance : 600,
            max_distance : 2000,
            amount : .5,
            shift : 1.5
        }
    }
    
    this.center = geometryfactory.getPoint(0, 0);
    this.center.z = 0;
    this.lastview = null;
    
    this.box = geometryfactory.getRectangle(0, 0, 0, 0);
    this.box.z = 0;
}

ViewCamera.prototype.shouldBlur = function(distance) {
    return ((this.blur.blur || this.blur.shift)  && (distance >= this.blur.far.min_distance || distance <= this.blur.near.min_distance));
}

ViewCamera.prototype.getBlurAmount = function(distance) {
    if (distance >= this.blur.far.max_distance) return this.blur.far.amount;
    if (distance <= -this.blur.near.max_distance) return this.blur.near.amount;
    if (distance > -this.blur.near.min_distance) return 1;
    if (distance < -this.blur.near.min_distance) return this.getBlurAmountByDistance(MATH_ABS(distance), this.blur.near);
    else return this.getBlurAmountByDistance(distance, this.blur.far);
}

ViewCamera.prototype.getBlurAmountByDistance = function(distance, blur) {
    var maxd = blur.max_distance - blur.min_distance;
    var d = distance - blur.min_distance;
    var p = d / maxd;
    var ap = blur.amount * p;
    var dd = 1 - blur.amount;
    var out = dd * ap;
    return 1 - out;
}


ViewCamera.prototype.getBlurShiftAmount = function(distance) {
    if (distance >= this.blur.far.max_distance) return this.blur.far.shift;
    if (distance <= -this.blur.near.max_distance) return this.blur.near.shift;
    if (distance > -this.blur.near.min_distance) return 1;
    if (distance < -this.blur.near.min_distance) return this.getBlurShiftByDistance(MATH_ABS(distance), this.blur.near);
    else return this.getBlurShiftByDistance(distance, this.blur.far);
}

ViewCamera.prototype.getBlurShiftByDistance = function(distance, blur) {
    var maxd = blur.max_distance - blur.min_distance;
    var d = distance - blur.min_distance;
    var p = d / maxd;
    var ap = blur.shift * p;
    return ap;
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
    mbr = this.getCenterPoint(now, mbr);
    return mbr;
}

ViewCamera.prototype.getCenterPoint = function(now, mbr) {
    
    this.center.x = mbr.x + (mbr.width / 2);
    this.center.y = mbr.y + (mbr.height / 2);
    this.center.z = mbr.z;
    
    this.getCenterPointDrift(now);
    this.getCenterPointShake(now);
    
    mbr.x = this.center.x - (mbr.width / 2);
    mbr.y = this.center.y - (mbr.height / 2);
    mbr.z = this.center.z;
    
    return mbr;
}

ViewCamera.prototype.getCenterPointDrift = function(now) {
    if (!this.drift.enabled) return;
    
    if ((this.drift.newx > 0 && this.drift.x >= this.drift.newx) || (this.drift.newx <= 0 && this.drift.x <= this.drift.newx)) {
        this.drift.newx = random(this.drift.min, this.drift.max);
        if (this.drift.x > 0) this.drift.newx = -this.drift.newx;
    }
    this.drift.x = (this.drift.newx < 0) ? this.drift.x - this.drift.amount : this.drift.x + this.drift.amount;
    this.center.x += this.drift.speed * this.drift.x; 
    
    if ((this.drift.newy > 0 && this.drift.y >= this.drift.newy) || (this.drift.newy <= 0 && this.drift.y <= this.drift.newy)) {
        this.drift.newy = random(this.drift.min, this.drift.max);
        if (this.drift.y > 0) this.drift.newy = -this.drift.newy;
    }
    this.drift.y = (this.drift.newy < 0) ? this.drift.y - this.drift.amount : this.drift.y + this.drift.amount;
    this.center.y += this.drift.speed * this.drift.y; 

    if ((this.drift.newz > 0 && this.drift.z >= this.drift.newz) || (this.drift.newz <= 0 && this.drift.z <= this.drift.newz)) {
        this.drift.newz = random(this.drift.min, this.drift.max);
        if (this.drift.z > 0) this.drift.newz = -this.drift.newz;
    }
    this.drift.z = (this.drift.newz < 0) ? this.drift.z - this.drift.amount : this.drift.z + this.drift.amount;
    this.center.z += this.drift.speed * this.drift.z; 
}

ViewCamera.prototype.getCenterPointShake = function(now) {
    if (!this.isShaking()) return;
    var e = (this.shake.duration - (this.shake.elapsed / this.shake.duration)) - (this.shake.duration - 1);
    var percent = e * 10;
    var m = this.shake.magnitude * percent;
    var x = random(-m, m);
    var y = random(-m, m);
    var z = random(-m, m);
    this.center.x += x;
    this.center.y += y;
    this.center.z += z;
    this.shake.elapsed = now - this.shake.start;
}


ViewCamera.prototype.scaleMbr = function(mbr, width, height) {

   var scale = width / mbr.width;
    var svh = height / scale;
    if (svh < mbr.height) {
        var d = mbr.height / svh;
        mbr.y += svh / 2;
        mbr.height = svh;
        var dw = mbr.width * d;
        mbr.x = mbr.x + (mbr.width - dw) / 2;
        mbr.width = dw;
    }
    
    mbr.scale = width / mbr.width;
    return mbr;    
}



ViewCamera.prototype.getCameraBox = function(mbr) {

    if (!this.lastview) {
        this.lastview = {
            x : mbr.x,
            y : mbr.y,
            z : mbr.z,
            width: mbr.width,
            height: mbr.height
        }
    }
    
    mbr = this.smoothCameraBox(mbr);
    
    this.lastview.x = mbr.x;
    this.lastview.y = mbr.y;
    this.lastview.z = mbr.z;
    this.lastview.width = mbr.width;
    this.lastview.height = mbr.height;
    
    return mbr;
}

ViewCamera.prototype.smoothCameraBox = function(mbr) {

    this.box.x = mbr.x;
    this.box.y = mbr.y;
    this.box.z = mbr.z;
    this.box.width = mbr.width;
    this.box.height = mbr.height;

    var d = this.speed;
    
    var dx = (mbr.x - this.lastview.x) / d;
    if (MATH_ABS(dx)) mbr.x = this.lastview.x + dx;

    var dy = (mbr.y - this.lastview.y) / d;
    if (MATH_ABS(dy)) mbr.y =  this.lastview.y + dy;

    var dz = (mbr.z - this.lastview.z) / d;
    if (MATH_ABS(dz)) mbr.z =  this.lastview.z + dz;

    var dw = (mbr.width - this.lastview.width) / d;
    if (MATH_ABS(dw)) mbr.width = this.lastview.width + dw;
    
    var dh = (mbr.height - this.lastview.height) / d;
    if (MATH_ABS(dh)) mbr.height =  this.lastview.height + dh;
    
    return mbr;
}