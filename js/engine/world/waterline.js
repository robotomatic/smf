"use strict";

function Waterline() {
    this.flow = false;
    this.level = 0;
    this.y = 0;
    this.z = 0;
    this.amount = 0;
    this.miny = 0;
    this.maxy = 0;
    this.down = true;
    this.waterline = 0;
    this.item = null;
    this.color = null;
    this.surface = {
        depth : 0,
        size : 0,
        frequency : 0,
        points : new Array(),
        keys : new Array(),
        hilights : new Array()
    };
}

Waterline.prototype.reset = function() {
    this.flow = false;
    this.level = 0;
    this.y = 0;
    this.z = 0;
    this.amount = 0;
    this.miny = 0;
    this.maxy = 0;
    this.down = true;
    this.waterline = 0;
    this.surface = {
        depth : 0,
        size : 0,
        frequency : 0,
        points : new Array(),
        keys : new Array(),
        hilights : new Array()
    };
}

Waterline.prototype.setItem = function(item) {
    this.item = item;
}

Waterline.prototype.getColor = function(world) {
    var renderer = world.worldrenderer.itemrenderer    ;
    var theme = renderer.getItemTheme(this.item);
    if (theme) {
        var mat = theme.material;
        if (mat) {
            var mmm = renderer.materials.materials[mat];
            if (mmm) {
                if (mmm.color && mmm.color.projected) {
                    this.color = mmm.color.projected.top;    
                }
            }
        } else if (theme.color && theme.color.projected) {
            this.color = theme.color.projected.top;
        } else if (theme.color) {
            this.color = theme.color;
            if (theme.color.gradient) {
                var gradient = theme.color.gradient;
                this.color = gradient.start;
            }
        }
        return this.color;
    }
    return "red";
}


Waterline.prototype.buildWaterline = function(world) {
    if (!this.surface.size) return;
    var bounds = world.bounds;
    var x = bounds.x;
    var width = bounds.width;
    var size = this.surface.size;
    var dx = x % size;
    if (dx) x -= dx;
    var dw = (x + width) % size;
    if (dw) width += dw;
    var z = bounds.z;
    var depth = bounds.depth;
    var dz = z % size;
    if (dz) z -= dz;
    var dd = (z + depth) % size;
    if (dd) depth += dz;
    var y = this.y;
    var xw = x + width;
    var zd = z + depth;
    var oddx = false;
    for (var ix = x; ix < xw; ix += size) {
        var oddz = !oddx;
        for (var iz = z; iz <= zd; iz += size) {
            var offset = oddz ? 0 : this.surface.height;
            var dir = oddz ? 0 : 1;
            var point = new Point(ix, y, iz);
            var pointinfo = { point : point, offset : offset, dir : dir };
            var key = "x-" + ix + "-z-" + iz;
            this.surface.points[key] = pointinfo;
            this.surface.keys.push(key);
            oddz = !oddz;
        }
        oddx = !oddx;
    }
}



Waterline.prototype.update = function() {
    if (!this.flow) return null;
    if (this.down) {
        this.level += this.amount;
        if (this.level > this.maxy) {
            this.down = false;
        }
    } else {
        this.level -= this.amount;
        if (this.level < this.miny) {
            this.down = true;
        }
    }
    this.waterline = round(this.y + this.level);
    this.updateWaterline();
}


Waterline.prototype.updateWaterline = function() {
    if (!this.surface.keys.length) return;
    var height = this.surface.height;
    var freq = this.surface.frequency;
    var t  = this.surface.keys.length;
    for (var i = 0; i < t; i++) {
        var key = this.surface.keys[i];
        var point = this.surface.points[key];
        var dir = point.dir;
        if (dir == 0) {
            if (point.offset < height) point.offset += freq;
            else point.dir = 1;
        } else {
            if (point.offset > 0) point.offset -= freq;
            else point.dir = 0;
        }
        var pointy = point.offset + this.waterline;
        point.point.y = pointy;
    }
}















