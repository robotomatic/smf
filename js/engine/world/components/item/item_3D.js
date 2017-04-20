"use strict";

function Item3D() {
    this.left = false;
    this.right = false;
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.cp = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    this.np = new Point(0, 0);
    this.pp = new Point(0, 0);
}

Item3D.prototype.createItem3D = function(item, world, window, width, height, debug = null) {
    item.geometry.front.showing = false;
    item.geometry.top.showing = false;
    item.geometry.bottom.showing = false;
    item.geometry.left.showing = false;
    item.geometry.right.showing = false;
    if (item.underwater) return;
    if (!world.worldrenderer.itemrenderer.shouldThemeProject(item)) return;
    if (item.draw == false) {
        if (!debug || (!debug.level && !debug.render && !debug.hsr)) return;
    }
    if (item.scalefactor < 0) return;
    var x = window.x;
    var y = window.y;
    var scale = window.scale || 0;
    var box = item.box;
    var depth = box.depth;
    this.projectItem3D(world, item, box, depth, scale, x, y, window, width, height);
}

Item3D.prototype.projectItem3D = function(world, item, geom, depth, scale, x, y, window, width, height) {

    var wc = window.getCenter();
    
    item.geometry.front.showing = true;
    item.geometry.front.geometry.points.length = 3;
    item.geometry.front.geometry.updatePoints(geom.getPoints());
    item.geometry.front.geometry.points[0].x -=1;
    item.geometry.front.geometry.points[0].y -=1;
    item.geometry.front.geometry.points[1].x +=1;
    item.geometry.front.geometry.points[1].y -=1;
    item.geometry.front.geometry.points[2].x +=1;
    item.geometry.front.geometry.points[3].x -=1;
    
    if (world.worldrenderer.render.world) {
        if (item.watersurface.front.keys.length) {
            this.projectItem3DWaterlineFront(item, window, wc);
        }
    }
    
     if (item.width == "100%" && item.geometry.front.geometry.points.length > 3) {
         item.geometry.front.geometry.points[0].x = 0;
         item.geometry.front.geometry.points[1].x = width;
         item.geometry.front.geometry.points[2].x = width;
         item.geometry.front.geometry.points[3].x = 0;
     }

    var t = item.geometry.front.geometry.points.length;
    for (var i = 1; i < t; i++) {
        
        this.p1.x = round(item.geometry.front.geometry.points[i - 1].x);
        this.p2.x = round(item.geometry.front.geometry.points[i].x);
        
        if (this.p1.x < this.p2.x) continue;
        
        this.p1.y = round(item.geometry.front.geometry.points[i - 1].y);
        this.p2.y = round(item.geometry.front.geometry.points[i].y);

        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        
        var horiz = abs(this.p1.y - this.p2.y) < 3;
        var vert = abs(this.p1.x - this.p2.x) < 3;
        var top = horiz && (this.p1.x < this.p2.x);
        var bottom = horiz && !top;
        var left = vert && (this.p1.y > this.p2.y);
        var right = vert && !left;
        var side = left || right;

        if (this.p1.x < this.p2.x) continue;
        
        var view = null;
        if (horiz) {
            if (side) view = left ? item.geometry.left : item.geometry.right;
            else view = item.geometry.bottom;
        } else {
            if (vert) view = left ? item.geometry.left : item.geometry.right;
            else {
                var ramptopleft = this.p1.x < this.p2.x && this.p1.y > this.p2.y;
                var ramptopright = this.p1.x < this.p2.x && this.p1.y < this.p2.y;
                var ramptop = ramptopleft || ramptopright;
                var rampbottomleft = this.p1.x > this.p2.x && this.p1.y > this.p2.y;
                var rampbottomright = this.p1.x > this.p2.x && this.p1.y < this.p2.y;
                var rampbottom = rampbottomleft || rampbottomright;
                if (ramptop) view = item.geometry.top;
                else if (rampbottom) view = item.geometry.bottom;
                else view = left ? item.geometry.left : item.geometry.right;
            }
        }
        view.geometry = project3D(this.p1, this.p2, depth, view.geometry, scale, x, y, wc, this.np1, this.np2);
        view.showing = true;
    }

    var px = (wc.x - x) * scale;
    this.left = this.p1.x > px;
    this.right = !this.left;
    
    if (this.left) {
        if (item.geometry.front.geometry.points.length) {
            this.p1.x = round(item.geometry.front.geometry.points[t - 1].x);
            this.p1.y = round(item.geometry.front.geometry.points[t - 1].y);
            this.p2.x = round(item.geometry.front.geometry.points[0].x);
            this.p2.y = round(item.geometry.front.geometry.points[0].y);
        }
    } else {
        if (item.geometry.front.geometry.points.length > 2) {
            this.p1.x = round(item.geometry.front.geometry.points[1].x);
            this.p1.y = round(item.geometry.front.geometry.points[1].y);
            this.p2.x = round(item.geometry.front.geometry.points[2].x);
            this.p2.y = round(item.geometry.front.geometry.points[2].y);
        }
    }
    
    if (shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) {
        var side = this.left ? item.geometry.left : item.geometry.right;
        side.geometry = project3D(this.p1, this.p2, depth, side.geometry, scale, x, y, wc, this.np1, this.np2);
        side.showing = true;
    }
    
    var t = item.geometry.front.geometry.points.length;
    for (var i = 1; i < t; i++) {
        this.p1.x = round(item.geometry.front.geometry.points[i - 1].x);
        this.p2.x = round(item.geometry.front.geometry.points[i].x);
        if (this.p1.x >= this.p2.x) continue;
        this.p1.y = round(item.geometry.front.geometry.points[i - 1].y);
        this.p2.y = round(item.geometry.front.geometry.points[i].y);
        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        item.geometry.top.geometry = project3D(this.p1, this.p2, depth, item.geometry.top.geometry, scale, x, y, wc, this.np1, this.np2);
        if (item.width == "100%") {
            if (item.geometry.top.geometry.points.length > 3) {
                item.geometry.top.geometry.points[0].x = 0;
                item.geometry.top.geometry.points[1].x = width;
                item.geometry.top.geometry.points[2].x = width;
                item.geometry.top.geometry.points[3].x = 0;
                if (item.waterline) {
                    item.geometry.top.geometry.points[2].y += (height - item.geometry.top.geometry.points[2].y);
                    item.geometry.top.geometry.points[3].y +=  (height - item.geometry.top.geometry.points[3].y);
                }
            }
        }
        item.geometry.top.showing = true;
    }
}

