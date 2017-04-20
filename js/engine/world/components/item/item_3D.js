"use strict";

function Item3D() {
    this.left = false;
    this.right = false;
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.cp = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    this.itemwaterline = new Item3DWaterline();
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
    this.projectItem3D(window, world, item, x, y, width, height, depth, scale);
}

Item3D.prototype.projectItem3D = function(window, world, item, x, y, width, height, depth, scale) {
    var wc = window.getCenter();
    this.projectItem3DFront(window, world, item, wc, x, y, width, height, depth, scale);
    this.projectItem3DSides(item, wc, x, y, width, height, depth, scale);
    this.projectItem3DTop(item, wc, x, y, width, height, depth, scale);
}




Item3D.prototype.projectItem3DFront = function(window, world, item, wc, x, y, width, height, depth, scale) {
    item.geometry.front.showing = true;
    
    var points = item.box.getPoints();
    if (!item.geometry.front.geometry.points.length) {
        item.geometry.front.geometry.updatePoints(points);
    } else {
        item.geometry.front.geometry.points[0].x = points[0].x - 1;
        item.geometry.front.geometry.points[0].y = points[0].y - 1;
        item.geometry.front.geometry.points[1].x = points[1].x + 1;
        item.geometry.front.geometry.points[1].y = points[1].y - 1;
        item.geometry.front.geometry.points[2].x = points[2].x + 1;
        item.geometry.front.geometry.points[2].y = points[2].y;
        item.geometry.front.geometry.points[item.geometry.front.geometry.points.length - 1].x = points[3].x - 1;
        item.geometry.front.geometry.points[item.geometry.front.geometry.points.length - 1].y = points[3].y;
    }
    
    if (world.worldrenderer.render.world) {
        if (item.watersurface.front.keys.length) {
            this.itemwaterline.projectItem3DWaterlineFront(item, window, wc);
        }
    }
    if (item.width == "100%" && item.geometry.front.geometry.points.length > 3) {
         item.geometry.front.geometry.points[0].x = 0;
         item.geometry.front.geometry.points[1].x = width;
         item.geometry.front.geometry.points[2].x = width;
         item.geometry.front.geometry.points[item.geometry.front.geometry.points.length - 1].x = 0;
     }
}

Item3D.prototype.projectItem3DSides = function(item, wc, x, y, width, height, depth, scale) {
    this.p1.x = round(item.geometry.front.geometry.points[1].x);
    this.p2.x = round(item.geometry.front.geometry.points[2].x);
    this.p1.y = round(item.geometry.front.geometry.points[1].y);
    this.p2.y = round(item.geometry.front.geometry.points[2].y);

    if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) return;
        
    var horiz = abs(this.p1.y - this.p2.y) < 3;
    var vert = abs(this.p1.x - this.p2.x) < 3;
    var top = horiz && (this.p1.x < this.p2.x);
    var bottom = horiz && !top;
    var left = vert && (this.p1.y > this.p2.y);
    var right = vert && !left;
    var side = left || right;

    if (this.p1.x < this.p2.x) return;

    var view = null;
    if (horiz) {
        if (side) view = left ? item.geometry.left : item.geometry.right;
        else view = item.geometry.bottom;
    } else {
        if (vert) view = left ? item.geometry.left : item.geometry.right;
        else {
            view = left ? item.geometry.left : item.geometry.right;
        }
    }
    view.geometry = project3D(this.p1, this.p2, depth, view.geometry, scale, x, y, wc, this.np1, this.np2);
    view.showing = true;

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
}

Item3D.prototype.projectItem3DTop = function(item, wc, x, y, width, height, depth, scale) {
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
                item.geometry.top.geometry.points[item.geometry.top.geometry.points.length - 1].x = 0;
                if (item.waterline) {
                    item.geometry.top.geometry.points[2].y += (height - item.geometry.top.geometry.points[2].y);
                    var hy = height - item.geometry.top.geometry.points[item.geometry.top.geometry.points.length - 1].y;
                    item.geometry.top.geometry.points[item.geometry.top.geometry.points.length - 1].y += hy;
                }
            }
        }
        item.geometry.top.showing = true;
    }
}