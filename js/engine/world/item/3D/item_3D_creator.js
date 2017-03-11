"use strict";

function Item3DCreator(item3d) {
    this.item3d = item3d;
    
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.cp = new Point(0, 0);
    
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);

    this.projectedpolygon = new Polygon();
}

Item3DCreator.prototype.createItem3D = function(renderer, window, flood = null) {
    
    this.item3d.item.geometry.projected.points.length = 0;
    
    if (this.item3d.item.geometry.fronts.length) this.item3d.item.geometry.fronts[0].points.length = 0;
    if (this.item3d.item.geometry.tops.length) this.item3d.item.geometry.tops[0].points.length = 0;
    if (this.item3d.item.geometry.sides.length) this.item3d.item.geometry.sides[0].points.length = 0;
    if (this.item3d.item.geometry.bottoms.length) this.item3d.item.geometry.bottoms[0].points.length = 0;
    
    if (!renderer.shouldThemeProject(this.item3d.item)) return;
    
    if (this.item3d.item.draw == false) return;
    if (this.item3d.item.scalefactor < 0) return;
    
    var x = window.x;
    var y = window.y;
    var scale = window.scale || 0;
    
    var top = this.item3d.item.top;
    var box = this.item3d.item.box;
    var bx = box.x;
    var by = box.y;
    var depth = box.depth;
    var bs = this.item3d.item.scalefactor;
    
    this.item3d.polygon.points.length = 0;
    if (this.item3d.item.parts) {
        var ip = this.item3d.item.getPolygon();
        this.item3d.polygon.setPoints(ip.getPoints());
        this.item3d.polygon.translate(bx, by, scale * bs);
    } else {
        this.item3d.polygon.setPoints(box.getPoints());
    }

    
    
    if (flood) {
        
        var fw = flood.waterline;
        
        var tpt = this.item3d.item.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            var ppp = this.item3d.item.polygon.points[i];
            
            //      
            // TODO: Need to project waterline
            //
            /*
            var wc = window.getCenter();
            var h = (wc.y - y) * scale;
            var depth = box.z;
            var fw = projectPoint3DCoord(flood.waterline, depth, h);
            */

            if (this.item3d.item.y + ppp.y >= fw) {
                var ddd = (this.item3d.item.y + ppp.y) - fw;
                var ds = ddd * bs;
                this.item3d.polygon.points[i].y -= ds;
            }
        }
    }
    
    
    
    this.projectItem3D(depth, scale, x, y, window);
}

Item3DCreator.prototype.projectItem3D = function(depth, scale, x, y, window) {

    if (!this.item3d.polygon || !this.item3d.polygon.points) return;
    
    if (!this.item3d.item.geometry.fronts[0]) this.item3d.item.geometry.fronts[0] = new Polygon(this.item3d.polygon.getPoints());
    else this.item3d.item.geometry.fronts[0].setPoints(this.item3d.polygon.getPoints())

    var wc = window.getCenter();
    var t = this.item3d.polygon.points.length;
    for (var i = 1; i < t; i++) {
        
        this.p1.x = round(this.item3d.polygon.points[i - 1].x);
        this.p2.x = round(this.item3d.polygon.points[i].x);
        
        if (this.p1.x < this.p2.x) continue;
        
        this.p1.y = round(this.item3d.polygon.points[i - 1].y);
        this.p2.y = round(this.item3d.polygon.points[i].y);

        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        
        var horiz = abs(this.p1.y - this.p2.y) < 3;
        var vert = abs(this.p1.x - this.p2.x) < 3;
        var top = horiz && (this.p1.x < this.p2.x);
        var bottom = horiz && !top;
        var left = vert && (this.p1.y > this.p2.y);
        var right = vert && !left;
        var side = left || right;

        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);

        if (this.p1.x < this.p2.x) continue;
        
        var view = null;
        if (horiz) {
            if (side) view = this.item3d.item.geometry.sides;
            else view = this.item3d.item.geometry.bottoms;
        } else {
            if (vert) view = this.item3d.item.geometry.sides;
            else {
                var ramptopleft = this.p1.x < this.p2.x && this.p1.y > this.p2.y;
                var ramptopright = this.p1.x < this.p2.x && this.p1.y < this.p2.y;
                var ramptop = ramptopleft || ramptopright;
                var rampbottomleft = this.p1.x > this.p2.x && this.p1.y > this.p2.y;
                var rampbottomright = this.p1.x > this.p2.x && this.p1.y < this.p2.y;
                var rampbottom = rampbottomleft || rampbottomright;
                if (ramptop) view = this.item3d.item.geometry.tops;
                else if (rampbottom) view = this.item3d.item.geometry.bottoms;
                else view = this.item3d.item.geometry.sides;
            }
        }
        
        if (!view[0]) {
            var p = new Polygon();
            view[0] = p;
        }
        view[0].setPoints(this.projectedpolygon.getPoints());
    }

    var px = (wc.x - x) * scale;
    this.item3d.left = this.p1.x > px;
    this.item3d.right = !this.item3d.left;
    
    if (this.item3d.left) {
        this.p1.x = round(this.item3d.polygon.points[t - 1].x);
        this.p1.y = round(this.item3d.polygon.points[t - 1].y);
        this.p2.x = round(this.item3d.polygon.points[0].x);
        this.p2.y = round(this.item3d.polygon.points[0].y);
    } else {
        this.p1.x = round(this.item3d.polygon.points[1].x);
        this.p1.y = round(this.item3d.polygon.points[1].y);
        this.p2.x = round(this.item3d.polygon.points[2].x);
        this.p2.y = round(this.item3d.polygon.points[2].y);
    }
    
    if (shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) {
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        
        if (!this.item3d.item.geometry.sides[0]) {
            var p = new Polygon();
            this.item3d.item.geometry.sides[0] = p;
        }
        
        this.item3d.item.geometry.sides[0].setPoints(this.projectedpolygon.getPoints());
    } else {
        if (this.item3d.item.geometry.sides && this.item3d.item.geometry.sides.length) this.item3d.item.geometry.sides[0].points.length = 0;
    }
    
    var t = this.item3d.polygon.points.length;
    for (var i = 1; i < t; i++) {
        this.p1.x = round(this.item3d.polygon.points[i - 1].x);
        this.p2.x = round(this.item3d.polygon.points[i].x);
        if (this.p1.x >= this.p2.x) continue;
        this.p1.y = round(this.item3d.polygon.points[i - 1].y);
        this.p2.y = round(this.item3d.polygon.points[i].y);
        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        
        if (this.item3d.item.width == "100%") {
            this.projectedpolygon.points[0].x = this.p1.x;
            this.projectedpolygon.points[1].x = this.p2.x;
        }
        
        if (!this.item3d.item.geometry.tops[0]) {
            var p = new Polygon();
            this.item3d.item.geometry.tops[0] = p;
        }
        this.item3d.item.geometry.tops[0].setPoints(this.projectedpolygon.getPoints());
    }
    
    if (this.item3d.item.bottom !== true) this.item3d.item.geometry.bottoms.length = 0;
    
    this.getItemProjectedGeometry();
}

