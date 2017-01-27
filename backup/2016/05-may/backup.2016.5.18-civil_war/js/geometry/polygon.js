"use strict";

function Polygon() {
    this.points = new Array();
    this.tops = new Array();
    this.bottoms = new Array();
    this.sides = new Array();
    this.crazy = 0;
    this.mbr = null;
    this.center = new Point(0, 0);
    this.cache = false;
    this.id = "";
}

Polygon.prototype.getId = function(id) {
    if (this.id) return this.id;
    if (this.points.length < 2) return "";
    var td = 0;
    var ta = 0;
    var ti = "";
    for (var i = 1; i < this.points.length; i++) {
        var d = distance(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        td += d;    
        var a = angleDegrees(this.points[i - 1], this.points[i]);
        ta += a;
        if (this.points[i].info) ti += "-" + i;
    }
    if (id) id += "-";
    id += td + "-" + ta + "-" + ti;
    this.id = id;
    return this.id;
}

Polygon.prototype.translate = function(x, y, scale) {
    scale = scale || 1;
    for (var i = 0; i < this.points.length; i++) {
        this.points[i].x = x + (this.points[i].x * scale);
        this.points[i].y = y + (this.points[i].y * scale);
    }
    this.mbr = null;
}
    
Polygon.prototype.craziness = function(crazy) {
    this.crazy = crazy;
    for (var i = 0; i < this.points.length; i++) {
        var npx = this.points[i].x;
        var npy = this.points[i].y;
        var amt = random(1, crazy + 1);
        if (i == this.points.length - 1) {
            if (this.points[0].x <= npx) npx -= amt;
            else  npx += amt;
        } else {
            if (this.points[i + 1].x <= npx) npx -= amt;
            else  npx += amt;
        }
        npy += 2;
        var np = new Point(npx, npy);
        this.points[i] = np;
    }
    this.mbr = null;
}

Polygon.prototype.getMbr = function() {
    
    if (this.mbr) return this.mbr;
    
    var minx;
    var miny;
    var maxx;
    var maxy;
    for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        var px = p.x;
        var py = p.y;
        if (!minx || px < minx) minx = px;
        if (!maxx || px > maxx) maxx = px;
        if (!miny || py < miny) miny = py;
        if (!maxy || py > maxy) maxy = py;
    }
    var w = maxx - minx;
    var h = maxy - miny;
    return this.mbr = new Rectangle(minx, miny, w, h);
}

Polygon.prototype.getCenter = function() {
    var mbr = this.getMbr();
    this.center.x = mbr.x + (mbr.width / 2);
    this.center.y = mbr.y + (mbr.height / 2);
    return this.center;
}

Polygon.prototype.getPoints = function() {
    return this.points;
}

Polygon.prototype.setPoints = function(points) {
    this.points.length = 0;
    for (var i = 0; i < points.length; i++) this.addPoint(points[i]);
    this.mbr = null;
}

Polygon.prototype.addPoint = function(point) {
    
    // todo: reject dups
    
    this.points[this.points.length] = new Point(point.x, point.y);
    if (point.info) this.points[this.points.length - 1].info = point.info;
    this.mbr = null;
}

Polygon.prototype.filterChain = function(rects) {

    this.points.length = 0;
    
    if (rects[0].x > rects[1].x) {
        if (rects[0].y > rects[1].y) {
            //  top left
            this.addPoint(new Point(rects[1].x, rects[1].y));
            this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            if (rects[1].x + rects[1].width < rects[0].x + rects[0].width) this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            this.addPoint(new Point(rects[0].x, rects[0].y + rects[0].height));
        } else {
            // botom left
            this.addPoint(new Point(rects[1].x, rects[1].y));
            this.addPoint(new Point(rects[0].x, rects[0].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y + rects[0].height));
            this.addPoint(new Point(rects[0].x, rects[0].y + rects[0].height));
        }
    } else {
        if (rects[0].y > rects[1].y) {
            // top right
            this.addPoint(new Point(rects[0].x, rects[0].y));
            this.addPoint(new Point(rects[1].x, rects[1].y));
            this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y));
            if (rects[1].x + rects[1].width < rects[0].x + rects[0].width) this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y + rects[0].height));
            this.addPoint(new Point(rects[0].x, rects[0].y + rects[0].height));
        } else {
            // botom right
            this.addPoint(new Point(rects[0].x, rects[0].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y + rects[0].height));
            this.addPoint(new Point(rects[0].x, rects[0].y + rects[0].height));
        }
    }
    
    this.mbr = null;
}

