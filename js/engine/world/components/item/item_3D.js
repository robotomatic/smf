"use strict";

function Item3D() {
    this.left = false;
    this.right = false;
    this.top = false;
    this.bottom = false;
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
    this.projectItem3DSides(window, world, item, wc, x, y, width, height, depth, scale);
    this.projectItem3DTop(window, world, item, wc, x, y, width, height, depth, scale);
    this.projectItem3DBottom(window, world, item, wc, x, y, width, height, depth, scale);
}

Item3D.prototype.projectItem3DFront = function(window, world, item, wc, x, y, width, height, depth, scale) {
    if (item.geometry.visible.front.visible) item.geometry.front.showing = true;
    var points = item.box.getPoints();
    if (!world.worldrenderer.render.world) item.geometry.front.geometry.points.length = 0;
    if (!item.geometry.front.geometry.points.length) {
        item.geometry.front.geometry.updatePoints(points);
    }
    item.geometry.front.geometry.points[0].x = points[0].x - 1;
    item.geometry.front.geometry.points[0].y = points[0].y - 1;
    item.geometry.front.geometry.points[1].x = points[1].x + 1;
    item.geometry.front.geometry.points[1].y = points[1].y - 1;
    var px = (wc.x - x) * scale;
    this.left = points[0].x > px;    
    this.right = !this.left;
    var py = (wc.y - y) * scale;
    this.bottom = points[0].y < py;
    this.top = !this.bottom;
    item.geometry.front.geometry.points[2].x = points[2].x + 1;
    item.geometry.front.geometry.points[2].y = points[2].y;
    item.geometry.front.geometry.points[item.geometry.front.geometry.points.length - 1].x = points[3].x - 1;
    item.geometry.front.geometry.points[item.geometry.front.geometry.points.length - 1].y = points[3].y;
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

Item3D.prototype.projectItem3DSides = function(window, world, item, wc, x, y, width, height, depth, scale) {
    this.projectItem3DSidesLeft(window, world, item, wc, x, y, width, height, depth, scale);
    this.projectItem3DSidesRight(window, world, item, wc, x, y, width, height, depth, scale);
}

Item3D.prototype.projectItem3DSidesLeft = function(window, world, item, wc, x, y, width, height, depth, scale) {
    if (!item.geometry.visible.left.visible) return;
    if (!item.geometry.front.geometry.points.length) return;
    var t = item.geometry.front.geometry.points.length - 1;
    this.p1.x = round(item.geometry.front.geometry.points[t].x);
    this.p1.y = round(item.geometry.front.geometry.points[t].y);
    this.p2.x = round(item.geometry.front.geometry.points[0].x);
    this.p2.y = round(item.geometry.front.geometry.points[0].y);
    if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) return;
    item.geometry.left.geometry = project3D(this.p1, this.p2, depth, item.geometry.left.geometry, scale, x, y, wc, this.np1, this.np2);
    item.geometry.left.showing = this.left;
    if (world.worldrenderer.render.world) {
        if (item.watersurface.left.keys.length) {
            this.itemwaterline.projectItem3DWaterlineLeft(item, window, wc);
        }
    }
}
    
Item3D.prototype.projectItem3DSidesRight = function(window, world, item, wc, x, y, width, height, depth, scale) {
    if (!item.geometry.visible.right.visible) return;
    if (!item.geometry.front.geometry.points.length) return;
    this.p1.x = round(item.geometry.front.geometry.points[1].x);
    this.p1.y = round(item.geometry.front.geometry.points[1].y);
    this.p2.x = round(item.geometry.front.geometry.points[2].x);
    this.p2.y = round(item.geometry.front.geometry.points[2].y);
    if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) return;
    item.geometry.right.geometry = project3D(this.p1, this.p2, depth, item.geometry.right.geometry, scale, x, y, wc, this.np1, this.np2);
    item.geometry.right.showing = this.right;
    if (world.worldrenderer.render.world) {
        if (item.watersurface.right.keys.length) {
            this.itemwaterline.projectItem3DWaterlineRight(item, window, wc);
        }
    }
}

Item3D.prototype.projectItem3DTop = function(window, world, item, wc, x, y, width, height, depth, scale) {
    if (!item.geometry.visible.top.visible) return;
    if (!item.geometry.front.geometry.points.length) return;
    this.p1.x = round(item.geometry.front.geometry.points[0].x);
    this.p1.y = round(item.geometry.front.geometry.points[0].y);
    this.p2.x = round(item.geometry.front.geometry.points[1].x);
    this.p2.y = round(item.geometry.front.geometry.points[1].y);
    if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) return;
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
    item.geometry.top.showing = this.top;
}

Item3D.prototype.projectItem3DBottom = function(window, world, item, wc, x, y, width, height, depth, scale) {
    if (!item.geometry.visible.bottom.visible) return;
    if (!item.geometry.front.geometry.points.length) return;
    var t = item.geometry.front.geometry.points.length - 1;
    this.p1.x = round(item.geometry.front.geometry.points[t].x);
    this.p1.y = round(item.geometry.front.geometry.points[t].y);
    this.p2.x = round(item.geometry.front.geometry.points[2].x);
    this.p2.y = round(item.geometry.front.geometry.points[2].y);
    if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) return;
    item.geometry.bottom.geometry = project3D(this.p1, this.p2, depth, item.geometry.bottom.geometry, scale, x, y, wc, this.np1, this.np2);
    item.geometry.bottom.showing = this.bottom;
}
