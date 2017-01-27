"use strict";

function Item3DPolygon() {
    
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

Item3DPolygon.prototype.renderItem3D = function(now, ctx, item, renderer, window, x, y, depth, scale, floodlevel) {

    var top = item.top;
    
    var box = item.box;
    var bx = box.x;
    var by = box.y;
    var bs = item.scalefactor;
    
    depth *= bs;
    
    this.polygon.points.length = 0;
    var ip = item.getPolygon();
    this.polygon.setPoints(ip.getPoints());
    this.polygon.translate(bx, by, scale * bs);

    if (floodlevel) {
        var tpt = this.polygon.points.length;
        for (var i = 0; i < tpt; i++) {
            if (this.polygon.points[i].y > floodlevel) this.polygon.points[i].y = floodlevel;
        }
    }
    
    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    this.topsidecolor = "red";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
    
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (theme) {
        var tc = theme.material && theme.material.color ? theme.material.color.projected : theme.color.projected;
        if (tc) {
            if (tc.top) this.topcolor = tc.top;
            if (tc.side) this.sidecolor = tc.side;
            if (tc.bottom) this.bottomcolor = tc.bottom;
        }
        if (theme.top && theme.top.color) {
            var ttc = theme.top.color.projected;
            if (ttc.top) this.toptopcolor = ttc.top;
            if (ttc.side) this.topsidecolor = ttc.side;
            if (ttc.bottom) this.topbottomcolor = ttc.bottom;
        }
    }
    var drawtop = !top;
    if (top === false) {
        drawtop = false;
    }
    this.drawItemPartsPolygon3D(ctx, this.polygon, {"sides" : this.sidecolor, "top" : this.topcolor, "bottom" : this.bottomcolor}, depth, scale, x, y, window, true, drawtop);
    
    if (top) this.drawItemPartsPolygonTops3D(ctx, item, window, x, y, scale, {"sides" : this.topsidecolor, "top" : this.toptopcolor, "bottom" : this.topbottomcolor}, depth);
}

Item3DPolygon.prototype.drawItemPartsPolygon3D = function(ctx, poly, colors, depth, scale, x, y, window, drawbottom, drawtop) {

    if (!poly || !poly.points) return;

    var multi = false;
    this.colortop = "red";
    this.colorsides = "white";
    this.colorbottom = "blue";
    if (colors["color"]) ctx.fillStyle = colors["color"];
    else {
        multi = true;
        this.colortop = colors["top"];
        this.colorsides = colors["sides"];
        this.colorbottom = colors["bottom"];
    }
    
    ctx.fillStyle = this.colorsides;
    ctx.beginPath();
    poly.draw(ctx);

    var outline = false;

    var wc = window.getCenter();

    // todo: 
    // - get array of tops/sides/bottoms before drawing.
    // - can I trust polygon to tell me these things?
    
    
    var t = poly.points.length;
    for (var i = 1; i < t; i++) {
        
        this.p1.x = round(poly.points[i - 1].x);
        this.p2.x = round(poly.points[i].x);
        
        if (this.p1.x < this.p2.x) continue;
        
        this.p1.y = round(poly.points[i - 1].y);
        this.p2.y = round(poly.points[i].y);

        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        
        var horiz = Math.abs(this.p1.y - this.p2.y) < 3;
        var vert = Math.abs(this.p1.x - this.p2.x) < 3;
        var top = horiz && (this.p1.x < this.p2.x);
        var bottom = horiz && !top;
        var left = vert && (this.p1.y > this.p2.y);
        var right = vert && !left;
        var side = left || right;

        if (!drawtop && top) continue;
        if (!drawbottom && bottom && !side) continue;
        
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);

        if (this.p1.x < this.p2.x) continue;
        else if (this.p1.x > this.p2.x && !drawbottom) continue;
        
        if (multi) {
            if (horiz) {
                if (side) ctx.fillStyle = this.colorsides;
                else ctx.fillStyle = this.colorbottom;
            } else {
                if (vert) ctx.fillStyle = this.colorsides;
                else {
                    var ramptopleft = this.p1.x < this.p2.x && this.p1.y > this.p2.y;
                    var ramptopright = this.p1.x < this.p2.x && this.p1.y < this.p2.y;
                    var ramptop = ramptopleft || ramptopright;
                    var rampbottomleft = this.p1.x > this.p2.x && this.p1.y > this.p2.y;
                    var rampbottomright = this.p1.x > this.p2.x && this.p1.y < this.p2.y;
                    var rampbottom = rampbottomleft || rampbottomright;
                    if (ramptop) ctx.fillStyle = this.colortop;
                    else if (rampbottom) ctx.fillStyle = this.colorbottom;
                    else ctx.fillStyle = this.colorsides;
                }
            }
        }
        
        ctx.beginPath();
        this.projectedpolygon.draw(ctx);
        if (outline) this.projectedpolygon.drawOutline(ctx, ctx.fillStyle, 1 * scale);
    }

    
    this.p1.x = round(poly.points[t - 1].x);
    this.p1.y = round(poly.points[t- 1].y);
    this.p2.x = round(poly.points[0].x);
    this.p2.y = round(poly.points[0].y);

    if (shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) {
        ctx.fillStyle = this.colorsides;
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        ctx.beginPath();
        this.projectedpolygon.draw(ctx);
        if (outline) this.projectedpolygon.drawOutline(ctx, this.colorsides, 1 * scale);
    }

    
    
    
    if (!drawtop) return;

    ctx.fillStyle = this.colortop;
    var t = poly.points.length;
    for (var i = 1; i < t; i++) {
        this.p1.x = round(poly.points[i - 1].x);
        this.p2.x = round(poly.points[i].x);
        if (this.p1.x >= this.p2.x) continue;
        this.p1.y = round(poly.points[i - 1].y);
        this.p2.y = round(poly.points[i].y);
        if (!shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) continue;
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, scale, x, y, wc, this.np1, this.np2);
        ctx.beginPath();
        this.projectedpolygon.draw(ctx);
        if (outline) this.projectedpolygon.drawOutline(ctx, this.colortop, 1 * scale);
    }
}

Item3DPolygon.prototype.drawItemPartsPolygonTops3D = function(ctx, item, window, x, y, scale, colors, depth) {
    var t = item.polytops.length;
    for (var i = 0; i < t; i++) this.drawItemPartsPolygonTop3D(ctx, item, window, item.polytops[i], x, y, scale, colors, depth);
}

Item3DPolygon.prototype.drawItemPartsPolygonTop3D = function(ctx, item, window, top, x, y, scale, colors, depth) {
    this.top.setPoints(top.getPoints());
    
    var box = item.box;
    var bx = box.x;
    var by = box.y ;
    var bs = item.scalefactor;
    this.top.translate(bx, by, scale * bs);
    
    this.drawItemPartsPolygon3D(ctx, this.top, colors, depth, scale, x, y, window, false, true);    
}