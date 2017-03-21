"use strict";

function Item3D() {
    
    this.line = new Line(new Point(0, 0), new Point(0, 0));
    this.polygon = new Polygon();

    this.left = false;
    this.right = false;
    
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.cp = new Point(0, 0);
    
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);

    this.projectedpolygon = new Polygon();
}

Item3D.prototype.createItem3D = function(item, renderer, window, width, height, waterline = null, debug = null) {
    
    item.geometry.projected.points.length = 0;
    
    if (item.geometry.fronts.length) item.geometry.fronts[0].points.length = 0;
    if (item.geometry.tops.length) item.geometry.tops[0].points.length = 0;
    if (item.geometry.sides.length) item.geometry.sides[0].points.length = 0;
    if (item.geometry.bottoms.length) item.geometry.bottoms[0].points.length = 0;
    
    if (!renderer.shouldThemeProject(item)) return;
    
    if (item.draw == false) {
        if (!debug || (!debug.level && !debug.render && !debug.hsr)) return;
    }
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
    } else {
        this.polygon.setPoints(box.getPoints());
    }

    if (waterline && waterline.flow && !item.waterline) {
        var fw = waterline.waterline;

        if (item.y >= fw) {
            return;
        }
        
        var tpt = item.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            var ppp = item.polygon.points[i];
            if (!ppp) continue;
            var tpp = this.polygon.points[i];
            if (!tpp) continue;
            
            if (item.y + ppp.y >= fw) {
                var ddd = (item.y + ppp.y) - fw;
                var ds = ddd * bs;
                //tpp.y -= ds;
                tpp.y -= ddd;
                if (tpp.y < 0) tpp.y = 0;
            }
        }
    }
    
    if (item.parts) this.polygon.translate(bx, by, scale * bs);

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
            if (this.projectedpolygon.points.length > 3) {
                this.projectedpolygon.points[0].x = this.p1.x;
                this.projectedpolygon.points[1].x = this.p2.x;
                this.projectedpolygon.points[2].x = this.p2.x;
                this.projectedpolygon.points[3].x = this.p1.x;
            }
        }
        
        if (!item.geometry.tops[0]) {
            var p = new Polygon();
            item.geometry.tops[0] = p;
        }
        item.geometry.tops[0].setPoints(this.projectedpolygon.getPoints());
    }
    
    if (item.bottom !== true) item.geometry.bottoms.length = 0;
}

