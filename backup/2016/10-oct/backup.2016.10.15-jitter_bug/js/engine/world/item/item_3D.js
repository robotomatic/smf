"use strict";

function Item3D() {
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    
    this.cp = new Point(0, 0);
    this.np = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    
    this.polygon = new Polygon();
    
    
    this.projectedpolygon = new Polygon();
    
    this.polytop = new Polygon();

    this.top = new Polygon();
    
    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    
    this.topsidecolor = "red";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
    
    this.colortop = "red";
    this.colorsides = "white";
    this.colorbottom = "blue";
}

Item3D.prototype.createItem3D = function(item, renderer, window, x, y, scale, floodlevel) {

    if (!renderer.shouldThemeProject(item)) return;
    if (item.draw == false) return;
    
    if (item.scalefactor < 0) return;
    
    var top = item.top;
    
    var box = item.box;
    var bx = box.x;
    var by = box.y;

    var depth = item.depth * scale;
    var bs = item.scalefactor;
    depth *= bs;
    
    this.polygon.points.length = 0;
    
    if (item.parts) {
        var ip = item.getPolygon();
        this.polygon.setPoints(ip.getPoints());
        this.polygon.translate(bx, by, scale * bs);
    } else {
        this.polygon.setPoints(box.getPoints());
    }

    if (floodlevel) {
        var tpt = this.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            if (this.polygon.points[i].y > floodlevel) this.polygon.points[i].y = floodlevel;
        }
    }

    item.geometry.fronts.length = 0;
    item.geometry.tops.length = 0;
    item.geometry.sides.length = 0;
    item.geometry.bottoms.length = 0;
    
    this.projectItem3D(item, depth, scale, x, y, window);
}

Item3D.prototype.projectItem3D = function(item, depth, scale, x, y, window) {

    if (!this.polygon || !this.polygon.points) return;
    
    
    item.geometry.fronts[item.geometry.fronts.length] = new Polygon(this.polygon.getPoints());

    var wc = window.getCenter();
    var t = this.polygon.points.length;
    for (var i = 1; i < t; i++) {
        
        this.p1.x = round(this.polygon.points[i - 1].x);
        this.p2.x = round(this.polygon.points[i].x);
        
        if (this.p1.x < this.p2.x) continue;
        
        this.p1.y = round(this.polygon.points[i - 1].y);
        this.p2.y = round(this.polygon.points[i].y);

        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        
        var horiz = Math.abs(this.p1.y - this.p2.y) < 3;
        var vert = Math.abs(this.p1.x - this.p2.x) < 3;
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
        
        var p = new Polygon();
        p.setPoints(this.projectedpolygon.getPoints());
        view[view.length] = p;
    }
    
    this.p1.x = round(this.polygon.points[t - 1].x);
    this.p1.y = round(this.polygon.points[t- 1].y);
    this.p2.x = round(this.polygon.points[0].x);
    this.p2.y = round(this.polygon.points[0].y);

    if (shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) {
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        var p = new Polygon();
        p.setPoints(this.projectedpolygon.getPoints());
        item.geometry.sides[item.geometry.sides.length] = p;
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
        var p = new Polygon();
        p.setPoints(this.projectedpolygon.getPoints());
        item.geometry.tops[item.geometry.tops.length] = p;
    }
}




Item3D.prototype.renderItem3D = function(now, ctx, item, renderer, x, y) {

    if (!renderer.shouldThemeProject(item)) return;
    if (item.draw == false) return;
    
    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    this.topsidecolor = "red";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
    
    var top = item.top;
    var topcolor = this.topcolor;
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (theme) {
        var tc = theme.material && theme.material.color ? theme.material.color.projected : theme.color.projected;
        if (tc) {
            if (tc.top) topcolor = tc.top;
            if (tc.side) this.sidecolor = tc.side;
            if (tc.bottom) this.bottomcolor = tc.bottom;
        }
        if (theme.top && theme.top.color) {
            var ttc = theme.top.color.projected;
            if (ttc.top) topcolor = ttc.top;
            if (ttc.side) this.topsidecolor = ttc.side;
            if (ttc.bottom) this.topbottomcolor = ttc.bottom;
        }
    }
    
    this.renderItemParts3D(ctx, item.geometry.fronts, this.sidecolor, x, y);
    this.renderItemParts3D(ctx, item.geometry.sides, this.sidecolor, x, y);
    if (!top) this.renderItemParts3D(ctx, item.geometry.bottoms, this.bottomcolor, x, y);
    this.renderItemParts3D(ctx, item.geometry.tops, topcolor, x, y);
}

Item3D.prototype.renderItemParts3D = function(ctx, parts, color, x, y) {
    ctx.beginPath();
    ctx.fillStyle = color;
    var t = parts.length;
    for (var i = 0; i < t; i++) {
        var p = parts[i];
        p.translate(-x, -y, 1);
        p.path(ctx);
    }
    ctx.fill();
}