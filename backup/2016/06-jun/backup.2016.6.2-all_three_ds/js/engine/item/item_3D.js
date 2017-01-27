"use strict";

function Item3D() {
    
    // todo: clean this shit up already
    // todo: blurrrr
    // todo: inefficient -> need to cache poly
    // todo: need to handle colors better
    // todo: handle floating of rocks and players and things
    // todo: handle roundness and craziness
    // todo: intersect with liquid(!)
    
    // todo: ramp tops fucky
    

    this.fov = 700;
    
    this.polygon = new Polygon();
}

Item3D.prototype.renderItem3D = function(now, ctx, window, x, y, item, width, height, scale, quality, renderer, depth, top, parallax) {
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

    var p1 = new Point(0, 0);
    var p2 = new Point(0, 0);
    var p3 = new Point(0, 0);
    var p4 = new Point(0, 0);

    p1.x = (item.x - x) * scale;
    p1.y = (item.y - y) * scale;
    if (parallax) {
        p1.x += dcx * parallax;
        p1.y += dcy * parallax;
        ctx.fillStyle = "green";
    }
    
    p2.x = (item.x + item.width - x) * scale;
    p2.y = p1.y;
    if (parallax) p2.x += dcx * parallax;
    
    p3.x = p2.x;
    p3.y = (item.y + item.height - y) * scale;
    if (parallax) p3.y += dcy * parallax;
    
    p4.x = p1.x;
    p4.y = p3.y;
    
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
    if (this.shouldProject(p2, p3, scale, x, y, window, ctx)) {
        this.polygon = this.project3D(p2, p3, depth, this.polygon, window.width, window.height, scale, x, y, window);        
        ctx.beginPath();
        this.polygon.draw(ctx);
    }

    if (this.shouldProject(p4, p1, scale, x, y, window, ctx)) {
        this.polygon = this.project3D(p4, p1, depth, this.polygon, window.width, window.height, scale, x, y, window);
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
    
    
    if (this.shouldProject(p1, p2, scale, x, y, window, ctx)) {
        this.polygon = this.project3D(p1, p2, depth, this.polygon, window.width, window.height, scale, x, y, window);
        if (!parallax) ctx.fillStyle = topcolor;
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
    
    if (this.shouldProject(p3, p4, scale, x, y, window, ctx)) {
        this.polygon = this.project3D(p3, p4, depth, this.polygon, window.width, window.height, scale, x, y, window);
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
    
    this.drawItemPartsPolygon3D(ctx, this.polygon, {"sides" : sidecolor, "top" : topcolor, "bottom" : bottomcolor}, depth, window.width, window.height, scale, x, y, window, true);

    
    var topsidecolor = theme.topsidecolor ? theme.topsidecolor : "#92938b";
    var toptopcolor = theme.toptopcolor ? theme.toptopcolor : "yellow";
    var topbottomcolor = theme.topbottomcolor ? theme.topbottomcolor : "#92938b";
    
    
    if (top) this.drawItemPartsPolygonTops3D(ctx, item, window, x, y, scale, {"sides" : topsidecolor, "top" : toptopcolor, "bottom" : topbottomcolor}, width, height, depth);
}







Item3D.prototype.drawItemPartsPolygon3D = function(ctx, poly, colors, depth, width, height, scale, x, y, window, drawbottom) {


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
    
    var np = new Polygon();
    var t = poly.points.length;
    for (var i = 1; i < t; i++) {
        var p1 = new Point(poly.points[i - 1].x, poly.points[i - 1].y);
        var p2 = new Point(poly.points[i].x, poly.points[i].y);
        
        if (!drawbottom) {
            if ((p1.y == p2.y) && (p1.x > p2.x)) continue;
        }
        
        if (!this.shouldProject(p1, p2, scale, x, y, window, ctx)) continue;
        
        np.points.length = 0;
        np = this.project3D(p1, p2, depth, np, width, height, scale, x, y, window);
        
        var horiz = Math.abs(p1.y - p2.y) < 20;
        var top = p1.x < p2.x;
        var vert = Math.abs(p1.x - p2.x) < 20;
        var left = p1.y > p2.y;
        
        // todo: - check for ramp
        
        if (multi) {
            if (horiz) {
                if (top) ctx.fillStyle = colortop;
                else ctx.fillStyle = colorbottom;
            } else {
                if (vert) ctx.fillStyle = colorsides;
                else {
                    if (!drawbottom) ctx.fillStyle = colortop;
                    else ctx.fillStyle = colorbottom;
                }
            }
        }
        
        ctx.beginPath();
        np.draw(ctx);
    }

    var p1 = new Point(poly.points[t - 1].x, poly.points[t- 1].y);
    var p2 = new Point(poly.points[0].x, poly.points[0].y);

    if (!drawbottom) {
        if ((p1.y == p2.y) && (p1.x > p2.x)) return;
    }
    
    if (!this.shouldProject(p1, p2, scale, x, y, window, ctx)) return;

    np.points.length = 0;
    np = this.project3D(p1, p2, depth, np, width, height, scale, x, y, window);
    ctx.beginPath();
    np.draw(ctx);
}








Item3D.prototype.drawItemPartsPolygonTops3D = function(ctx, item, window, x, y, scale, colors, width, height, depth) {
    var pl = new Polylines();
    var tops = item.tops;
    pl.createPolylines(tops);
    var pad = 5;
    for (var i = 0; i < pl.polylines.length; i++) {
        var top = this.createPolygonTop(pl.polylines[i], pad);
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
    this.drawItemPartsPolygon3D(ctx, top, colors, depth, window.width, window.height, scale, x, y, window, false);    
}




















Item3D.prototype.shouldProject = function(p1, p2, scale, x, y, window, ctx) {

    var style = ctx.fillStyle;
    
    var pad = 0;
    
    var rc = window.getCenter();
    var w = (rc.x - x) * scale;
    var h = (rc.y - y - pad) * scale;
    var cp = new Point(w, h);
    
//    ctx.fillStyle = "white";
//    cp.draw(ctx, 20);
//    ctx.fillStyle = style;

    var horiz = p1.y == p2.y;
    var top = p1.x < p2.x;
    var dt = p1.y > cp.y;
    if (horiz && dt && !top) return false;
    else if (horiz && !dt && top) return false;

    var vert = p1.x == p2.x;
    var left = p1.y > p2.y;
    var dl = p1.x > cp.x;
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
    var h = (rc.y - y) * s;
    
    var np1x = (p1.x * scale) + (w * inv);
	var np1y = (p1.y * scale) + (h * inv);   
    var np2x = (p2.x * scale) + (w * inv);
	var np2y = (p2.y * scale) + (h * inv);    

    var np1 = new Point(np1x, np1y);
    var np2 = new Point(np2x, np2y);

    poly.points.length = 0;
    poly.addPoint(np1);
    poly.addPoint(np2);
    poly.addPoint(p2);
    poly.addPoint(p1);
    
    return poly;
}
