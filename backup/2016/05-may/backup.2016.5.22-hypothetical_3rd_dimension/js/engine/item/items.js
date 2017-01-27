"use strict";

function Items() {
    this.items = new Array();
    this.itemcache = new ItemCache();

    this.polybottom = new Polygon();
    this.polytop = new Polygon();
    this.polyleft = new Polygon();
    this.polyright = new Polygon();
}

Items.prototype.loadJson = function(items) {
    for (var item in items) {
        var it = new Item();
        it.loadJson(items[item]);
        this.addItem(item, it);
    }
}


Items.prototype.addItem = function(key, item) { 
    this.items[key] = item;
}

Items.prototype.update = function(now, step) { 
    if (!this.items.length) return;
    for (var i = 0; i < this.items.length; i++) this.items[i].update(now, step);
}

Items.prototype.render = function(now, ctx, window, x, y, width, height, scale, quality, renderer, cache, blur, parallax, depth, top) {
    if (!this.items) return;
    if (depth) for (var i = 0; i < this.items.length; i++) this.renderItem3D(now, ctx, window, x, y, this.items[i], width, height, scale, quality, renderer, depth, top, parallax);
    for (var i = 0; i < this.items.length; i++) this.renderItem(now, ctx, window, x, y, this.items[i], width, height, scale, quality, renderer, cache, blur, parallax);
}


Items.prototype.renderItem3D = function(now, ctx, window, x, y, item, width, height, scale, quality, renderer, depth, top, parallax) {

    
    if (!collideRough(window, item.getMbr())) return;
    
    depth *= scale;

    if (item.parts) {
        this.renderItemParts3D(now, ctx, window, x, y, item, width, height, scale, quality, renderer, depth, top);
        return;
    }
    
    
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
    if (parallax) {
        p2.x += dcx * parallax;
    }
    
    p3.x = p1.x;
    p3.y = (item.y + item.height - y) * scale;
    if (parallax) {
        p3.y += dcy * parallax;
    }
    
    p4.x = p2.x;
    p4.y = p3.y;
    
    
    this.polybottom = project3D(p3, p4, depth, this.polybottom, window.width, window.height, scale);
    this.polytop = project3D(p1, p2, depth, this.polytop, window.width, window.height, scale);
    this.polyleft = project3D(p1, p3, depth, this.polyleft, window.width, window.height, scale);
    this.polyright = project3D(p2, p4, depth, this.polyright, window.width, window.height, scale);

    
    // todo: decide whether or not to draw perspective planes based on occlusion(!)
    
    
    if (!parallax) ctx.fillStyle = "red";
    ctx.beginPath();
    this.polybottom.draw(ctx);
    
    if (!parallax) ctx.fillStyle = "orange";
    ctx.beginPath();
    this.polyleft.draw(ctx);
    
    ctx.beginPath();
    this.polyright.draw(ctx);
    
    if (!parallax) ctx.fillStyle = "yellow";
    ctx.beginPath();
    this.polytop.draw(ctx);
}




Items.prototype.renderItemParts3D = function(now, ctx, window, x, y, item, width, height, scale, quality, renderer, depth, top) {
    
    // todo: inefficient -> need to cache poly
    // todo: need to handle occlusion
    // todo: need to handle colors better
    // todo: move this to some kind of 3d class
    // todo: handle floating of rocks and players and things
    // todo: handle roundness and craziness
    
    var polygon = new Polygon();
    polygon.createPolygon(item.parts);
    var poly = new Polygon();
    poly.setPoints(polygon.points);
    var dx = (item.x - x) * scale;
    var dy = (item.y - y) * scale;
    poly.translate(dx, dy, scale);
    
    this.drawItemPartsPolygon3D(ctx, poly, "gray", depth, window.width, window.height, scale);
    if (top) this.drawItemPartsPolygonTops3D(ctx, item, window, x, y, scale, "yellow", width, height, depth);
}


