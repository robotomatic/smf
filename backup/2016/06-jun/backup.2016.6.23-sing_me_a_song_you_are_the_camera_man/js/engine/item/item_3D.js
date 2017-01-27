"use strict";

function Item3D() {
    
    // todo: clean this shit up already
    // todo: blurrrr
    // todo: inefficient -> need to cache poly
    // todo: handle floating of rocks and players and things
    // todo: handle roundness and craziness
    // todo: intersect with liquid(!)

    this.fov = 400;
    this.pad = 20;

    
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.p3 = new Point(0, 0);
    this.p4 = new Point(0, 0);
    
    
    this.cp = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    
    this.polygon = new Polygon();
    this.projectedpolygon = new Polygon();

    this.polylines = new Polylines();
    this.tops = new Array();
}

Item3D.prototype.renderItem3D = function(now, ctx, window, x, y, item, width, height, scale, quality, renderer, depth, top, parallax) {

    if (item.draw == false) return;
    
    
    if (!collideRough(window, item.getMbr())) return;
    depth *= scale;
    if (item.parts) this.renderItemParts3D(now, ctx, window, x, y, item, item.parts, width, height, scale, quality, renderer, depth, top);
    else this.renderItemRect3D(now, ctx, window, x, y, item, width, height, scale, quality, renderer, depth, top, parallax);
}

