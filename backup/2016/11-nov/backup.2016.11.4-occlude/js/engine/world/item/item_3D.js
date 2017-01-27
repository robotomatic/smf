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

Item3D.prototype.createItem3D = function(item, renderer, window, x, y, scale = 0, floodlevel = null) {

    item.geometry.fronts.length = 0;
    item.geometry.tops.length = 0;
    item.geometry.sides.length = 0;
    item.geometry.bottoms.length = 0;
    
    if (!renderer.shouldThemeProject(item)) return;
    if (item.draw == false) return;
    
    if (item.scalefactor < 0) return;
    
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

    if (floodlevel) {
        var tpt = this.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            if (this.polygon.points[i].y > floodlevel) this.polygon.points[i].y = floodlevel;
        }
    }
    
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
    this.p1.y = round(this.polygon.points[t - 1].y);
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
        
        if (item.width == "100%") {
            this.projectedpolygon.points[0].x = this.p1.x;
            this.projectedpolygon.points[1].x = this.p2.x;
        }
        
        var p = new Polygon();
        p.setPoints(this.projectedpolygon.getPoints());
        item.geometry.tops[item.geometry.tops.length] = p;
    }
}




Item3D.prototype.renderItem3D = function(now, octx, item, renderer, mbr, window, owidth, oheight) {
    
    if (!renderer.shouldThemeProject(item)) return;
    if (item.draw == false) return;

    
    
    
    
    // this gotta move
    // also gotta pad canvas a bit
    clearRect(item.ctx, 0, 0, item.canvas.width, item.canvas.height);
    var imbr = item.getProjectedMbr();
    var x = imbr.x;
    var y = imbr.y;
    var width = imbr.width;
    var height = imbr.height;
    if (x < 0) {
        width += x;
        x = 0;
    }
    if (y < 0) {
        height += y;
        y = 0;
    }
    if (x + width > owidth) width = owidth - x;
    if (y + height > oheight) height = oheight - y;
    item.canvas.width = width;
    item.canvas.height = height;
    var ctx = item.ctx;

    
    
    
    
    this.frontcolor = "pink";
    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    this.topsidecolor = "black";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
    
    var topcolor = this.topcolor;
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (!theme) return;

    var top = item.top === false ? false : true;
    if (theme.top === false) top = false;
    
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
    
    if (themecolor.top) topcolor = themecolor.top;
    if (themecolor.side) this.sidecolor = themecolor.side;
    if (themecolor.bottom) this.bottomcolor = themecolor.bottom;
    this.frontcolor = themecolor.front ? themecolor.front : this.sidecolor;
    
    // todo: create megapoly and draw first in sidecolor!!
    
    this.renderItemParts3D(ctx, item.geometry.fronts, this.frontcolor, x, y);
    this.renderItemParts3D(ctx, item.geometry.sides, this.sidecolor, x, y);
    if (item.bottom === true) this.renderItemParts3D(ctx, item.geometry.bottoms, this.bottomcolor, x, y);
    if (top) this.renderItemParts3D(ctx, item.geometry.tops, topcolor, x, y);

    
    
    
    

    // this gotta move
    item.image.x = 0;
    item.image.y = 0;
    item.image.width = item.canvas.width;
    item.image.height = item.canvas.height;
    item.image.data = item.canvas;
    item.image.draw(octx, x, y, item.canvas.width, item.canvas.height);
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