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

Item3DPolygon.prototype.renderItem3D = function(now, ctx, item, renderer, window, x, y, width, height, scale, depth, top) {
    this.polygon.points.length = 0;
    var ip = item.getPolygon();
    this.polygon.setPoints(ip.getPoints());
    var dx = (item.x - x) * scale;
    var dy = (item.y - y) * scale;
    this.polygon.translate(dx, dy, scale);
    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    this.topsidecolor = "red";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (theme) {
        if (theme.sidecolor) this.sidecolor = theme.sidecolor;
        if (theme.topcolor) this.topcolor = theme.topcolor;
        if (theme.bottomcolor) this.bottomcolor = theme.bottomcolor;
        if (theme.topsidecolor) this.topsidecolor = theme.topsidecolor;
        if (theme.toptopcolor) this.toptopcolor = theme.toptopcolor;
        if (theme.topbottomcolor) this.topbottomcolor = theme.topbottomcolor;
    }
    this.drawItemPartsPolygon3D(ctx, this.polygon, {"sides" : this.sidecolor, "top" : this.topcolor, "bottom" : this.bottomcolor}, depth, window.width, window.height, scale, x, y, window, true, true);
    if (top) this.drawItemPartsPolygonTops3D(ctx, item, window, x, y, scale, {"sides" : this.topsidecolor, "top" : this.toptopcolor, "bottom" : this.topbottomcolor}, width, height, depth);
}

Item3DPolygon.prototype.drawItemPartsPolygon3D = function(ctx, poly, colors, depth, width, height, scale, x, y, window, drawbottom, drawtop) {

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

    var wc = window.getCenter();
    
    var t = poly.points.length;
    for (var i = 1; i < t; i++) {
        
        this.p1.x = round(poly.points[i - 1].x);
        this.p2.x = round(poly.points[i].x);
        
        if (this.p1.x < this.p2.x) continue;
        
        this.p1.y = round(poly.points[i - 1].y);
        this.p2.y = round(poly.points[i].y);

        if (!shouldProject(this.p1, this.p2, scale, x, y, width, height, wc, this.cp)) continue;
        
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
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, width, height, scale, x, y, wc, this.np1, this.np2);

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
    }

    this.p1.x = round(poly.points[t - 1].x);
    this.p1.y = round(poly.points[t- 1].y);
    this.p2.x = round(poly.points[0].x);
    this.p2.y = round(poly.points[0].y);

    if (shouldProject(this.p1, this.p2, scale, x, y, width, height, wc, this.cp)) {
        ctx.fillStyle = this.colorsides;
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, width, height, scale, x, y, wc, this.np1, this.np2);
        ctx.beginPath();
        this.projectedpolygon.draw(ctx);
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
        if (!shouldProject(this.p1, this.p2, scale, x, y, width, height, wc, this.cp)) continue;
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = project3D(this.p1, this.p2, depth, this.projectedpolygon, width, height, scale, x, y, wc, this.np1, this.np2);
        ctx.beginPath();
        this.projectedpolygon.draw(ctx);
    }
}

Item3DPolygon.prototype.drawItemPartsPolygonTops3D = function(ctx, item, window, x, y, scale, colors, width, height, depth) {
    var t = item.polytops.length;
    for (var i = 0; i < t; i++) this.drawItemPartsPolygonTop3D(ctx, item, window, item.polytops[i], x, y, scale, colors, depth);
}

Item3DPolygon.prototype.drawItemPartsPolygonTop3D = function(ctx, item, window, top, x, y, scale, colors, depth) {
    this.top.setPoints(top.getPoints());
    var dx = (item.x - x) * scale;
    var dy = (item.y - y + 5) * scale;
    this.top.translate(dx, dy, scale);
    this.drawItemPartsPolygon3D(ctx, this.top, colors, depth, window.width, window.height, scale, x, y, window, false, true);    
}