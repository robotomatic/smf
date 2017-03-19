"use strict";

function Item3D() {
    
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

Item3D.prototype.createItem3D = function(item, renderer, window, width, height, waterline = null) {
    
    item.geometry.projected.points.length = 0;
    
    if (item.geometry.fronts.length) item.geometry.fronts[0].points.length = 0;
    if (item.geometry.tops.length) item.geometry.tops[0].points.length = 0;
    if (item.geometry.sides.length) item.geometry.sides[0].points.length = 0;
    if (item.geometry.bottoms.length) item.geometry.bottoms[0].points.length = 0;
    
    if (!renderer.shouldThemeProject(item)) return;
    
    if (item.draw == false) return;
    if (item.scalefactor < 0) return;
    
    var x = window.x;
    var y = window.y;
    var scale = window.scale || 0;
    
    var top = item.top;
    var box = item.box;
    var bx = box.x;
    var by = box.y;
    var depth = box.depth;
    var bs = item.scalefactor;
    
    this.polygon.points.length = 0;
    if (item.parts) {
        var ip = item.getPolygon();
        this.polygon.setPoints(ip.getPoints());
        this.polygon.translate(bx, by, scale * bs);
    } else {
        this.polygon.setPoints(box.getPoints());
    }

    if (waterline && waterline.flow && !item.waterline) {
        var fw = waterline.waterline;

//        if (item.y > fw) {
//            return;
//        }
        
        var tpt = item.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            var ppp = item.polygon.points[i];
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

            if (item.y + ppp.y >= fw) {
                var ddd = (item.y + ppp.y) - fw;
                var ds = ddd * bs;
                tpp.y -= ds;
                if (tpp.y < 0) tpp.y = 0;
            }
        }
    }

    this.projectItem3D(item, depth, scale, x, y, window, width, height);
}

Item3D.prototype.projectItem3D = function(item, depth, scale, x, y, window, width, height) {

    if (!this.polygon || !this.polygon.points) return;
    
    if (!item.geometry.fronts[0]) item.geometry.fronts[0] = new Polygon(this.polygon.getPoints());
    else item.geometry.fronts[0].setPoints(this.polygon.getPoints())
    
    if (item.width == "100%") {
        item.geometry.fronts[0].points[0].x = 0;
        item.geometry.fronts[0].points[1].x = width;
        item.geometry.fronts[0].points[2].x = width;
        item.geometry.fronts[0].points[3].x = 0;
    }

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
            if (side) view = item.geometry.sides;
            else view = item.geometry.bottoms;
        } else {
            if (vert) view = item.geometry.sides;
            else {
                var ramptopleft = this.p1.x < this.p2.x && this.p1.y > this.p2.y;
                var ramptopright = this.p1.x < this.p2.x && this.p1.y < this.p2.y;
                var ramptop = ramptopleft || ramptopright;
                var rampbottomleft = this.p1.x > this.p2.x && this.p1.y > this.p2.y;
                var rampbottomright = this.p1.x > this.p2.x && this.p1.y < this.p2.y;
                var rampbottom = rampbottomleft || rampbottomright;
                if (ramptop) view = item.geometry.tops;
                else if (rampbottom) view = item.geometry.bottoms;
                else view = item.geometry.sides;
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
        
        if (!item.geometry.sides[0]) {
            var p = new Polygon();
            item.geometry.sides[0] = p;
        }
        
        item.geometry.sides[0].setPoints(this.projectedpolygon.getPoints());
    } else {
        if (item.geometry.sides && item.geometry.sides.length) item.geometry.sides[0].points.length = 0;
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
        
        if (item.width == "100%") {
            this.projectedpolygon.points[0].x = this.p1.x;
            this.projectedpolygon.points[1].x = this.p2.x;
            this.projectedpolygon.points[2].x = this.p1.x;
            this.projectedpolygon.points[3].x = this.p2.x;
        }
        
        if (!item.geometry.tops[0]) {
            var p = new Polygon();
            item.geometry.tops[0] = p;
        }
        item.geometry.tops[0].setPoints(this.projectedpolygon.getPoints());
    }
    
    if (item.bottom !== true) item.geometry.bottoms.length = 0;
    
    this.getItemProjectedGeometry();
}