Polygon.prototype.filterPoints = function(rects) {
    var minpx;
    var minpy;
    var maxpx;
    var maxpy;
    var outline = new Array();
    for (var i = 0; i < this.points.length; i++) {
        var inside = false;
        if (rects.length) {
            for (var ii = 0; ii < rects.length; ii++) {
                if (rects[ii].contains(this.points[i])) {
                    inside = true;
                    break;
                }
            }
        }
        if (!inside) {
            if (!minpx || (this.points[i].x < minpx)) minpx = this.points[i].x;
            if (!minpy || (this.points[i].y < minpy)) minpy = this.points[i].y;
            if (!maxpx || (this.points[i].x > maxpx)) maxpx = this.points[i].x;
            if (!maxpy || (this.points[i].y > maxpy)) maxpy = this.points[i].y;
            outline[outline.length] = new Point(this.points[i].x, this.points[i].y);
            if (this.points[i].info) outline[outline.length - 1].setInfo(this.points[i].info);
        }
    }
    if (!outline.length) return;
    var cp = new Point(minpx + ((maxpx - minpx) / 2), minpy + ((maxpy - minpy) / 2));
    var leftpoints = new Array();
    var rightpoints = new Array();
    var angle;
    var line = new Line();
    line.start.x = cp.x;
    line.start.y = cp.y;
    for (var i = 0; i < outline.length; i++) {
        line.end.x = outline[i].x;
        line.end.y = outline[i].y;
        angle = line.angle();
        if (angle <= 90 && angle >= -90) {
            leftpoints[leftpoints.length] = new Point(outline[i].x, outline[i].y);
            if (outline[i].info) leftpoints[leftpoints.length - 1].setInfo(outline[i].info);
        } else {
            rightpoints[rightpoints.length] = new Point(outline[i].x, outline[i].y);
            if (outline[i].info) rightpoints[rightpoints.length - 1].setInfo(outline[i].info);
        }
    }
    this.points = new Array();
    if (leftpoints.length) {
        leftpoints.sort(sortByPositionY);
        var pn = 0;
        for (var i = 0; i < leftpoints.length; i++) {
            var p = leftpoints[i];
            this.addPoint(p);
        }
    }
    if (rightpoints.length) {
        rightpoints.sort(sortByPositionY);
        rightpoints.reverse();
        var pn = 0;
        for (var i = 0; i < rightpoints.length; i++) {
            var p = rightpoints[i];
            this.addPoint(p);
        }
    }
    this.mbr = null;
}

Polygon.prototype.filterJoin = function(rects) {
}




