"use strict";

function ViewCamera() {

    this.speed = 5;
    this.originalspeed = this.speed;
    
    this.offset = {
        x : 0,
        y : 0,
        z : 0
    };

    this.lastview = {
        x : 0,
        y : 0,
        z : 0,
        width: 0,
        height: 0,
        depth: 0
    };
    
    
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
        max : 2,
        amount : 0.05,
        speed : 1,
        enabled : true
    };

    this.blur = {
        blur : true,
        near : {
            amount : -1
        }, 
        far : {
            min_distance : 2000,
            max_distance : 10000,
            amount : 10
        }, 
        mega : {
            min_distance : 20000,
            amount : 100
        }
    };
    
    this.fit = false;
    
    this.center = geometryfactory.getPoint(0, 0, 0);
    
}

ViewCamera.prototype.setSpeed = function(speed) {
    this.speed = Number(speed);
    this.originalspeed = this.speed;
}

ViewCamera.prototype.shouldBlur = function(distance) {
    return distance >= this.blur.far.min_distance;
}

ViewCamera.prototype.getBlurAmount = function(distance) {
    if (distance < 10) return this.blur.near.amount;
    if (!this.shouldBlur(distance)) return 0;
    if (distance >= this.blur.mega.min_distance) return this.blur.mega.amount;
    if (distance >= this.blur.far.max_distance) return this.blur.far.amount;
    return this.getBlurAmountByDistance(distance, this.blur.far);
}

ViewCamera.prototype.getBlurAmountByDistance = function(distance, blur) {
    var maxd = blur.max_distance - blur.min_distance;
    var d = distance - blur.min_distance;
    var p = d / maxd;
    var ap = blur.amount * p;
    var dd = 1 - blur.amount;
    var out = dd * ap;
    return floor(1 - out);
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

ViewCamera.prototype.getView = function(now, mbr, width, height, follow, paused) {
    
    if (!follow) {
        if (this.speed != 1) this.originalspeed = this.speed;
        this.speed = 1;
    } else {
        this.speed = this.originalspeed;
    }

    mbr = this.applyOffset(mbr);
    
    mbr = this.scaleMbr(mbr, width, height);
    mbr = this.roundMbr(mbr);
    mbr = this.getCameraBox(mbr);
    mbr = this.getCenterPoint(now, mbr, paused);
    
    return mbr;
}

ViewCamera.prototype.applyOffset = function(mbr) {
    mbr.x += this.offset.x;
    mbr.width += this.offset.x;
    mbr.y -= this.offset.y;
    mbr.height += this.offset.y;
    mbr.z -= this.offset.z;
    mbr.depth += this.offset.z;
    return mbr;
}



    
ViewCamera.prototype.roundMbr = function(mbr) {
    mbr.x = round(mbr.x);
    mbr.y = round(mbr.y);
    mbr.z = round(mbr.z);
    mbr.width = round(mbr.width);
    mbr.height = round(mbr.height);
    mbr.depth = round(mbr.depth);
    return mbr;
}

ViewCamera.prototype.getCenterPoint = function(now, mbr, paused) {
    this.center.x = mbr.x + (mbr.width / 2);
    this.center.y = mbr.y + (mbr.height / 2);
    this.center.z = mbr.z;
    if (paused) return mbr;
    this.getCenterPointDrift(now);
    this.getCenterPointShake(now);
    this.center.x = round(this.center.x);
    this.center.y = round(this.center.y);
    this.center.z = round(this.center.z);
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
        mbr.scale = width / mbr.width;
    }
    
    return mbr;    
}



ViewCamera.prototype.reset = function() {
    this.lastview.x = 0;
    this.lastview.y = 0;
    this.lastview.z = 0;
    this.lastview.width = 0;
    this.lastview.height = 0;
    this.lastview.depth = 0;
}

ViewCamera.prototype.updateCameraBox = function(mbr) {
    this.lastview = {
        x : mbr.x,
        y : mbr.y,
        z : mbr.z,
        width: mbr.width,
        height: mbr.height
    };
}

ViewCamera.prototype.getCameraBox = function(mbr) {

    if (!this.lastview.x || !this.lastview.y) {
        this.lastview.x = mbr.x;
        this.lastview.y = mbr.y;
        this.lastview.z = mbr.z;
        this.lastview.width = mbr.width;
        this.lastview.height = mbr.height;
        this.lastview.depth = mbr.depth;
        return mbr;
    }
    
    mbr = this.smoothCameraBox(mbr);
    
    this.lastview.x = mbr.x;
    this.lastview.y = mbr.y;
    this.lastview.z = mbr.z;
    this.lastview.width = mbr.width;
    this.lastview.height = mbr.height;
    this.lastview.depth = mbr.depth;
    
    return mbr;
}

ViewCamera.prototype.smoothCameraBox = function(mbr) {

    var d = this.speed;
    
    var dx = (mbr.x - this.lastview.x) / d;
    var nx = this.lastview.x + dx; 

    var dy = (mbr.y - this.lastview.y) / d;
    var ny = this.lastview.y + dy;

    var dz = (mbr.z - this.lastview.z) / d;
    var nz = this.lastview.z + dz;

    var dw = (mbr.width - this.lastview.width) / d;
    var nw = this.lastview.width + dw;
    
    var dh = (mbr.height - this.lastview.height) / d;
    var nh = this.lastview.height + dh;

    var dd = (mbr.depth - this.lastview.depth) / d;
    var nd = this.lastview.depth + dd;
    
    mbr.x = round(nx);
    mbr.y = round(ny);
    mbr.z = round(nz);
    mbr.width = round(nw);
    mbr.height = round(nh);
    mbr.depth = round(nd);
    
    return mbr;
}