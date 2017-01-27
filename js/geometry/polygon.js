"use strict";

function Polygon(points) {
    this.points = new Array();
    this.tops = new Array();
    this.bottoms = new Array();
    this.sides = new Array();
    this.outline = new Array();
    this.leftpoints = new Array();
    this.rightpoints = new Array();
    this.point = new Point(0, 0);
    this.line = new Line(new Point(0, 0), new Point(0, 0));
    this.crazy = 0;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.center = new Point(0, 0);
    this.cache = false;
    this.id = "";
    if (points) this.setPoints(points);
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
    this.mbr.width = 0;
}
    
Polygon.prototype.scale = function(scale) {

    scale = scale || 1;

    // here
    var mbr = this.getMbr();
    var points = new Array();

    var line = new Line()
    line.start.x = mbr.x;
    line.start.y = mbr.y;
    
    for (var i = 0; i < this.points.length; i++) {
        line.end.x = this.points[i].x;
        line.end.y = this.points[i].y;
        line.scale(scale);
        points[i] = new Point(line.end.x, line.end.y);
    }
    this.mbr.width = 0;
    return new Polygon(points);
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
    this.mbr.width = 0;
}

Polygon.prototype.rotate = function(deg, cp) {
    var center = cp ? cp : this.getCenter();
    var points = this.getPoints();
    var out = new Array();
    var l;
    for (var i = 0; i < this.points.length; i++) {
        this.line.start = center;
        this.line.end = points[i];
        this.line = this.line.rotate(deg);
        out[out.length] = this.line.end;
    }
    return out;
}


Polygon.prototype.getMbr = function() {
    
    if (this.mbr.width) return this.mbr;
    
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
    
    this.mbr.x = minx;
    this.mbr.y = miny;
    this.mbr.width = w;
    this.mbr.height = h;
    return this.mbr;
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
    this.addPoints(points);
}

Polygon.prototype.addPoints = function(points) {
    for (var i = 0; i < points.length; i++) this.addPoint(points[i]);
    this.mbr.width = 0;
}

Polygon.prototype.addPoint = function(point) {
    this.addPointXY(point.x, point.y, point.info);
}

Polygon.prototype.addPointXY = function(x, y, info = null) {
    var ok = true;
    var t = this.points.length;
    for (var i = 0; i < t; i++) {
        var p = this.points[i];
        var d = distance(p.x, p.y, x, y);
        if (d == 0) {
            ok = false;
            break;
        }
    }
    if (!ok) return;
    this.points[this.points.length] = new Point(x, y, info);
    this.mbr.width = 0;
}





Polygon.prototype.filterChain = function(rects) {

    this.points.length = 0;
    
    if (rects[0].x > rects[1].x) {
        if (rects[0].y > rects[1].y) {
            //  top left
            this.addPointXY(rects[1].x, rects[1].y);
            this.addPointXY(rects[1].x + rects[1].width, rects[1].y);
            this.addPointXY(rects[0].x + rects[0].width, rects[0].y);
            if (rects[1].x + rects[1].width < rects[0].x + rects[0].width) this.addPointXY(rects[0].x + rects[0].width, rects[0].y);
            this.addPointXY(rects[0].x, rects[0].y + rects[0].height);
        } else {
            // botom left
            this.addPointXY(rects[1].x, rects[1].y);
            this.addPointXY(rects[0].x, rects[0].y);
            this.addPointXY(rects[0].x + rects[0].width, rects[0].y);
            this.addPointXY(rects[0].x + rects[0].width, rects[0].y + rects[0].height);
            this.addPointXY(rects[0].x, rects[0].y + rects[0].height);
        }
    } else {
        if (rects[0].y > rects[1].y) {
            // top right
            this.addPointXY(rects[0].x, rects[0].y);
            this.addPointXY(rects[1].x, rects[1].y);
            this.addPointXY(rects[1].x + rects[1].width, rects[1].y);
            if (rects[1].x + rects[1].width < rects[0].x + rects[0].width) this.addPointXY(rects[0].x + rects[0].width, rects[0].y);
            this.addPointXY(rects[0].x + rects[0].width, rects[0].y + rects[0].height);
            this.addPointXY(rects[0].x, rects[0].y + rects[0].height);
        } else {
            // botom right
            this.addPointXY(rects[0].x, rects[0].y);
            this.addPointXY(rects[0].x + rects[0].width, rects[0].y);
            this.addPointXY(rects[1].x + rects[1].width, rects[1].y);
            this.addPointXY(rects[0].x + rects[0].width, rects[0].y + rects[0].height);
            this.addPointXY(rects[0].x, rects[0].y + rects[0].height);
        }
    }
    
    this.mbr.width = 0;
}