Waterline.prototype.updateItemWaterline = function(item) {
    if (!this.item) return;
    if (!this.waterline) return;
    if (item.underwater) return;
    if (item.waterline  || item.width == "100%") return;
    if (item.y + item.height < this.waterline) return;
    if (!this.surface.size) return;
    if (!item.geometry) return;
    if(item.geometry.visible.front.visible) {
        this.updateItemWaterlineFront(item);
    }
    if(item.geometry.visible.left.visible) {
        this.updateItemWaterlineLeft(item);
    }
    if(item.geometry.visible.right.visible) {
        this.updateItemWaterlineRight(item);
    }
}
    
Waterline.prototype.updateItemWaterlineFront = function(item) {
    var front = item.watersurface.front;
    if (!front.keys.length) this.getItemWaterlineFront(item);
    this.updateItemWaterlineHeight(front);
}

Waterline.prototype.getItemWaterlineFront = function(item) {
    var sx = item.x - this.surface.size;
    var dx = sx % this.surface.size;
    var xx = sx - dx;
    var x = (xx / this.surface.size) * this.surface.size;
    var dz = item.z % this.surface.size;
    var zz = item.z - dz;
    var z = (zz / this.surface.size) * this.surface.size;
    var width = item.width + this.surface.size;
    var newpoints = new Array();
    for (var i = 0; i <= width; i+= this.surface.size) {
        var ix = x + i;
        var k = "x-" + ix + "-z-" + z;
        var point = this.surface.points[k];
        if (point) {
            if (point.point.x < x + width) {
                k = "x-" + (ix + this.surface.size) + "-z-" + z;
                point = this.surface.points[k];
                if (point) {
                    this.surface.hilights[k] = k;
                    item.watersurface.front.keys.push(k);
                    newpoints.push(point.point);
                }
            }
        }
    }
    item.watersurface.front.points.updatePoints(newpoints);
}

Waterline.prototype.updateItemWaterlineLeft = function(item) {
    var left = item.watersurface.left;
    if (!left.keys.length) this.getItemWaterlineLeft(item);
    this.updateItemWaterlineHeight(left);
}

Waterline.prototype.getItemWaterlineLeft = function(item) {
    var dx = item.x % this.surface.size;
    var xx = item.x - dx;
    var x = (xx / this.surface.size) * this.surface.size;
    var dz = item.z % this.surface.size;
    var zz = item.z - dz;
    var z = (zz / this.surface.size) * this.surface.size;
    var depth = item.depth + this.surface.size; 
    var newpoints = new Array();
    for (var i = 0; i <= depth; i+= this.surface.size) {
        var iz = z + i;
        var k = "x-" + x + "-z-" + iz;
        var key = this.surface.points[k];
        if (key) {
            this.surface.hilights[k] = k;
            var point = this.surface.points[k];
            item.watersurface.left.keys.push(k);
            newpoints.push(point.point);
        }
    }
    item.watersurface.left.points.updatePoints(newpoints);
}

Waterline.prototype.updateItemWaterlineRight = function(item) {
    var right = item.watersurface.right;
    if (!right.keys.length) this.getItemWaterlineRight(item);
    this.updateItemWaterlineHeight(right);
}
    
Waterline.prototype.getItemWaterlineRight = function(item) {
    var w = item.x + item.width;
    var dx = w % this.surface.size;
    var xx = w - dx;
    var x = (xx / this.surface.size) * this.surface.size;
    var dz = item.z % this.surface.size;
    var zz = item.z - dz;
    var z = (zz / this.surface.size) * this.surface.size;
    var width = item.width;
    var depth = item.depth + this.surface.size; 
    var newpoints = new Array();
    for (var i = 0; i <= depth; i+= this.surface.size) {
        var iz = z + i;
        var k = "x-" + x + "-z-" + iz;
        var point = this.surface.points[k];
        if (point) {
            if (point.point.x < x + width) {
                k = "x-" + (x + this.surface.size) + "-z-" + iz;
                point = this.surface.points[k];
                if (point) {
                    this.surface.hilights[k] = k;
                    item.watersurface.right.keys.push(k);
                    newpoints.push(point.point);
                }
            }
        }
    }
    item.watersurface.right.points.updatePoints(newpoints);
}









Waterline.prototype.updateItemWaterlineHeight = function(itemwaterline) {
    var keys = itemwaterline.keys;
    var itempoints = itemwaterline.points.points;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var sp = this.surface.points[key];
        var itempoint = itempoints[i];
        
        var y = sp.point.y;
        
        itempoint.y = y;
    }
}
    