Item3D.prototype.getItemProjectedGeometry = function() {
    
    if (!this.dopoly) return;

    // todo: need better poly-join codes
    
    var sides = false;
    var left = false;
    var right = false;
    if (item.geometry.sides.length && item.geometry.sides[0].points.length) {
        sides = true;
        if (item.geometry.sides[0].points[0].x < item.geometry.fronts[0].points[0].x) left = true;
        else right = true;
    }
    var top = item.geometry.tops.length > 0 && item.top !== false && item.geometry.visible.top.visible;
    var bottom = item.geometry.bottoms.length > 0 && item.bottom !== false;
    item.geometry.projected.points.length = 0;
    if (left && item.geometry.visible.left.visible) {
        item.geometry.projected.addPoint(item.geometry.sides[0].points[0]);
        if (top && item.geometry.tops.length && item.geometry.tops[0].points.length &&
            item.geometry.sides.length && item.geometry.sides[0].points.length == 4 &&
            item.geometry.fronts.length && item.geometry.fronts[0].points.length >= 3) {
            item.geometry.projected.addPoint(item.geometry.tops[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.tops[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[2]);
            item.geometry.projected.addPoint(item.geometry.sides[0].points[3]);
        } else if (bottom && item.geometry.bottoms.length && item.geometry.bottoms[0].points.length) {
            item.geometry.projected.addPoint(item.geometry.sides[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.bottoms[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.bottoms[0].points[1]);
        } else if (item.geometry.fronts.length && item.geometry.fronts[0].points.length == 4) {
            item.geometry.projected.addPoint(item.geometry.sides[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[2]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[3]);
        }
    } else if (right && item.geometry.visible.right.visible) {
        item.geometry.projected.addPoint(item.geometry.fronts[0].points[0]);
        if (top && item.geometry.tops.length && item.geometry.tops[0].points.length &&
            item.geometry.sides.length && item.geometry.sides[0].points.length == 4 &&
            item.geometry.fronts.length && item.geometry.fronts[0].points.length && item.geometry.fronts[0].points.length == 4) {
            item.geometry.projected.addPoint(item.geometry.tops[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.tops[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.sides[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.sides[0].points[2]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[3]);
        } else if (bottom && item.geometry.bottoms.length && item.geometry.bottoms[0].points.length && 
            item.geometry.visible.front.visible && item.geometry.fronts.length && item.geometry.fronts[0].points.length == 4) {
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.sides[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.sides[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.bottoms[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.bottoms[0].points[2]);
        } else if (item.geometry.fronts.length && item.geometry.fronts[0].points.length == 4) {
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.sides[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.sides[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[2]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[3]);
        }
    } else {
        if (top && item.geometry.visible.top.visible && item.geometry.tops.length && item.geometry.tops[0].points.length && 
            item.geometry.visible.front.visible && item.geometry.fronts.length && item.geometry.fronts[0].points.length == 4) {
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.tops[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.tops[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[2]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[3]);
        } else if (bottom && item.geometry.visible.bottom.visible && item.geometry.bottoms.length && item.geometry.bottoms[0].points.length &&
            item.geometry.visible.front.visible && item.geometry.fronts.length && item.geometry.fronts[0].points.length == 4) {
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[2]);
            item.geometry.projected.addPoint(item.geometry.bottoms[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.bottoms[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[3]);
        } else if (item.geometry.visible.front.visible && item.geometry.fronts.length && item.geometry.fronts[0].points.length == 4) {
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[0]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[1]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[2]);
            item.geometry.projected.addPoint(item.geometry.fronts[0].points[3]);
        }
    }
}