Polygon.prototype.filterPoints = function(rects) {
    var minpx;
    var minpy;
    var maxpx;
    var maxpy;
    
    this.outline.length = 0;
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
            this.outline[this.outline.length] = new Point(this.points[i].x, this.points[i].y);
            if (this.points[i].info) this.outline[this.outline.length - 1].setInfo(this.points[i].info);
        }
    }
    if (!this.outline.length) return;
    
    this.point.x = minpx + ((maxpx - minpx) / 2);
    this.point.y = minpy + ((maxpy - minpy) / 2);
    
    this.leftpoints.length = 0;
    this.rightpoints.length = 0;
    var angle;

    this.line.start.x = this.point.x;
    this.line.start.y = this.point.y;
    for (var i = 0; i < this.outline.length; i++) {
        this.line.end.x = this.outline[i].x;
        this.line.end.y = this.outline[i].y;
        angle = this.line.angle();
        if (angle <= 90 && angle >= -90) {
            this.leftpoints[this.leftpoints.length] = new Point(this.outline[i].x, this.outline[i].y);
            if (this.outline[i].info) this.leftpoints[this.leftpoints.length - 1].setInfo(this.outline[i].info);
        } else {
            this.rightpoints[this.rightpoints.length] = new Point(this.outline[i].x, this.outline[i].y);
            if (this.outline[i].info) this.rightpoints[this.rightpoints.length - 1].setInfo(this.outline[i].info);
        }
    }
    this.points.length = 0;
    if (this.leftpoints.length) {
        this.leftpoints.sort(sortByPositionY);
        var pn = 0;
        for (var i = 0; i < this.leftpoints.length; i++) {
            var p = this.leftpoints[i];
            this.addPoint(p);
        }
    }
    if (this.rightpoints.length) {
        this.rightpoints.sort(sortByPositionY);
        this.rightpoints.reverse();
        var pn = 0;
        for (var i = 0; i < this.rightpoints.length; i++) {
            var p = this.rightpoints[i];
            this.addPoint(p);
        }
    }
    this.mbr.width = 0;
}

Polygon.prototype.filterJoin = function(rects) {
}




Polygon.prototype.createPolygon = function(items) {
    
    if (!items) return;

    this.points.length = 0;
    this.tops.length = 0;
    this.bottoms.length = 0;
    this.sides.length = 0;

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
                if (this.points.length > 1) {
                    var l = new Line(sp, ep);
                    if (l.length() > 1) this.tops[this.tops.length] = l;
                }
            }
        } else  {
            if (!turn) {
                var cx = cx1;
                if (px2 > cx1) cx = px2;

                if (current.ramp && current.ramp == "left") {
                    this.points[this.points.length] = new Point(cx, cy1);
                    this.points[this.points.length] = new Point(cx2, cy2);
                } else {
                    this.points[this.points.length] = new Point(cx, cy1);
                    this.points[this.points.length] = new Point(cx2, cy1);
                }
                
                this.tops[this.tops.length] = new Line(this.points[this.points.length - 2], this.points[this.points.length - 1]);    
                turn = true;
            }
            
            if (!current.ramp || !current.ramp == "left") {
                if (!current.ramp || current.ramp != "right-top") {
                    if (cx1 != nx1) this.points[this.points.length] = new Point(cx2, cy2);
                }
                if (nx2 > cx1 && (i < t - 1)) {
                    cx1 = nx2;
                }
                if (!current.ramp || current.ramp != "left-top") {
                    this.points[this.points.length] = new Point(cx1, cy2);
                }
            }
        }
    }
    
    if (current.ramp && current.ramp == "left") {
        var prev = items[t - 2];

        var pp = this.points[this.points.length - 1];
        
        this.points[this.points.length] = new Point(pp.x - prev.height, pp.y);
        var tt = t - 2;
        for (var ii = tt; ii > -1; ii--) {
            var it = items[ii];
            this.points[this.points.length] = new Point(it.x + it.width, it.y + it.height);    
            if (!it.ramp) this.points[this.points.length] = new Point(it.x, it.y + it.height);    
        }
    } else {
        if (cx1 <= nx2) nx2 = cx1;
        this.points[this.points.length] = new Point(nx2, ny2);
        this.points[this.points.length] = new Point(nx1, ny2);
        
        // could be here
        
    }

    
    this.mbr.width = 0;
    
    return this.points;
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

Polygon.prototype.pathSimple = function(ctx) {
    var points = this.points;
    if (!points.length) return;
    ctx.moveTo(points[0].x, points[0].y);
    var t = points.length;
    for (var i = 1; i < t; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
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
    this.path(ctx);
    ctx.fill();
}

Polygon.prototype.drawOutline = function(ctx, color, weight) {
    this.path(ctx);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();                
}

Polygon.prototype.drawRound = function(ctx, radius) {
    this.pathRound(ctx, radius);
    ctx.fill();
}

Polygon.prototype.drawOutlineRound = function(ctx, radius, color, weight) {
    this.pathRound(ctx, radius);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();
}

Polygon.prototype.drawSmooth = function(ctx) {
    this.pathSmooth(ctx);
    ctx.fill();
}

Polygon.prototype.drawOutlineSmooth = function(ctx, color, weight) {
    this.pathSmooth(ctx);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();                
}








Polygon.prototype.containsPoint = function(point) {
    var i, j;
    var inside = false;
    for (i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
        if(((this.points[i].y > point.y) != (this.points[j].y > point.y)) && 
           (point.x < (this.points[j].x-this.points[i].x) * (point.y-this.points[i].y) / (this.points[j].y-this.points[i].y) + this.points[i].x) ) inside = !inside;
    }
    return inside;
}