Polygon.prototype.createPolygon = function(items) {
    
    if (!items) return;

    this.points = new Array();
    this.tops = new Array();
    this.bottoms = new Array();
    this.sides = new Array();

    if (items.length == 1) {
        var item = items[0];
        this.points[0] = new Point(item.x, item.y);
        this.points[1] = new Point(item.x + item.width, item.y);
        this.tops[0] = new Line(this.points[0], this.points[1]);
        

        this.points[2] = new Point(item.x + item.width, item.y + item.height);
        this.sides[0] = new Line(this.points[1], this.points[2]);
        
        this.points[3] = new Point(item.x, item.y + item.height);
        this.bottoms[0] = new Line(this.points[2], this.points[3]);

        this.sides[1] = new Line(this.points[3], this.points[0]);
        
        return this.points;
    }

    var cx1;
    var cy1;
    var cx2;
    var cy2;

    var px1;
    var py1;
    var px2;
    var py2;
        
    var nx1;
    var ny1;
    var nx2;
    var ny2;
    
    var turn = false;
    var t = items.length;
    for (var i = 0; i < t; i++) {
        
        var current = items[i];

        var prev;
        if (i > 0) prev = items[i - 1];
        else prev = items[0];
        
        var next;
        if (i < t - 1) next = items[i + 1];
        else next = items[0];
        
        cx1 = current.x;
        cy1 = current.y;
        cx2 = current.x + current.width;
        cy2 = current.y + current.height;

        px1 = prev.x;
        py1 = prev.y;
        px2 = prev.x + prev.width;
        py2 = prev.y + prev.height;
        
        nx1 = next.x;
        ny1 = next.y;
        nx2 = next.x + next.width;
        ny2 = next.y + next.height;
        
        if (nx2 >= cx2 && !turn) {
            
            var cx = cx1;
            if (px2 > cx1 && cy1 > py1) cx = px2;
            var sp = new Point(cx, cy1);
            
            var cxx = cx2;
            if (i == 0 && nx1 < cx2) cxx = nx1;
            
            if (cxx < cx) cxx = cx2;
            
            var ep = new Point(cxx, cy1);
            
            if (current.ramp) {
                if (current.ramp == "left") {
                    this.points[this.points.length] = sp;
                    this.tops[this.tops.length] = new Line(this.points[this.points.length - 2], new Point(cx2, cy2));                    
                } else if (current.ramp == "right") {
                    this.points[this.points.length] = ep;
                    this.tops[this.tops.length] = new Line(this.points[this.points.length - 2], ep);                    
                }
            } else {
                this.points[this.points.length] = sp;                
                this.points[this.points.length] = ep;
                if (this.points.length > 1) this.tops[this.tops.length] = new Line(sp, ep);
            }
        } else  {
            if (!turn) {
                var cx = cx1;
                if (px2 > cx1) cx = px2;
                
                this.points[this.points.length] = new Point(cx, cy1);
                this.points[this.points.length] = new Point(cx2, cy1);
                
                this.tops[this.tops.length] = new Line(this.points[this.points.length - 2], this.points[this.points.length - 1]);    
                turn = true;
            }
            
            if (!current.ramp || current.ramp != "right-top") if (cx1 != nx1) this.points[this.points.length] = new Point(cx2, cy2);
            if (nx2 > cx1 && (i < t - 1)) cx1 = nx2;
            if (!current.ramp || current.ramp != "left-top") this.points[this.points.length] = new Point(cx1, cy2);
        }
    }
    
    if (cx1 <= nx2) nx2 = cx1;
    this.points[this.points.length] = new Point(nx2, ny2);
    this.points[this.points.length] = new Point(nx1, ny2);

    this.mbr = null;
    
    return this.points;
}

Polygon.prototype.rotate = function(deg, cp) {
    var center = cp ? cp : this.getCenter();
    var points = this.getPoints();
    var out = new Array();
    var l;
    for (var i = 0; i < this.points.length; i++) {
        l = new Line(center, points[i]);
        l = l.rotate(deg);
        out[out.length] = l.end;
    }
    return out;
}

