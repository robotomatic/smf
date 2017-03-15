"use strict";

function Item3D(item) {
    
    this.item = item;
    
    this.line = new Line(new Point(0, 0), new Point(0, 0));
    this.polygon = new Polygon();

    this.left = false;
    this.right = false;
    
    this.dopoly = false;

    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.cp = new Point(0, 0);
    
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);

    this.projectedpolygon = new Polygon();
}

Item3D.prototype.createItem3D = function(renderer, window, waterline = null) {
    
    this.item.geometry.projected.points.length = 0;
    
    if (this.item.geometry.fronts.length) this.item.geometry.fronts[0].points.length = 0;
    if (this.item.geometry.tops.length) this.item.geometry.tops[0].points.length = 0;
    if (this.item.geometry.sides.length) this.item.geometry.sides[0].points.length = 0;
    if (this.item.geometry.bottoms.length) this.item.geometry.bottoms[0].points.length = 0;
    
    if (!renderer.shouldThemeProject(this.item)) return;
    
    if (this.item.draw == false) return;
    if (this.item.scalefactor < 0) return;
    
    var x = window.x;
    var y = window.y;
    var scale = window.scale || 0;
    
    var top = this.item.top;
    var box = this.item.box;
    var bx = box.x;
    var by = box.y;
    var depth = box.depth;
    var bs = this.item.scalefactor;
    
    this.polygon.points.length = 0;
    if (this.item.parts) {
        var ip = this.item.getPolygon();
        this.polygon.setPoints(ip.getPoints());
        this.polygon.translate(bx, by, scale * bs);
    } else {
        this.polygon.setPoints(box.getPoints());
    }

    if (waterline) {
        var fw = waterline.waterline;

//        if (this.item.y > fw) {
//            return;
//        }
        
        var tpt = this.item.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            var ppp = this.item.polygon.points[i];
            if (!ppp) continue;
            var tpp = this.polygon.points[i];
            if (!tpp) continue;
            
            //      
            // TODO: Need to project waterline
            //
            /*
            var wc = window.getCenter();
            var h = (wc.y - y) * scale;
            var depth = box.z;
            var fw = projectPoint3DCoord(waterline.waterline, depth, h);
            */

            if (this.item.y + ppp.y >= fw) {
                var ddd = (this.item.y + ppp.y) - fw;
                var ds = ddd * bs;
                tpp.y -= ds;
                if (tpp.y < 0) tpp.y = 0;
            }
        }
    }
    
    
    
    this.projectItem3D(depth, scale, x, y, window);
}

