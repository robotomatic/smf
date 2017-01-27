Polygon = function() {
    this.points = new Array();
    this.tops = new Array();
    this.bottoms = new Array();
    this.sides = new Array();
    this.path = null;
    this.mbr = null;
}

Polygon.prototype.translate = function(x, y, scale) {
    scale = scale || 1;
    for (var i = 0; i < this.points.length; i++) {
        this.points[i].x = x + (this.points[i].x * scale);
        this.points[i].y = y + (this.points[i].y * scale);
    }
    this.mbr = null;
}
    
Polygon.prototype.craziness = function(craziness) {
    for (var i = 0; i < this.points.length; i++) {
        var npx = this.points[i].x;
        var npy = this.points[i].y;
        var amt = random(1, craziness + 1);
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
    return new Point(mbr.x + (mbr.width / 2), mbr.y + (mbr.height / 2));
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
            //else this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y + rects[1].height));
            this.addPoint(new Point(rects[0].x, rects[0].y + rects[0].height));
            //this.addPoint(new Point(rects[1].x, rects[1].y + rects[1].height));
        } else {
            // botom left
            this.addPoint(new Point(rects[1].x, rects[1].y));
            this.addPoint(new Point(rects[0].x, rects[0].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y + rects[0].height));
            this.addPoint(new Point(rects[0].x, rects[0].y + rects[0].height));
            //this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y + rects[1].height));
            //this.addPoint(new Point(rects[1].x, rects[1].y + rects[1].height));
        }
    } else {
        if (rects[0].y > rects[1].y) {
            // top right
            this.addPoint(new Point(rects[0].x, rects[0].y));
            this.addPoint(new Point(rects[1].x, rects[1].y));
            this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y));
            if (rects[1].x + rects[1].width < rects[0].x + rects[0].width) this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            //else this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y + rects[1].height));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y + rects[0].height));
            this.addPoint(new Point(rects[0].x, rects[0].y + rects[0].height));
        } else {
            // botom right
            this.addPoint(new Point(rects[0].x, rects[0].y));
            this.addPoint(new Point(rects[0].x + rects[0].width, rects[0].y));
            this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y));
            //this.addPoint(new Point(rects[1].x + rects[1].width, rects[1].y + rects[1].height));
            //this.addPoint(new Point(rects[1].x, rects[1].y + rects[1].height));
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
//    this.points = new Array();
//    for (var i = 0; i < rects.length; i++) {
//        var rect = rects[i];
//        if (!rect.pointinfo || !rect.pointinfo["0"]) this.addPoint(new Point(rect.x, rect.y));
//        if (!rect.pointinfo || !rect.pointinfo["1"]) this.addPoint(new Point(rect.x + rect.width, rect.y));
//    }
//    for (var i = rects.length; i > 0; i--) {
//        var rect = rects[i - 1];
//        if (!rect.pointinfo || !rect.pointinfo["2"]) this.addPoint(new Point(rect.x + rect.width, rect.y + rect.height));
//        if (!rect.pointinfo || !rect.pointinfo["3"]) this.addPoint(new Point(rect.x, rect.y + rect.height));
//    }
//    this.mbr = null;
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
        
        var cx1 = current.x;
        var cy1 = current.y;
        var cx2 = current.x + current.width;
        var cy2 = current.y + current.height;

        var px1 = prev.x;
        var py1 = prev.y;
        var px2 = prev.x + prev.width;
        var py2 = prev.y + prev.height;
        
        var nx1 = next.x;
        var ny1 = next.y;
        var nx2 = next.x + next.width;
        var ny2 = next.y + next.height;
        
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
    makePolygon(ctx, this.points);
}

Polygon.prototype.pathRound = function(ctx, amount) {
    makeRoundPolygon(ctx, this.points, amount);
}

Polygon.prototype.draw = function(ctx, outline, color, linewidth) {
    drawPolygon(ctx, this.points);
    if (outline) drawPolygonOutline(ctx, this.points, color, linewidth);
}

Polygon.prototype.drawOutline = function(ctx, color, linewidth) {
    drawPolygonOutline(ctx, this.points, color, linewidth);
}

Polygon.prototype.drawRound = function(ctx, radius, outline, color, linewidth) {
    drawRoundPolygon(ctx, this.points, radius);
    if (outline) drawRoundPolygonOutline(ctx, this.points, radius, color, linewidth);
}

Polygon.prototype.drawOutlineRound = function(ctx, radius, color, linewidth) {
    drawRoundPolygonOutline(ctx, this.points, radius, color, linewidth);
}

Polygon.prototype.drawSmooth = function(ctx, outline, color, linewidth) {
    drawSmoothPolygon(ctx, this.points);
    if (outline) drawSmoothPolygonOutline(ctx, this.points, color, linewidth);
}

Polygon.prototype.drawOutlineSmooth = function(ctx, color, linewidth) {
    drawSmoothPolygonOutline(ctx, this.points, color, linewidth);
}