Polygon.prototype.path = function(ctx) {
    var points = this.points;
    var dx = 0;
    var dy = 0;
    if (points[0].info && points[0].info == "round") {
        if (!points[1].info || !points[1].info == "skip") {
            dx = (points[1].x - points[0].x) / 2;
            dy = (points[1].y - points[0].y) / 2;
            ctx.moveTo(points[0].x + dx, points[0].y + dy);
        }
    } else if (points[0].info && points[0].info == "smooth") {
        ctx.moveTo(points[1].x, points[1].y);
    } else if (!points[0].info || points[0].info != "skip") {
        ctx.moveTo(points[0].x, points[0].y);
    }
    var npx = 0;
    var npy = 0;
    var i= 1;
    for (i = 1; i < points.length; i++) {
        var p = points[i];
        if (p.info) {
            if (p.info == "skip") {
                if (i == 1 && points[0].info && points[0].info == "round") {

                    dx = (points[2].x - points[0].x) / 4;
                    dy = (points[2].y - points[0].y) / 4;
                    ctx.moveTo(points[0].x + dx, points[0].y + dy);
                    
                    dx = (points[2].x - points[0].x) / 2;
                    dy = (points[2].y - points[0].y) / 2;
                    
                    ctx.quadraticCurveTo(points[0].x, points[0].y, points[0].x + dx, points[0].y + dy);    
                }
                continue;
            }
            if (p.info == "round") {
                var lastp = (points[i - 1].info && points[i - 1].info == "skip") ? i - 2 : i - 1;
                if (lastp < 0) lastp = points.length - 1;
                dx = (points[i].x - points[lastp].x) / 2;
                dy = (points[i].y - points[lastp].y) / 2;
                ctx.lineTo(points[i].x - dx, points[i].y - dy);
                if (i < points.length - 1) {
                    var nextp = (points[i + 1].info && points[i + 1].info == "skip") ? i + 2 : i + 1;
                    if (nextp >= points.length) nextp = 0;
                    dx = (points[nextp].x - points[i].x) / 2;
                    dy = (points[nextp].y - points[i].y) / 2;
                } else {
                    dx = (points[0].x - points[i].x) / 2;
                    dy = (points[0].y - points[i].y) / 2;
                }
                ctx.quadraticCurveTo(p.x, p.y, p.x + dx, p.y + dy);    
            } else if (p.info == "smooth") {
                if (i < points.length - 1) {
                    npx = points[i + 1].x;
                    npy = points[i + 1].y;
                    i++;
                } else {
                    npx = points[0].x;
                    npy = points[0].y;
                }
                ctx.quadraticCurveTo(p.x, p.y, npx, npy);    
            } else {
                ctx.lineTo(p.x, p.y);
            }
        } else {
            ctx.lineTo(p.x, p.y);
        }
    }
    if (points[0].info && points[0].info == "round") {
        var lastp = (points[i - 1].info && points[i - 1].info == "skip") ? i - 2 : i - 1;
        dx = (points[0].x - points[lastp].x) / 2;
        dy = (points[0].y - points[lastp].y) / 2;
        ctx.lineTo(points[lastp].x + dx, points[lastp].y + dy);
        if (points[1].info && points[1].info == "skip") {
            dx = (points[2].x - points[0].x) / 4;
            dy = (points[2].y - points[0].y) / 4;
            ctx.quadraticCurveTo(points[0].x, points[0].y, points[0].x + dx, points[0].y + dy);    
        } else {
            dx = (points[1].x - points[0].x) / 2;
            dy = (points[1].y - points[0].y) / 2;
            ctx.quadraticCurveTo(points[0].x, points[0].y, points[0].x + dx, points[0].y + dy);    
        }
    } else if (points[0].info && points[0].info == "smooth") {
        ctx.quadraticCurveTo(points[0].x, points[0].y, points[1].x, points[1].y);    
    } else if (!points[0].info || points[0].info != "skip") {
        ctx.closePath();
    }
}