Item3D.prototype.renderItemRect3D = function(now, ctx, window, x, y, item, width, height, scale, quality, renderer, depth, top, parallax) {

    var rc = window.getCenter();
    var lcx = width / 2;
    var dcx = (lcx - rc.x) * scale;
    var lcy = height / 2;
    var dcy = (lcy - rc.y) * scale;

    
    var ix = 0;
    var iy = 0;
    if (item.action) {
        ix = item.lastX - x;
        iy = item.lastY - y;
    } else {
        ix = item.x - x;
        iy = item.y - y;
    }
    
    
    this.p1.x = ix * scale;
    this.p1.y = iy * scale;
    if (parallax) {
        this.p1.x += dcx * parallax;
        this.p1.y += dcy * parallax;
        ctx.fillStyle = "green";
    }
    
    this.p2.x = (ix + item.width) * scale;
    this.p2.y = this.p1.y;
    if (parallax) this.p2.x += dcx * parallax;
    
    this.p3.x = this.p2.x;
    this.p3.y = (iy + item.height) * scale;
    if (parallax) this.p3.y += dcy * parallax;
    
    this.p4.x = this.p1.x;
    this.p4.y = this.p3.y;
    
    var height = window.height - this.voffset    

    var sidecolor = "red";
    var topcolor = "white";
    var bottomcolor = "blue";
    
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (theme) {
        if (theme.sidecolor) sidecolor = theme.sidecolor;
        if (theme.topcolor) topcolor = theme.topcolor;
        if (theme.bottomcolor) bottomcolor = theme.bottomcolor;
    }
    
    if (!parallax) ctx.fillStyle = sidecolor;
    if (this.shouldProject(this.p2, this.p3, scale, x, y, width, height, window, ctx)) {
        this.polygon = this.project3D(this.p2, this.p3, depth, this.polygon, window.width, window.height, scale, x, y, window);        
        ctx.beginPath();
        this.polygon.draw(ctx);
    }

    if (this.shouldProject(this.p4, this.p1, scale, x, y, width, height, window, ctx)) {
        this.polygon = this.project3D(this.p4, this.p1, depth, this.polygon, window.width, window.height, scale, x, y, window);
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
    
    if (this.shouldProject(this.p1, this.p2, scale, x, y, width, height, window, ctx)) {
        this.polygon = this.project3D(this.p1, this.p2, depth, this.polygon, window.width, window.height, scale, x, y, window);
        if (!parallax) ctx.fillStyle = topcolor;
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
    
    if (this.shouldProject(this.p3, this.p4, scale, x, y, width, height, window, ctx)) {
        this.polygon = this.project3D(this.p3, this.p4, depth, this.polygon, window.width, window.height, scale, x, y, window);
        if (!parallax) ctx.fillStyle = bottomcolor;
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
}
    
Item3D.prototype.renderItemParts3D = function(now, ctx, window, x, y, item, parts, width, height, scale, quality, renderer, depth, top) {

    this.polygon.points.length = 0;
    this.polygon.createPolygon(parts);
    var dx = (item.x - x) * scale;
    var dy = (item.y - y) * scale;
    this.polygon.translate(dx, dy, scale);

    var sidecolor = "red";
    var topcolor = "white";
    var bottomcolor = "blue";
    
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (theme) {
        if (theme.sidecolor) sidecolor = theme.sidecolor;
        if (theme.topcolor) topcolor = theme.topcolor;
        if (theme.bottomcolor) bottomcolor = theme.bottomcolor;
    }
    
    this.drawItemPartsPolygon3D(ctx, this.polygon, {"sides" : sidecolor, "top" : topcolor, "bottom" : bottomcolor}, depth, window.width, window.height, scale, x, y, window, true, true);
    
    var topsidecolor = "red";
    var toptopcolor = "white";
    var topbottomcolor = "blue";
    
    if (theme) {
        topsidecolor = theme.topsidecolor;
        toptopcolor = theme.toptopcolor;
        topbottomcolor = theme.topbottomcolor;
    }
    
    if (top) this.drawItemPartsPolygonTops3D(ctx, item, window, x, y, scale, {"sides" : topsidecolor, "top" : toptopcolor, "bottom" : topbottomcolor}, width, height, depth);
}







Item3D.prototype.drawItemPartsPolygon3D = function(ctx, poly, colors, depth, width, height, scale, x, y, window, drawbottom, drawtop) {


    // todo: glom polys together, filter inner points & draw crazy round 
    // -> craziness is part of renderer?

    var multi = false;
    var colortop = "";
    var colorsides = "";
    var colorbottom = "";
    if (colors["color"]) ctx.fillStyle = colors["color"];
    else {
        multi = true;
        colortop = colors["top"];
        colorsides = colors["sides"];
        colorbottom = colors["bottom"];
    }
    
    this.tops.length = 0;

    
    ctx.fillStyle = colorsides;
    ctx.beginPath();
    poly.draw(ctx);
    
    
    var t = poly.points.length;
    for (var i = 1; i < t; i++) {
        
        this.p1.x = poly.points[i - 1].x;
        this.p1.y = poly.points[i - 1].y;
        this.p2.x = poly.points[i].x;
        this.p2.y = poly.points[i].y;

        if (!this.shouldProject(this.p1, this.p2, scale, x, y, width, height, window, ctx)) continue;
        
        var horiz = Math.abs(this.p1.y - this.p2.y) < 3;
        var vert = Math.abs(this.p1.x - this.p2.x) < 3;
        
        var ramptopleft = this.p1.x < this.p2.x && this.p1.y > this.p2.y;
        var ramptopright = this.p1.x < this.p2.x && this.p1.y < this.p2.y;
        var ramptop = ramptopleft || ramptopright;
        
        var rampbottomleft = this.p1.x > this.p2.x && this.p1.y > this.p2.y;
        var rampbottomright = this.p1.x > this.p2.x && this.p1.y < this.p2.y;
        var rampbottom = rampbottomleft || rampbottomright;

        var top = horiz && (this.p1.x < this.p2.x);
        var bottom = horiz && !top;
        var left = vert && (this.p1.y > this.p2.y);
        var right = vert && !left;
        var side = left || right;
        
        if (!drawtop && top) continue;
        if (!drawbottom && bottom && !side) continue;

        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = this.project3D(this.p1, this.p2, depth, this.projectedpolygon, width, height, scale, x, y, window);
        
        if (this.p1.x < this.p2.x) {
            var tp = new Polygon();
            tp.setPoints(this.projectedpolygon.getPoints());
            this.tops[this.tops.length] = tp;
            continue;
        }
        
        if (multi) {
            if (horiz) {
                if (top) ctx.fillStyle = colortop;
                else if (side) ctx.fillStyle = colorsides;
                else ctx.fillStyle = colorbottom;
            } else {
                if (vert) ctx.fillStyle = colorsides;
                else {
                    if (ramptop) ctx.fillStyle = colortop;
                    else if (rampbottom) {
                        ctx.fillStyle = colorbottom;
                    }
                }
            }
        }
        
        ctx.beginPath();
        this.projectedpolygon.draw(ctx);
    }

    this.p1.x = poly.points[t - 1].x;
    this.p1.y = poly.points[t- 1].y;
    this.p2.x = poly.points[0].x;
    this.p2.y = poly.points[0].y;

    if (this.shouldProject(this.p1, this.p2, scale, x, y, width, height, window, ctx)) {
        ctx.fillStyle = colorsides;
        this.projectedpolygon.points.length = 0;
        this.projectedpolygon = this.project3D(this.p1, this.p2, depth, this.projectedpolygon, width, height, scale, x, y, window);
        ctx.beginPath();
        this.projectedpolygon.draw(ctx);
    }

    this.drawPolygonTops3D(ctx, colortop);
}




Item3D.prototype.drawPolygonTops3D = function(ctx, color) {
    ctx.fillStyle = color;
    for (var i = 0; i < this.tops.length; i++) {
        ctx.beginPath();
        this.tops[i].draw(ctx);
    }
}




Item3D.prototype.drawItemPartsPolygonTops3D = function(ctx, item, window, x, y, scale, colors, width, height, depth) {
    this.polylines.polylines.length = 0;
    var tops = item.tops;
    this.polylines.createPolylines(tops);
    var pad = 5;
    for (var i = 0; i < this.polylines.polylines.length; i++) {
        var top = this.createPolygonTop(this.polylines.polylines[i], pad);
        this.drawItemPartsPolygonTop3D(ctx, item, window, top, x, y, scale, colors, depth);
    }
}

Item3D.prototype.createPolygonTop = function(top, pad) {
    var pg = new Polygon();
    var p;
    var np;
    p = top.points[0];
    np = new Point(p.x - pad, p.y - pad);
    pg.addPoint(np);
    var simple = false;
    if (top.points.length == 2) {
        simple = true;
        top.points[2] = top.points[1];
        var d = top.points[1].x - top.points[0].x;
        var rd = random(0, d);
        rd = 0;
        top.points[1] = new Point(top.points[0].x + rd, top.points[0].y);
    }
    for (var i = 0; i < top.points.length; i++) {
        p = top.points[i];
        np = new Point(p.x, p.y - pad);
        pg.addPoint(np);
    }
    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y - pad);
    pg.addPoint(np);
    p = top.points[top.points.length - 1];
    np = new Point(p.x + pad, p.y);
    pg.addPoint(np);
    var bpad = pad;
//    if (simple) bpad = pad = random(0, pad);
    for (var i = top.points.length; i > 1; i--) {
        p = top.points[i - 1];
        np = new Point(p.x, p.y + bpad);
        pg.addPoint(np);
    }
    p = top.points[0];
    np = new Point(p.x - pad, p.y);
    pg.addPoint(np);
    return pg;
}


Item3D.prototype.drawItemPartsPolygonTop3D = function(ctx, item, window, top, x, y, scale, colors, depth) {
    var dx = (item.x - x) * scale;
    var dy = (item.y - y + 5) * scale;
    top.translate(dx, dy, scale);
    this.drawItemPartsPolygon3D(ctx, top, colors, depth, window.width, window.height, scale, x, y, window, false, true);    
}




















Item3D.prototype.shouldProject = function(p1, p2, scale, x, y, width, height, window, ctx) {

    var rc = window.getCenter();
    var w = (rc.x - x) * scale;
    var h = (rc.y - y - this.pad) * scale;
    

    this.cp.x = w;
    this.cp.y = h;
    
//    ctx.fillStyle = "white";
//    cp.draw(ctx, 20);
    
    
    var horiz = p1.y == p2.y;
    var top = p1.x < p2.x;
    
    var vert = p1.x == p2.x;
    var left = p1.y > p2.y;
    
    var dt = p1.y >= this.cp.y;
    var dl = p1.x > this.cp.x;
    
    if (horiz && dt && !top) return false;
    else if (horiz && !dt && top) return false;

    if (vert && dl && !left) return false;
    else if (vert && !dl && left) return false;
    
    return true;
}





Item3D.prototype.project3D = function(p1, p2, depth, poly, width, height, s, x, y, window) {

    var fov = this.fov;

    var scale = fov / (fov + depth);
    var inv = 1.0 - scale;

    var rc = window.getCenter();
    var w = (rc.x - x) * s;
    var h = (rc.y - y - this.pad) * s;
    
    var np1x = (p1.x * scale) + (w * inv);
	var np1y = (p1.y * scale) + (h * inv);   
    var np2x = (p2.x * scale) + (w * inv);
	var np2y = (p2.y * scale) + (h * inv);    

    np1x = round(np1x);
	np1y = round(np1y);   
    np2x = round(np2x);
	np2y = round(np2y);    
    
    this.np1.x = np1x;
    this.np1.y = np1y;
    this.np2.x = np2x;
    this.np2.y = np2y;

    poly.points.length = 0;
    poly.addPoint(this.np1);
    poly.addPoint(this.np2);
    poly.addPoint(p2);
    poly.addPoint(p1);
    
    return poly;
}
