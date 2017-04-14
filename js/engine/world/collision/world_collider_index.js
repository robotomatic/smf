"use strict";

function WorldColliderIndex() {
    this.indexsize = {
        x : 100,
        y : 100,
        z : 100
    };
    this.index = new Array()
}

WorldColliderIndex.prototype.reset = function() { 
    this.index = new Array();
}

WorldColliderIndex.prototype.indexCollider = function(collider) {
    if (collider.width == "100%" || collider.height == "100%" || collider.depth == "100%") {
        this.indexWorld(collider);
        return;
    }
    this.indexColliderX(collider);
}

WorldColliderIndex.prototype.indexWorld = function(collider) {
    
    // todo: liquid!
    
}



WorldColliderIndex.prototype.indexColliderX = function(collider) {
    var x = collider.x;
    var width = collider.width;
    var dx = x % this.indexsize.x;
    if (dx) {
        var ix = "x-" + (x - dx);
        if (!this.index[ix]) this.index[ix] = new Array();
        this.indexColliderZ(ix, this.index[ix], collider);
        var ddx = this.indexsize.x - dx;
        x += ddx;
        width -= ddx;
    }
    var dw = width % this.indexsize.x;
    var iw = (width - dw) / this.indexsize.x;
    for (var i = 0; i < iw; i++) {
        var iix = "x-" + (x + (i * this.indexsize.x));
        if (!this.index[iix]) this.index[iix] = new Array();
        this.indexColliderZ(iix, this.index[iix], collider);
    }
    if (dw) {
        var iiix = width + this.indexsize.x - dw;
        if (iiix > iix) {
            iiix = "x-" + iiix;
            if (!this.index[iiix]) this.index[iiix] = new Array();
            this.indexColliderZ(iiix, this.index[iiix], collider);
        }
    }
}

WorldColliderIndex.prototype.indexColliderZ = function(xkey, xindex, collider) {
    var z = collider.z;
    var depth = collider.depth;
    var dz = z % this.indexsize.z;
    if (dz) {
        var iz = "z-" + (z - dz);
        this.indexColliderXZ(xindex, iz);
        this.indexColliderY(xkey, iz, xindex[iz], collider);
        var ddz = this.indexsize.z - dz;
        z += ddz;
        depth -= ddz;
    }
    var dz = depth % this.indexsize.z;
    var iz = (depth - dz) / this.indexsize.z;
    for (var i = 0; i < iz; i++) {
        var iiz = "z-" + (z + (i * this.indexsize.z));
        this.indexColliderXZ(xindex, iiz);
        this.indexColliderY(xkey, iiz, xindex[iiz], collider);
    }
    if (dz) {
        var iiiz = depth + this.indexsize.z - dz;
        if (iiiz > iiz) {
            iiiz = "z-" + iiiz;
            this.indexColliderXZ(xindex, iiiz);
            this.indexColliderY(xkey, iiiz, xindex[iiiz], collider);
        }
    }

}

WorldColliderIndex.prototype.indexColliderXZ = function(xindex, z) {
    if (xindex[z]) return;
    xindex[z] = new Array();
}







WorldColliderIndex.prototype.indexColliderY = function(xkey, zkey, xzindex, collider) {
    var y = collider.y;
    var height = collider.height;
    var dy = y % this.indexsize.y;
    if (dy) {
        var iy = y - dy;
        this.indexColliderXZY(xkey, zkey, xzindex, iy, collider);
        var ddy = this.indexsize.y - dy;
        y += ddy;
        height -= ddy;
    }
    var dy = height % this.indexsize.y;
    var iy = (height - dy) / this.indexsize.y;
    for (var i = 0; i < iy; i++) {
        var iiy = y + (i * this.indexsize.y);
        this.indexColliderXZY(xkey, zkey, xzindex, iiy, collider);
    }
    if (dy) {
        var iiiy = height + this.indexsize.y - dy;
        if (iiiy > iiy) {
            this.indexColliderXZY(xkey, zkey, xzindex, iiiy, collider);
        }
    }
}

WorldColliderIndex.prototype.indexColliderXZY = function(xkey, zkey, xzindex, y, collider) {
    var keys = Object.keys(xzindex);
    var found = false;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == y) {
            found = true;
            break;
        }
        
    }
    if (!found) xzindex[y] = new Array();
    var indexkey = xkey + "-" + zkey + "-y-" + y;
    
    if (!collider) {
        console.log("WTFers");
    }
    
    xzindex[y].push(indexkey);
}






























WorldColliderIndex.prototype.getColliderIndex = function(collider, result) {
    result.front.left = this.getColliderIndexAtPoint(collider.x, collider.y + collider.height, collider.z, result.front.left);
    result.front.right = this.getColliderIndexAtPoint(collider.x + collider.width, collider.y + collider.height, collider.z, result.front.right);
    result.back.left = this.getColliderIndexAtPoint(collider.x, collider.y + collider.height, collider.z + collider.depth, result.back.left);
    result.back.right = this.getColliderIndexAtPoint(collider.x + collider.width, collider.y + collider.height, collider.z + collider.depth, result.back.right);
    return result;
}


WorldColliderIndex.prototype.getColliderIndexAtPoint = function(x, y, z, result) {
    var dx = x % this.indexsize.x;
    var xx = x - dx;
    var ix = (xx / this.indexsize.x) * this.indexsize.x;
    var xkey = "x-" + ix;
    if (!this.index[xkey]) return result;
    var dz = z % this.indexsize.z;
    var zz = z - dz;
    var iz = (zz / this.indexsize.z) * this.indexsize.z;
    var zkey = "z-" + iz;
    var index = this.index[xkey][zkey];
    if (!index) return result;
    var ykeys = Object.keys(index);
    var t = ykeys.length;
    var miny = 0;
    for (var i = 0; i < t; i++) {
        var ykey = ykeys[i];
        var yindex = Number(ykey);
        if (!miny || yindex < miny) miny = ykey;
    }
    if (!miny) return result;
    result = index[miny][0];
    return result;
}