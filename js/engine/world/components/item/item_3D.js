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
    
    this.polygon.setPoints(box.getPoints());
    
    item.underwater = false;
    if (waterline && waterline.flow && !item.waterline) {
        var fw = waterline.waterline;
        if (item.y >= fw) {
            item.underwater = true;
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
    this.projectItem3D(item, depth, scale, x, y, window, width, height);
}

Item3D.prototype.projectItem3D = function(item, depth, scale, x, y, window, width, height) {

    if (!this.polygon || !this.polygon.points) return;
    
    item.geometry.front.showing = true;
    item.geometry.top.showing = false;
    item.geometry.bottom.showing = false;
    item.geometry.left.showing = false;
    item.geometry.right.showing = false;
    
    item.geometry.front.geometry.setPoints(this.polygon.getPoints())
    
     if (item.width == "100%" && item.geometry.front.geometry.points.length > 3) {
         item.geometry.front.geometry.points[0].x = 0;
         item.geometry.front.geometry.points[1].x = width;
         item.geometry.front.geometry.points[2].x = width;
         item.geometry.front.geometry.points[3].x = 0;
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
        view.geometry.setPoints(this.projectedpolygon.getPoints());
        view.showing = true;
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
        var side = this.left ? item.geometry.left : item.geometry.right;
        side.geometry.setPoints(this.projectedpolygon.getPoints());
        side.showing = true;
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
                this.projectedpolygon.points[0].x = 0;
                this.projectedpolygon.points[1].x = width;
                this.projectedpolygon.points[2].x = width;
                this.projectedpolygon.points[3].x = 0;
                if (item.waterline) {
                    this.projectedpolygon.points[2].y += (height - this.projectedpolygon.points[2].y);
                    this.projectedpolygon.points[3].y +=  (height -this.projectedpolygon.points[3].y);
                }
            }
        }
        item.geometry.top.geometry.setPoints(this.projectedpolygon.getPoints());
        item.geometry.top.showing = true;
    }
}

