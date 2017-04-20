"use strict";

function WorldColliderIndex() {
    this.indexsize = {
        x : 100,
        y : 100,
        z : 100
    };
    this.index = new Array();
    this.points = new Array();
    this.colliders = new Array();
}

WorldColliderIndex.prototype.reset = function() { 
    this.index = new Array();
    this.points = new Array();
    this.colliders = new Array();
    this.worldindex = new Array();
}

WorldColliderIndex.prototype.indexCollider = function(collider, args) {
    if (collider.width == "100%" || collider.height == "100%" || collider.depth == "100%") {
        this.indexWorld(collider);
        return;
    }
    this.indexColliderX(collider, args);
}

WorldColliderIndex.prototype.indexWorld = function(collider) {
    //
    // todo!
    //
}






WorldColliderIndex.prototype.indexColliderX = function(collider, args) {
    if (args.top || args.bottom || args.front || args.back) this.indexColliderXWidth(collider, args);
    else {
        if (args.left) this.indexColliderXLeft(collider, args);
        if (args.right) this.indexColliderXRight(collider, args);
    }
}

WorldColliderIndex.prototype.indexColliderXLeft = function(collider, args) {
    var x = collider.x;
    var dx = x % this.indexsize.x;
    var ix = "x-" + (x - dx);
    if (!this.index[ix]) this.index[ix] = new Array();
    this.indexColliderZ(ix, this.index[ix], collider, args);
}

WorldColliderIndex.prototype.indexColliderXRight = function(collider, args) {
    var x = collider.x + collider.width - this.indexsize.x;
    var dx = x % this.indexsize.x;
    var ix = "x-" + (x - dx);
    if (!this.index[ix]) this.index[ix] = new Array();
    this.indexColliderZ(ix, this.index[ix], collider, args);
}

WorldColliderIndex.prototype.indexColliderXWidth = function(collider, args) {
    var right = args.right;
    var x = collider.x;
    var width = collider.width - this.indexsize.x;
    var dx = x % this.indexsize.x;
    if (dx) {
        var ix = "x-" + (x - dx);
        if (!this.index[ix]) this.index[ix] = new Array();
        this.indexColliderZ(ix, this.index[ix], collider, args);
        var ddx = this.indexsize.x - dx;
        x += ddx;
        width -= ddx;
        args.left = false;
    }
    var dw = width % this.indexsize.x;
    if (width <= dw) {
        var iix = "x-" + x;
        if (!this.index[iix]) this.index[iix] = new Array();
        this.indexColliderZ(iix, this.index[iix], collider, args);
        dw = 0;
    } else {
        var iw = (width - dw) / this.indexsize.x;
        for (var i = 0; i <= iw; i++) {
            var iix = "x-" + (x + (i * this.indexsize.x));
            if (!this.index[iix]) this.index[iix] = new Array();
            args.right = (i == iw && !dw) ? right : false;
            this.indexColliderZ(iix, this.index[iix], collider, args);
            args.left = false;
        }
    }
    if (dw) {
        var iiix = width + this.indexsize.x - dw;
        if (iiix > iix) {
            iiix = "x-" + iiix;
            if (!this.index[iiix]) this.index[iiix] = new Array();
            args.right = right;
            this.indexColliderZ(iiix, this.index[iiix], collider, args);
        }
    }
}






WorldColliderIndex.prototype.indexColliderZ = function(xkey, xindex, collider, args) {
    if (args.top || args.bottom || args.left || args.right) this.indexColliderZDepth(xkey, xindex, collider, args);
    else {
        if (args.front) this.indexColliderZFront(xkey, xindex, collider, args);
        if (args.back) this.indexColliderZBack(xkey, xindex, collider, args);
    }
}

WorldColliderIndex.prototype.indexColliderZFront = function(xkey, xindex, collider, args) {
    var z = collider.z;
    var dz = z % this.indexsize.z;
    var iz = "z-" + (z - dz);
    if (!xindex[iz]) xindex[iz] = new Array();
    this.indexColliderY(xkey, iz, xindex[iz], collider, args);
}

WorldColliderIndex.prototype.indexColliderZBack = function(xkey, xindex, collider, args) {
    var z = collider.z + collider.depth - this.indexsize.z;
    var dz = z % this.indexsize.z;
    var iz = "z-" + (z - dz);
    if (!xindex[iz]) xindex[iz] = new Array();
    this.indexColliderY(xkey, iz, xindex[iz], collider, args);
}

WorldColliderIndex.prototype.indexColliderZDepth = function(xkey, xindex, collider, args) {
    var z = collider.z;
    var depth = collider.depth - this.indexsize.z;
    var dz = z % this.indexsize.z;
    if (dz) {
        var iz = "z-" + (z - dz);
        if (!xindex[iz]) xindex[iz] = new Array();
        this.indexColliderY(xkey, iz, xindex[iz], collider, args);
        var ddz = this.indexsize.z - dz;
        z += ddz;
        depth -= ddz;
    }
    var dz = depth % this.indexsize.z;
    if (depth <= dz) {
        var iiz = "z-" + z;
        if (!xindex[iiz]) xindex[iiz] = new Array();
        this.indexColliderY(xkey, iiz, xindex[iiz], collider, args);
        dz = 0;
    } else {
        var iz = (depth - dz) / this.indexsize.z;
        for (var i = 0; i <= iz; i++) {
            var iiz = "z-" + (z + (i * this.indexsize.z));
            if (!xindex[iiz]) xindex[iiz] = new Array();
            this.indexColliderY(xkey, iiz, xindex[iiz], collider, args);
        }
    }
    if (dz) {
        var iiiz = depth + this.indexsize.z - dz;
        if (iiiz > iiz) {
            iiiz = "z-" + iiiz;
            if (!xindex[iiiz]) xindex[iiiz] = new Array();
            this.indexColliderY(xkey, iiiz, xindex[iiiz], collider, args);
        }
    }

}





