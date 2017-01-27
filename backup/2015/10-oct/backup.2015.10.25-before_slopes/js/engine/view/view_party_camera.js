PartyViewCamera = function() {

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


PartyViewCamera.prototype.getCenterPoint = function(p) {

    if (this.shake.elapsed >= this.shake.duration) return p;
    
    var percent = this.shake.elapsed / this.shake.duration;
    
    var x = Math.random() * 2 * this.shake.magnitude - this.shake.magnitude;
    var y = Math.random() * 2 * this.shake.magnitude - this.shake.magnitude;
    
    p.x += x;
    p.y += y;
    
    var now = timestamp();
    this.shake.elapsed = now - this.shake.start;
    
    
    return p;
}

PartyViewCamera.prototype.getCameraBox = function(mbr) {

    if (this.lastview) {
        
        
        this.lastview.x = mbr.x;
        this.lastview.width = mbr.width;
        

        var thresh = 1;
        var amount = .25;
        
        
        var mx = clamp(mbr.x);
        var lx = clamp(this.lastview.x);
        
        if (mx < lx) {
            var d = lx - mx;
            if (d >= thresh) {
                this.lastview.x = this.lastview.x - amount;
                mbr.x = this.lastview.x;
            }
        } else if (mx > lx) {
            var d = mx - lx;
            if (d >= thresh) {
                this.lastview.x = this.lastview.x + (amount * 5);
                mbr.x = this.lastview.x;
            }
        }
        

        var mw = clamp(mbr.width);
        var lw = clamp(this.lastview.width);

        if (mw < lw) {
            var d = lw - mw;
            if (d >= thresh) {
                this.lastview.width = this.lastview.width - amount;
                mbr.width = this.lastview.width;
            }
        } else if (mw > lw) {
            var d = mw - lw;
            if (d >= thresh) {
                this.lastview.width = this.lastview.width + (amount * 5);
                mbr.width = this.lastview.width;
            }
        }
        

        var my = clamp(mbr.y);
        var ly = clamp(this.lastview.y);

        if (my < ly) {
            var d = ly - my;
            if (d >= thresh) {
                this.lastview.y = this.lastview.y - amount;
                mbr.y = this.lastview.y;
            }
        } else if (my > ly) {
            var d = my - ly;
            if (d >= thresh) {
                this.lastview.y = this.lastview.y + (amount * 5);
                mbr.y = this.lastview.y;
            }
        }

        var mh = clamp(mbr.height);
        var lh = clamp(this.lastview.height);

        if (mh < lh) {
            var d = lh - mh;
            if (d >= thresh) {
                this.lastview.height = this.lastview.height - amount;
                mbr.height = this.lastview.height;
            }
        } else if (mh > lh) {
            var d = mh - lh;
            if (d >= thresh) {
                this.lastview.height = this.lastview.height + (amount * 5);
                mbr.height = this.lastview.height;
            }
        }
    } else {
        this.lastview = {
            x : mbr.x,
            y: mbr.y,
            width: mbr.width,
            height: mbr.height
        }
    }

    return mbr;
}