Items.prototype.drawItemPartsPolygon3D = function(ctx, poly, color, depth, width, height, scale) {

    ctx.fillStyle = color;

    // todo: glom polys together, filter inner points & draw crazy round 
    // -> craziness is part of renderer?
    
    var np = new Polygon();
    var t = poly.points.length;
    for (var i = 1; i < t; i++) {
        var p1 = new Point(poly.points[i - 1].x, poly.points[i - 1].y);
        var p2 = new Point(poly.points[i].x, poly.points[i].y);
        np.points.length = 0;
        np = project3D(p1, p2, depth, np, width, height, scale);
        ctx.beginPath();
        np.draw(ctx);
    }

    var p1 = new Point(poly.points[t - 1].x, poly.points[t- 1].y);
    var p2 = new Point(poly.points[0].x, poly.points[0].y);
    np.points.length = 0;
    np = project3D(p1, p2, depth, np, width, height, scale);
    ctx.beginPath();
    np.draw(ctx);
}








Items.prototype.drawItemPartsPolygonTops3D = function(ctx, item, window, x, y, scale, color, width, height, depth) {
    var pl = new Polylines();
    var tops = item.tops;
    pl.createPolylines(tops);
    var pad = 5;
    for (var i = 0; i < pl.polylines.length; i++) {
        var top = this.createPolygonTop(pl.polylines[i], pad);
        this.drawItemPartsPolygonTop3D(ctx, item, window, top, x, y, scale, color, depth);
    }
}

Items.prototype.drawItemPartsPolygonTop3D = function(ctx, item, window, top, x, y, scale, color, depth) {
    var dx = (item.x - x) * scale;
    var dy = (item.y - y + 5) * scale;
    top.translate(dx, dy, scale);
    this.drawItemPartsPolygon3D(ctx, top, color, depth, window.width, window.height, scale);    
}


Items.prototype.createPolygonTop = function(top, pad) {
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































Items.prototype.renderItem = function(now, ctx, window, x, y, item, width, height, scale, quality, renderer, cache, blur, parallax) {
    
    
    if (item.draw == false) return;

    // todo: this needs to be quadtree!!!!
    if (item.width != "100%" && !collideRough(window, item.getMbr())) return;

    var dx = item.x - x;
    var dy = item.y - y;
    
    var ix = dx * scale;
    var iy = dy * scale;
    
    
    if (parallax) {
        var rc = window.getCenter();
        
        var lcx = width / 2;
        var dcx = (lcx - rc.x) * scale;
        ix += dcx * parallax;
        
        var lcy = height / 2;
        var dcy = (lcy - rc.y) * scale;
        iy += dcy * parallax;
    }
    

    

//    if (!item.lastX) item.lastX = itemx;
//    var dx = (itemx - item.lastX) / 2;
//    if (dx) {
//        itemx = itemx - dx;    
//        item.lastX = itemx;
//    }
//    
//    if (!item.lastY) item.lastY = itemy;
//    var dy = (itemy - item.lastY) / 2;
//    if (dy) {
//        itemy = itemy - dy;
//        item.lastY = itemy;
//    } 
    

    var iw = item.width * scale;
    if (item.width === "100%") {
        ix = -100;
        iw = width + 200;
    }
    var ih = item.height * scale;
    if (item.height === "100%") {
        iy = 0;
        ih = height;
    }
    
    //var cache = !item.action;
    this.drawItem(ctx, item, window, ix, iy, iw, ih, renderer, scale, cache, quality, blur);
}

Items.prototype.drawItem = function(ctx, item, window, x, y, width, height, renderer, scale, cache, quality, blur) {
    
    // todo: this should be like item.draw(ctx, x, y, scale);
    
    
    if (!cache || !this.itemcache.cacheItem(ctx, item, window, x, y, width, height, renderer, scale, this.drawdetails, quality, blur)) {
        if (renderer) renderer.drawItem(ctx, item.color, item, window, x, y, width, height, scale, this.drawdetails);
        else {
            ctx.fillStyle = item.color ? item.color : "red"; 
            var rect = new Rectangle(x, y, width, height);
            rect.draw(ctx);
        }
    }
}