WorldColliderIndex.prototype.indexColliderY = function(xkey, zkey, xzindex, collider, args) {
    if (args.front || args.back || args.left || args.right) this.indexColliderYHeight(xkey, zkey, xzindex, collider);
    else {
        if (args.top) this.indexColliderYTop(xkey, zkey, xzindex, collider);
        if (args.bottom) this.indexColliderYBottom(xkey, zkey, xzindex, collider);
    }
}

WorldColliderIndex.prototype.indexColliderYTop = function(xkey, zkey, xzindex, collider) {
    var y = collider.y;
    var dy = y % this.indexsize.y;
    var iy = y - dy;
    this.indexColliderXZY(xkey, zkey, xzindex, iy, collider);
}

WorldColliderIndex.prototype.indexColliderYBottom = function(xkey, zkey, xzindex, collider) {
    var y = collider.y + collider.height - this.indexsize.y;
    var dy = y % this.indexsize.y;
    var iy = y - dy;
    this.indexColliderXZY(xkey, zkey, xzindex, iy, collider);
}

WorldColliderIndex.prototype.indexColliderYHeight = function(xkey, zkey, xzindex, collider) {
    var y = collider.y;
    var height = collider.height - this.indexsize.y;
    var dy = y % this.indexsize.y;
    if (dy) {
        var iy = y - dy;
        this.indexColliderXZY(xkey, zkey, xzindex, iy, collider);
        var ddy = this.indexsize.y - dy;
        y += ddy;
        height -= ddy;
        return;
    }
    var dy = height % this.indexsize.y;
    if (height <= dy) {
        this.indexColliderXZY(xkey, zkey, xzindex, y, collider);
        dy = 0;
    } else {
        var iy = (height - dy) / this.indexsize.y;
        for (var i = 0; i <= iy; i++) {
            var iiy = y + (i * this.indexsize.y);
            this.indexColliderXZY(xkey, zkey, xzindex, iiy, collider);
            dy = 0;
            break;
        }
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
    xzindex[y].push(indexkey);
    var x = Number(xkey.replace("x-", ""));
    var z = Number(zkey.replace("z-", ""));
    
    if (!this.points[indexkey]) {
        this.points[indexkey] = { 
            center : null, 
            top : new Array(), 
            bottom: new Array() 
        };
    }
    
    var cx = x + (this.indexsize.x / 2);
    var cy = y + (this.indexsize.y / 2);
    var cz = z + (this.indexsize.z / 2);
    
    this.points[indexkey].center = new Point(cx, cy, cz);

    this.points[indexkey].top[0] = new Point(x, y, z);
    this.points[indexkey].top[1] = new Point(x + this.indexsize.x, y, z);
    this.points[indexkey].top[2] = new Point(x + this.indexsize.x, y, z + this.indexsize.z);
    this.points[indexkey].top[3] = new Point(x, y, z + this.indexsize.z);

    this.points[indexkey].bottom[0] = new Point(x, y + this.indexsize.y, z);
    this.points[indexkey].bottom[1] = new Point(x + this.indexsize.x, y + this.indexsize.y, z);
    this.points[indexkey].bottom[2] = new Point(x + this.indexsize.x, y + this.indexsize.y, z + this.indexsize.z);
    this.points[indexkey].bottom[3] = new Point(x, y + this.indexsize.y, z + this.indexsize.z);
    
    this.colliders[indexkey] = collider;
}






























WorldColliderIndex.prototype.getColliderIndex = function(collider, result) {
    result = this.getColliderIndexTop(collider, result);
    result = this.getColliderIndexBottom(collider, result);
    return result;
}

WorldColliderIndex.prototype.getColliderIndexTop = function(collider, result) {
    result = this.getColliderIndexAtPoint(collider.x, collider.y, collider.z, result);
    result = this.getColliderIndexAtPoint(collider.x + collider.width, collider.y, collider.z, result);
    result = this.getColliderIndexAtPoint(collider.x, collider.y, collider.z + collider.depth, result);
    result = this.getColliderIndexAtPoint(collider.x + collider.width, collider.y, collider.z + collider.depth, result);
    return result;
}

WorldColliderIndex.prototype.getColliderIndexBottom = function(collider, result) {
    result = this.getColliderIndexAtPoint(collider.x, collider.y + collider.height, collider.z, result);
    result = this.getColliderIndexAtPoint(collider.x + collider.width, collider.y + collider.height, collider.z, result);
    result = this.getColliderIndexAtPoint(collider.x, collider.y + collider.height, collider.z + collider.depth, result);
    result = this.getColliderIndexAtPoint(collider.x + collider.width, collider.y + collider.height, collider.z + collider.depth, result);
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
        if (!miny || ( yindex <= y && yindex > miny)) miny = ykey;
    }
    if (!miny) return result;
    var out = index[miny][0];
    result[out] = out;
    return result;
}