Item3D.prototype.projectItem3DWaterlineFront = function(item, window, wc) {

    var waterline = item.watersurface.front.points;
    if (!waterline.points.length) return;

    var front = item.geometry.front.geometry;
    
    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale;
    
    var point;
    var px;
    var py;
    var pz;
    var ppy;
   
    for (var i = 1; i < waterline.points.length - 1; i++) {
        point = waterline.points[i];
        px = (point.x - x) * scale;
        py = (point.y - y) * scale;
        pz = (item.z - z) * scale;
        if (pz < -(__fov - 1)) {
            pz = -nz;
        }
        this.np.x = px;
        this.np.y = py;
        this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
        front.points.splice(3, 0, new Point(this.pp.x, this.pp.y));
    }

    
    point = waterline.points[waterline.points.length - 1];
    px = (point.x - x) * scale;
    py = (point.y - y) * scale;
    pz = (item.z - z) * scale;
    if (pz < -(__fov - 1)) {
        pz = -nz;
    }
    this.np.x = px;
    this.np.y = py;
    this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
    
    ppy = this.pp.y;
    if (this.pp.x > front.points[2].x) {
        var fp = front.points[2];
        var l = waterline.points.length - 1;
        var distx = waterline.points[l].x - waterline.points[l - 1].x;
        if (distx <= item.width) {
            distx *= scale;
            var disty = (waterline.points[l].y - waterline.points[l - 1].y) * scale;
            var diffx = this.pp.x - fp.x;
            var p = diffx / distx;       
            var dy = disty * p;         
            ppy = front.points[3].y + dy;
        }
    }
    front.points[2].y = ppy;


    point = waterline.points[0];
    px = (point.x - x) * scale;
    py = (point.y - y) * scale;
    pz = (item.z - z) * scale;
    if (pz < -(__fov - 1)) {
        var nz = __fov - 1;
        pz = -nz;
    }
    this.np.x = px;
    this.np.y = py;
    this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);

    ppy = this.pp.y;
    if (this.pp.x < front.points[front.points.length - 1].x) {
        var fp = front.points[front.points.length - 1];
        var distx = waterline.points[1].x - waterline.points[0].x;
        if (distx < item.width) {
            distx *= scale;
            var disty = (waterline.points[1].y - waterline.points[0].y) * scale;
            var diffx = fp.x - this.pp.x;
            var p = diffx / distx;       
            var dy = disty * p;         
            ppy = front.points[front.points.length - 2].y - dy;
        }
    }
    front.points[front.points.length - 1].y = ppy;
}