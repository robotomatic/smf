"use strict";

function StageFlood() {
    
    this.flood = {
        level : 0,
        amount : 0.1,
        max : 5,
        min : -2,
        down : true
    }
    
}



StageFlood.prototype.init = function() {
    if (this.flood.down) {
        this.flood.level += this.flood.amount;
        if (this.flood.level > this.flood.max) {
            this.flood.down = false;
        }
    } else {
        this.flood.level -= this.flood.amount;
        if (this.flood.level < this.flood.min) {
            this.flood.down = true;
        }
    }
}
    
StageFlood.prototype.renderItemFlood = function(now, graphics, window, x, y, scale, quality, renderer, item, flood) {
    
    
    if (!flood) return;

    var fy = flood.y + this.flood.level;
    
    if (item.width == "100%") return;
    var mbr = item.getMbr();
    if (item.y + mbr.height < fy) {
        return;
    }

    var grap = item.graphics ? graphics[item.graphics] : graphics.main;
    var ctx = grap.ctx;

    var titem = renderer.getItemTheme(flood);
    var c = titem.color;
    var gradient = c.gradient;
    
    var t = y;
    if(gradient.top) {
        var ix = (item.x - x) * scale;
        var it = (item.y - y) * scale;
        var dt = (gradient.top - item.y) * scale;
        var iy = it + dt;
        var p1 = new Point(ix, iy);
        var np1 = new Point(0, 0);
        var wc = window.getCenter();
        np1 = projectPoint3D(p1, 300 * scale, scale, x, y, wc, np1);
        t = np1.y;
    }
    
    var h = 0;
    if (gradient.height) h = gradient.height * scale;
    
    if (h + t <= 0) return;
    
    var g = ctx.createLinearGradient(0, t, 0, h + t);
    var start = gradient.start;
    var stop = gradient.stop;
    g.addColorStop(0, start);
    g.addColorStop(1, stop);
    var color = g;
    
    
    
    var ip = item.getLocation();
    
    var ix = (ip.x - x) * scale;
    var iy = (ip.y - y) * scale;
    var ify = (fy - y) * scale;
    var iz = item.z;
    var iw = item.width * scale;
    var ih = item.height * scale;

    var wc = window.getCenter();
    var sd = iz * scale || 0;

    var depth = item.depth;

    if (!item.parts || item.parts.length == 1) {
        var rh = iy + ih;    
        var p1 = new Point(ix, ify);
        var p2 = new Point(ix + iw, ify);

        this.projectFlood(ctx, p1, p2, x, y, rh, sd, depth, scale, wc, color);
    } else {
        
        var left = null;
        var right = null;
        var bottom = 0;
        
        var poly = new Polygon();
        poly.setPoints(item.polygon.points);
        
        var t = poly.points.length;
        for (var i = 1; i < t; i++) {
            
            var ps = poly.points[i - 1];
            var p1 = new Point(item.x + ps.x, item.y + ps.y);
            
            var pe = poly.points[i];
            var p2 = new Point(item.x + pe.x, item.y + pe.y);
            
            if (p2.y > bottom) bottom = p2.y;
            
            if (p1.y < p2.y) {
                if (p1.y < fy && p2.y > fy) {
                    if (!right) right = new Point(0, 0);
                    right.x = p1.x
                }
            } else {
                if (p2.y < fy && p1.y > fy) {
                    if (!left) left = new Point(0, 0);
                    left.x = p1.x
                }
            }
        }
        

        var ps = poly.points[t - 1];
        var p1 = new Point(item.x + ps.x, item.y + ps.y);

        var pe = poly.points[0];
        var p2 = new Point(item.x + pe.x, item.y + pe.y);

        if (p2.y > bottom) bottom = p2.y;

        if (p2.y < fy && p1.y > fy) {
            if (!left) left = new Point(0, 0);
            left.x = p1.x
        }
        
        
        if (left && right) {
            
            left.x = ix + ((left.x - item.x) * scale);
            left.y = ify;
            
            right.x = ix + ((right.x - item.x) * scale);
            right.y = ify;
            
            var rh = (bottom * scale) - iy;

            this.projectFlood(ctx, left, right, x, y, rh, sd, depth, scale, wc, color);
        } else {
            var debug = true;
        }
    }
    
}


StageFlood.prototype.projectFlood = function(ctx, p1, p2, x, y, rh, sd, depth, scale, wc, color) {

    
    ctx.fillStyle = color;
    
    var np1 = new Point(0, 0);
    np1 = projectPoint3D(p1, sd, scale, x, y, wc, np1);
    
    var np2 = new Point(0, 0);
    rh = rh - np2.y;    
    np2 = projectPoint3D(p2, sd, scale, x, y, wc, np2);
    
    var rw = np2.x - np1.x;
    var r = new Rectangle(np1.x, np1.y, rw, rh);
    ctx.beginPath();
    r.draw(ctx);
    
    var sdd = depth * scale;
    var npt = new Point(0, 0);
    var poly = new Polygon();
    var np3 = new Point(0, 0);
    np3 = projectPoint3D(np1, sdd, scale, x, y, wc, np3);
    if (np3.x < np1.x) {
        poly.addPoint(np1);
        poly.addPoint(np3);
        npt.x = np3.x;
        npt.y = np3.y + rh;
        poly.addPoint(npt);
        npt.x = np1.x;
        npt.y = np1.y + rh;
        poly.addPoint(npt);
        ctx.beginPath();
        poly.draw(ctx);
    }
    var np4 = new Point(0, 0);
    np4 = projectPoint3D(np2, sdd, scale, x, y, wc, np4);
    if (np4.x > np2.x) {
        poly.addPoint(np2);
        poly.addPoint(np4);
        npt.x = np4.x;
        npt.y = np4.y + rh;
        poly.addPoint(npt);
        npt.x = np2.x;
        npt.y = np2.y + rh;
        poly.addPoint(npt);
        ctx.beginPath();
        poly.draw(ctx);
    }
}