Item3DCreator.prototype.getItemProjectedGeometry = function() {
    
    if (!this.item3d.dopoly) return;

    // todo: need better poly-join codes
    
    var sides = false;
    var left = false;
    var right = false;
    if (this.item3d.item.geometry.sides.length && this.item3d.item.geometry.sides[0].points.length) {
        sides = true;
        if (this.item3d.item.geometry.sides[0].points[0].x < this.item3d.item.geometry.fronts[0].points[0].x) left = true;
        else right = true;
    }
    var top = this.item3d.item.geometry.tops.length > 0 && this.item3d.item.top !== false && this.item3d.item.geometry.visible.top.visible;
    var bottom = this.item3d.item.geometry.bottoms.length > 0 && this.item3d.item.bottom !== false;
    this.item3d.item.geometry.projected.points.length = 0;
    if (left && this.item3d.item.geometry.visible.left.visible) {
        this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[0]);
        if (top && this.item3d.item.geometry.tops.length && this.item3d.item.geometry.tops[0].points.length &&
            this.item3d.item.geometry.sides.length && this.item3d.item.geometry.sides[0].points.length == 4 &&
            this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length >= 3) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.tops[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.tops[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[2]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[3]);
        } else if (bottom && this.item3d.item.geometry.bottoms.length && this.item3d.item.geometry.bottoms[0].points.length) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.bottoms[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.bottoms[0].points[1]);
        } else if (this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length == 4) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[2]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[3]);
        }
    } else if (right && this.item3d.item.geometry.visible.right.visible) {
        this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[0]);
        if (top && this.item3d.item.geometry.tops.length && this.item3d.item.geometry.tops[0].points.length &&
            this.item3d.item.geometry.sides.length && this.item3d.item.geometry.sides[0].points.length == 4 &&
            this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length && this.item3d.item.geometry.fronts[0].points.length == 4) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.tops[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.tops[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[2]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[3]);
        } else if (bottom && this.item3d.item.geometry.bottoms.length && this.item3d.item.geometry.bottoms[0].points.length && 
            this.item3d.item.geometry.visible.front.visible && this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length == 4) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.bottoms[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.bottoms[0].points[2]);
        } else if (this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length == 4) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.sides[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[2]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[3]);
        }
    } else {
        if (top && this.item3d.item.geometry.visible.top.visible && this.item3d.item.geometry.tops.length && this.item3d.item.geometry.tops[0].points.length && 
            this.item3d.item.geometry.visible.front.visible && this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length == 4) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.tops[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.tops[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[2]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[3]);
        } else if (bottom && this.item3d.item.geometry.visible.bottom.visible && this.item3d.item.geometry.bottoms.length && this.item3d.item.geometry.bottoms[0].points.length &&
            this.item3d.item.geometry.visible.front.visible && this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length == 4) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[2]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.bottoms[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.bottoms[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[3]);
        } else if (this.item3d.item.geometry.visible.front.visible && this.item3d.item.geometry.fronts.length && this.item3d.item.geometry.fronts[0].points.length == 4) {
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[0]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[1]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[2]);
            this.item3d.item.geometry.projected.addPoint(this.item3d.item.geometry.fronts[0].points[3]);
        }
    }
}
