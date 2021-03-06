"use strict";

function Item3D(item) {
    this.item = item;
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
    this.dotop = false;
    this.frontcolor = "red";
    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    this.topsidecolor = "black";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
    this.colortop = "green";
    this.colorsides = "white";
    this.colorbottom = "blue";
}

Item3D.prototype.createItem3D = function(renderer, window, floodlevel = null) {
    
    this.item.geometry.projected.points.length = 0;
    this.item.geometry.fronts.length = 0;
    this.item.geometry.tops.length = 0;
    this.item.geometry.sides.length = 0;
    this.item.geometry.bottoms.length = 0;
    
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
    
    if (floodlevel) {
        var tpt = this.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            if (this.polygon.points[i].y > floodlevel) this.polygon.points[i].y = floodlevel;
        }
    }
    this.projectItem3D(depth, scale, x, y, window);
}

Item3D.prototype.projectItem3D = function(depth, scale, x, y, window) {

    if (!this.polygon || !this.polygon.points) return;
    
    this.item.geometry.fronts[this.item.geometry.fronts.length] = new Polygon(this.polygon.getPoints());

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
        
        var p = new Polygon();
        p.setPoints(this.projectedpolygon.getPoints());
        view[view.length] = p;
    }
    
    this.p1.x = round(this.polygon.points[t - 1].x);
    this.p1.y = round(this.polygon.points[t - 1].y);
    this.p2.x = round(this.polygon.points[0].x);
    this.p2.y = round(this.polygon.points[0].y);

    if (shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) {
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        var p = new Polygon();
        p.setPoints(this.projectedpolygon.getPoints());
        this.item.geometry.sides[this.item.geometry.sides.length] = p;
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
        
        var p = new Polygon();
        p.setPoints(this.projectedpolygon.getPoints());
        this.item.geometry.tops[this.item.geometry.tops.length] = p;
    }
    
    if (this.item.bottom !== true) this.item.geometry.bottoms.length = 0;
    
    this.getItemProjectedGeometry();
}

Item3D.prototype.getItemProjectedGeometry = function() {
    
    // todo: need better poly-join codes
    
    var sides = false;
    var left = false;
    var right = false;
    if (this.item.geometry.sides.length) {
        sides = true;
        if (this.item.geometry.sides[0].points[0].x < this.item.geometry.fronts[0].points[0].x) left = true;
        else right = true;
    }
    var top = this.item.geometry.tops.length > 0 && this.item.top !== false;
    var bottom = this.item.geometry.bottoms.length > 0 && this.item.bottom !== false;
    this.item.geometry.projected.points.length = 0;
    if (left) {
        this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[0]);
        if (top) {
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[3]);
        } else if (bottom) {
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[1]);
        } else {
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        }
    } else if (right) {
        this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
        if (top) {
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        } else if (bottom) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[2]);
        } else {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.sides[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        }
    } else {
        if (top) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.tops[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        } else if (bottom) {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.bottoms[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        } else {
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[0]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[1]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[2]);
            this.item.geometry.projected.addPoint(this.item.geometry.fronts[0].points[3]);
        }
    }
}




Item3D.prototype.renderItem3D = function(now, ctx, renderer) {
    if (!renderer.shouldThemeProject(this.item)) return;
    if (this.item.draw == false) return;
    var x = this.item.projectedlocation.x;
    var y = this.item.projectedlocation.y;
    this.getColors(renderer);
    
    this.polygon.setPoints(this.item.geometry.projected.points);
    this.polygon.translate(-x, -y, 1);
    ctx.fillStyle = this.sidecolor;
    ctx.beginPath();
    this.polygon.draw(ctx);
    
    this.renderItemParts3D(ctx, this.item.geometry.fronts, this.frontcolor, x, y);
    this.renderItemParts3D(ctx, this.item.geometry.sides, this.sidecolor, x, y);
    if (this.item.bottom === true) {
        this.renderItemParts3D(ctx, this.item.geometry.bottoms, this.bottomcolor, x, y);
    }
    if (this.dotop) this.renderItemParts3D(ctx, this.item.geometry.tops, this.topcolor, x, y);
}

Item3D.prototype.getColors = function(renderer) {
    this.frontcolor = "pink";
    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    this.topsidecolor = "black";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
    var topcolor = this.topcolor;
    var theme = (renderer && renderer.theme) ? renderer.theme.items[this.item.itemtype] : null;
    if (!theme) return;
    this.dotop = this.item.top === false ? false : true;
    if (theme.top === false) this.dotop = false;
    var themecolor = "red";
    var mat = theme.material;
    if (mat) {
        var mmm = renderer.materials.materials[mat];
        if (mmm) {
            if (mmm.color && mmm.color.projected) {
                themecolor = mmm.color.projected;    
            }
        }
    } else if (theme.color && theme.color.projected) {
        themecolor = theme.color.projected;
    }
    if (!themecolor) return;
    if (themecolor.top) this.topcolor = themecolor.top;
    if (themecolor.side) this.sidecolor = themecolor.side;
    if (themecolor.bottom) this.bottomcolor = themecolor.bottom;
    this.frontcolor = themecolor.front ? themecolor.front : this.sidecolor;
}
    
Item3D.prototype.renderItemParts3D = function(ctx, parts, color, x, y) {
    ctx.beginPath();
    ctx.fillStyle = color;
    var t = parts.length;
    for (var i = 0; i < t; i++) {
        var p = parts[i];
        this.polygon.setPoints(p.points);
        this.polygon.translate(-x, -y, 1);
        this.polygon.path(ctx);
    }
    ctx.fill();
}