Item3D.prototype.projectItem3D = function(depth, scale, x, y, window) {

    if (!this.polygon || !this.polygon.points) return;
    
    if (!this.item.geometry.fronts[0]) this.item.geometry.fronts[0] = new Polygon(this.polygon.getPoints());
    else this.item.geometry.fronts[0].setPoints(this.polygon.getPoints())

    var wc = window.getCenter();
    var t = this.polygon.points.length;
    for (var i = 1; i < t; i++) {
        
        this.p1.x = round(this.polygon.points[i - 1].x);
        this.p2.x = round(this.polygon.points[i].x);
        
        if (this.p1.x < this.p2.x) continue;
        
        this.p1.y = round(this.polygon.points[i - 1].y);
        this.p2.y = round(this.polygon.points[i].y);

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
            if (side) view = this.item.geometry.sides;
            else view = this.item.geometry.bottoms;
        } else {
            if (vert) view = this.item.geometry.sides;
            else {
                var ramptopleft = this.p1.x < this.p2.x && this.p1.y > this.p2.y;
                var ramptopright = this.p1.x < this.p2.x && this.p1.y < this.p2.y;
                var ramptop = ramptopleft || ramptopright;
                var rampbottomleft = this.p1.x > this.p2.x && this.p1.y > this.p2.y;
                var rampbottomright = this.p1.x > this.p2.x && this.p1.y < this.p2.y;
                var rampbottom = rampbottomleft || rampbottomright;
                if (ramptop) view = this.item.geometry.tops;
                else if (rampbottom) view = this.item.geometry.bottoms;
                else view = this.item.geometry.sides;
            }
        }
        
        if (!view[0]) {
            var p = new Polygon();
            view[0] = p;
        }
        view[0].setPoints(this.projectedpolygon.getPoints());
    }

    var px = (wc.x - x) * scale;
    this.left = this.p1.x > px;
    this.right = !this.left;
    
    if (this.left) {
        if (this.polygon.points.length) {
            this.p1.x = round(this.polygon.points[t - 1].x);
            this.p1.y = round(this.polygon.points[t - 1].y);
            this.p2.x = round(this.polygon.points[0].x);
            this.p2.y = round(this.polygon.points[0].y);
        }
    } else {
        if (this.polygon.points.length > 2) {
            this.p1.x = round(this.polygon.points[1].x);
            this.p1.y = round(this.polygon.points[1].y);
            this.p2.x = round(this.polygon.points[2].x);
            this.p2.y = round(this.polygon.points[2].y);
        }
    }
    
    if (shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) {
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        
        if (!this.item.geometry.sides[0]) {
            var p = new Polygon();
            this.item.geometry.sides[0] = p;
        }
        
        this.item.geometry.sides[0].setPoints(this.projectedpolygon.getPoints());
    } else {
        if (this.item.geometry.sides && this.item.geometry.sides.length) this.item.geometry.sides[0].points.length = 0;
    }
    
    var t = this.polygon.points.length;
    for (var i = 1; i < t; i++) {
        this.p1.x = round(this.polygon.points[i - 1].x);
        this.p2.x = round(this.polygon.points[i].x);
        if (this.p1.x >= this.p2.x) continue;
        this.p1.y = round(this.polygon.points[i - 1].y);
        this.p2.y = round(this.polygon.points[i].y);
        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        
        if (this.item.width == "100%") {
            this.projectedpolygon.points[0].x = this.p1.x;
            this.projectedpolygon.points[1].x = this.p2.x;
        }
        
        if (!this.item.geometry.tops[0]) {
            var p = new Polygon();
            this.item.geometry.tops[0] = p;
        }
        this.item.geometry.tops[0].setPoints(this.projectedpolygon.getPoints());
    }
    
    if (this.item.bottom !== true) this.item.geometry.bottoms.length = 0;
    
    this.getItemProjectedGeometry();
}

Item3D.prototype.getItemProjectedGeometry = function() {
    
    if (!this.dopoly) return;

    // todo: need better poly-join codes
    
    var sides = false;
    var left = false;
    var right = false;
    if (this.item.geometry.sides.length && this.item.geometry.sides[0].points.length) {
        sides = true;
        if (this.item.geometry.sides[0].points[0].x < this.item.geometry.fronts[0].points[0].x) left = true;
        else right = true;
    }
    var top = this.item.geometry.tops.length > 0 && this.item.top !== false && this.item.geometry.visible.top.visible;
    var bottom = this.item.geometry.bottoms.length > 0 && this.item.bottom !== false;
    this.item.geometry.projected.points.length = 0;
    if (left && this.item.geometry.visible.left.visible) {
        this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[0]);
        if (top && this.item.geometry.tops.length && this.item.geometry.tops[0].points.length &&
            this.item.geometry.sides.length && this.item.geometry.sides[0].points.length == 4 &&
            this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length >= 3) {
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[3]);
        } else if (bottom && this.item.geometry.bottoms.length && this.item.geometry.bottoms[0].points.length) {
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[1]);
        } else if (this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length == 4) {
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        }
    } else if (right && this.item.geometry.visible.right.visible) {
        this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
        if (top && this.item.geometry.tops.length && this.item.geometry.tops[0].points.length &&
            this.item.geometry.sides.length && this.item.geometry.sides[0].points.length == 4 &&
            this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length && this.item.geometry.fronts[0].points.length == 4) {
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        } else if (bottom && this.item.geometry.bottoms.length && this.item.geometry.bottoms[0].points.length && 
            this.item.geometry.visible.front.visible && this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length == 4) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[2]);
        } else if (this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length == 4) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        }
    } else {
        if (top && this.item.geometry.visible.top.visible && this.item.geometry.tops.length && this.item.geometry.tops[0].points.length && 
            this.item.geometry.visible.front.visible && this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length == 4) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        } else if (bottom && this.item.geometry.visible.bottom.visible && this.item.geometry.bottoms.length && this.item.geometry.bottoms[0].points.length &&
            this.item.geometry.visible.front.visible && this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length == 4) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        } else if (this.item.geometry.visible.front.visible && this.item.geometry.fronts.length && this.item.geometry.fronts[0].points.length == 4) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        }
    }
}