Polygon.prototype.pathRound = function(ctx, amount) {
    var points = this.points;
    if (points.length < 2) return;
    if (!amount) amount = 2;
    var spx = points[0].x;
    var spy = points[0].y;
    var npx = points[1].x;
    var npy = points[1].y;
    var dx = Math.abs(spx - npx) / amount;
    if (npx > spx) dx = -dx;
    var dy = Math.abs(spy - npy) / amount;
    if (npy > spy) dy = -dy;
    var startpoint = new Point(spx - dx, spy - dy);
    ctx.moveTo(startpoint.x, startpoint.y);
    npx += dx;
    npy += dy;
    ctx.lineTo(npx, npy);
    var sspx = npx;
    var sspy = npy;
    var cpx = 0;
    var cpy = 0;
    var epx = 0;
    var epy = 0;
    for (var i = 1; i < points.length - 1; i++) {
        cpx = points[i].x;
        cpy = points[i].y;
        if (i < points.length - 1) {
            epx = points[i + 1].x;
            epy = points[i + 1].y;
        } else {
            epx = points[0].x;
            epy = points[0].y;
        }
        dx = Math.abs(cpx - epx) / amount;
        if (epx < cpx) npx = cpx - dx;
        else npx = cpx + dx;
        dy = Math.abs(cpy - epy) / amount;
        if (epy < cpy) npy = cpy - dy;
        else npy = cpy + dy;
        ctx.quadraticCurveTo(cpx, cpy, npx, npy);
        if (epx < cpx) npx = epx + dx;
        else npx = epx - dx;
        if (epy < cpy) npy = epy + dy;
        else npy = epy - dy;
        if (distance(cpx, cpy, npx, npy) > 0) {
            ctx.lineTo(npx, npy);
        }
        spx = cpx;
        spy = cpy;
    }
    cpx = points[points.length - 2].x;
    cpy = points[points.length - 2].y;
    epx = points[points.length - 1].x;
    epy = points[points.length - 1].y;
    dx = Math.abs(cpx - epx) / amount;
    if (cpx < epx) npx = epx - dx;
    else npx = epx + dx;
    dy = Math.abs(cpy - epy) / amount;
    if (cpy < epy) npy = epy - dy;
    else npy = epy + dy;
    ctx.lineTo(npx, npy);
    cpx = epx;
    cpy = epy;
    epx = points[0].x;
    epy = points[0].y;
    dx = Math.abs(cpx - epx) / amount;
    if (epx < cpx) npx = cpx - dx;
    else npx = cpx + dx;
    dy = Math.abs(cpy - epy) / amount;
    if (epy < cpy) npy = cpy - dy;
    else npy = cpy + dy;
    ctx.quadraticCurveTo(cpx, cpy, npx, npy);
    cpx = npx;
    cpy = npy;
    epx = points[0].x;
    epy = points[0].y;
    dx = Math.abs(cpx - epx) / amount;
    if (epx < cpx) npx = epx + dx;
    else npx = epx - dx;
    dy = Math.abs(cpy - epy) / amount;
    if (epy < cpy) npy = epy + dy;
    else npy = epy - dy;
    ctx.lineTo(npx, npy);
    ctx.quadraticCurveTo(epx, epy, startpoint.x, startpoint.y);
}

Polygon.prototype.pathSmooth = function(ctx) {
    var points = this.points;
    var sxc = points[points.length - 1].x + ((points[0].x - points[points.length - 1].x) / 2);
    var syc = points[points.length - 1].y + ((points[0].y - points[points.length - 1].y) / 2);
    ctx.moveTo(sxc, syc);
    for (var i = 0; i < points.length - 1; i++) {
        if (points[i].info) {
            ctx.lineTo(points[i].x, points[i].y);
        } else {
            if (points[i + 1] && points[i + 1].info) {
                ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
            } else {
                var xc = (points[i].x + points[i + 1].x) / 2;
                var yc = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
        }
    }
    var lxc = points[points.length - 1].x;
    var lyc = points[points.length - 1].y;
    ctx.quadraticCurveTo(lxc, lyc, sxc, syc);    
}

























Polygon.prototype.draw = function(ctx) {
    
//   if (this.points.length == 4 && !this.crazy) {
//       if (!this.points[0].info && !this.points[1].info && !this.points[2].info && !this.points[3].info) {
//            var w = this.points[1].x - this.points[0].x;
//            var h = this.points[2].y - this.points[1].y;
//            ctx.fillRect(this.points[0].x, this.points[0].y, w, h); 
//            return;
//       }
//    }
    
    if (!this.cache) {
        this.path(ctx);
        ctx.fill();
        return;
    }
    var mbr = this.getMbr();
    var id = this.getId(ctx.fillStyle);
    if (!getCache(id)) {
        var cctx = createCache(id, ctx, mbr);
        this.translate(-mbr.x, -mbr.y);
        this.path(cctx);
        cctx.fill();
    }
    drawCache(id, ctx, mbr);
}

Polygon.prototype.drawOutline = function(ctx, color, weight) {
    if (!this.cache) {
        this.path(ctx);
        ctx.lineCap = "round";            
        ctx.strokeStyle = color;
        ctx.lineWidth = weight ? weight : .2;
        ctx.stroke();                
        return;
    }
    var mbr = this.getMbr();
    var id = this.getId("outline" + ctx.fillStyle);
    if (!getCache(id)) {
        var cctx = createCache(id, ctx, mbr);
        this.translate(-mbr.x, -mbr.y);
        this.path(cctx);
        cctx.lineCap = "round";            
        cctx.strokeStyle = color;
        cctx.lineWidth = weight ? weight : .2;
        cctx.stroke();                
    }
    drawCache(id, ctx, mbr);
}

Polygon.prototype.drawRound = function(ctx, radius) {
    if (!this.cache) {
        this.pathRound(ctx, radius);
        ctx.fill();
        return;
    }
    var mbr = this.getMbr();
    var id = this.getId("round-" + ctx.fillStyle);
    if (!getCache(id)) {
        var cctx = createCache(id, ctx, mbr);
        this.translate(-mbr.x, -mbr.y);
        this.pathRound(cctx);
        cctx.fill();
    }
    drawCache(id, ctx, mbr);
}

Polygon.prototype.drawOutlineRound = function(ctx, radius, color, weight) {
    if (!this.cache) {
        this.pathRound(ctx, radius);
        ctx.lineCap = "round";            
        ctx.strokeStyle = color;
        ctx.lineWidth = weight ? weight : .2;
        ctx.stroke();
        return;
    }
    var mbr = this.getMbr();
    var id = this.getId("outline" + ctx.fillStyle);
    if (!getCache(id)) {
        var cctx = createCache(id, ctx, mbr);
        this.translate(-mbr.x, -mbr.y);
        this.pathRound(cctx, radius);
        cctx.lineCap = "round";            
        cctx.strokeStyle = color;
        cctx.lineWidth = weight ? weight : .2;
        cctx.stroke();                
    }
    drawCache(id, ctx, mbr);
}

Polygon.prototype.drawSmooth = function(ctx) {
    if (!this.cache) {
        this.pathSmooth(ctx);
        ctx.fill();
        return;
    }
    var mbr = this.getMbr();
    var id = this.getId("smooth-" + ctx.fillStyle);
    if (!getCache(id)) {
        var cctx = createCache(id, ctx, mbr);
        this.translate(-mbr.x, -mbr.y);
        this.pathSmooth(cctx);
        cctx.fill();
    }
    drawCache(id, ctx, mbr);
}

Polygon.prototype.drawOutlineSmooth = function(ctx, color, weight) {
    if (!this.cache) {
        this.pathSmooth(ctx);
        ctx.lineCap = "round";            
        ctx.strokeStyle = color;
        ctx.lineWidth = weight ? weight : .2;
        ctx.stroke();                
        return;
    }
    var mbr = this.getMbr();
    var id = this.getId("outline" + ctx.fillStyle);
    if (!getCache(id)) {
        var cctx = createCache(id, ctx, mbr);
        this.translate(-mbr.x, -mbr.y);
        this.pathSmooth(cctx);
        cctx.lineCap = "round";            
        cctx.strokeStyle = color;
        cctx.lineWidth = weight ? weight : .2;
        cctx.stroke();                
    }
    drawCache(id, ctx, mbr);
}