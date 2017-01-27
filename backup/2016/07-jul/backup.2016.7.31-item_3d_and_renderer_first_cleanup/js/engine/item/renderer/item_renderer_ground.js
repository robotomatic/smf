"use strict";


/*


    TODO:
    
    - Need clean distinction between material and renderer
    - Move render logic to calling function
    - Tops have materials as well
    - Apply texture to supplied geometry only


    - need graphics class to wrap all canvas calls!!!!!!
    
    
    
*/



function ItemRendererGround() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemRendererGround.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale, drawdetails) {
    if (titem.renderer == "ground") this.drawPlatform(ctx, item, window, x, y, width, height, scale, titem, drawdetails);
    else this.drawPlatformBg(ctx, item, window, x, y, width, height, scale, titem, drawdetails);
}

ItemRendererGround.prototype.drawPlatform = function(ctx, item, window, x, y, width, height, scale, platform, drawdetails) {
    this.drawPlatformGround(ctx, item, window, x, y, width, height, scale, platform, drawdetails, true);
}

ItemRendererGround.prototype.drawPlatformBg = function(ctx, item, window, x, y, width, height, scale, platform, drawdetails) {
    this.drawPlatformGround(ctx, item, window, x, y, width, height, scale, platform, drawdetails, false);
}

ItemRendererGround.prototype.drawPlatformGround = function(ctx, item, window, x, y, width, height, scale, platform, drawdetails, tops) {
    if (!scale) scale = 1;
    var poly = new Polygon();
    var ip = item.getPolygon();
    poly.setPoints(ip.getPoints());
    poly.translate(x, y, scale);
    var mbr = poly.getMbr();
    width = mbr.width + 100;
    height = mbr.height;
    var color = platform.colorlight;
    var colordark = platform.colordark;
    this.drawGround(ctx, poly, x, y, width, height, scale, color, colordark, 25);
    if (tops) this.drawPlatformTops(ctx, item, x, y, scale, platform.colortoplight, platform);
}



ItemRendererGround.prototype.drawGround = function(ctx, polygon, x, y, width, height, scale, color, colordark, step) {

    this.canvas.width = width;
    this.canvas.height = height;
    
    var gy = y;
    var h = 400;
    var fcolor = "white";
    if (color.gradient) {
        var gradient = color.gradient;
        var g = ctx.createLinearGradient(0, gy, 0, h + gy);
        var start = gradient.start;
        var stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        color = g;
    }
    if (colordark.gradient) {
        var gradient = color.gradient;
        var g = ctx.createLinearGradient(0, gy, 0, h + gy);
        var start = gradient.start;
        var stop = gradient.stop;
        g.addColorStop(0, start);
        g.addColorStop(1, stop);
        colordark = g;
    }
    this.ctx.fillStyle = color;

    polygon.translate(-x, -y);
    polygon.drawRound(this.ctx, 10);

    this.ctx.globalCompositeOperation = 'source-atop';
    
    this.drawGroundLines(this.ctx, 0, 0, width, height, scale, colordark, step);
    this.drawGroundStones(this.ctx, 0, 0, width, height, scale, color, colordark);

    this.ctx.globalCompositeOperation = 'source-over';
    
    var img = new Image(this.canvas, 0, 0, width, height);
    img.draw(ctx, x, y, width, height);
}




ItemRendererGround.prototype.drawGroundLines = function(ctx, x, y, width, height, scale, color, step) {
    ctx.strokeStyle = color;
    ctx.lineWidth = .2 * scale;
    var wstep = 20;
    if (height <= step) step = height / 2;
    var amp = random(0, 10);
    var inc = 1;
    var p = new Polyline();
    for (var i = step; i < height; i+= step) {
        var s = i * scale;
        p.points.length = 0;
        p.addPoint(new Point(x, y + s));
        for (var ii = 0; ii < width; ii += wstep) {
            amp+= inc;
            if (amp > 10) inc = -1;
            else if (amp < 0) inc = 1;
            p.addPoint(new Point(x + ii, y + s + amp));
        }
        ctx.beginPath();
        p.draw(ctx);
    }
}

ItemRendererGround.prototype.drawGroundStones = function(ctx, x, y, width, height, scale, color, darkcolor) {
    var amt = height / 4;
    if (amt < 30) amt = 30;
    var max = 3;
    var tot = random(0, max);
    var double = false;
    for (var i = 0; i < tot; i++) {
        var cx = random(x, x + (width - amt));
        var cy = random(y, y + (height - amt));
        var cw = random(amt / 2, amt);
        var ch = cw;
        this.drawGroundStone(ctx, cx, cy, cw, ch, scale, color, darkcolor);
        var dd = random (1, 5);
        if (dd < 3 && !double) {
            var hcw = cw / 1.3;
            var hch = ch / 1.3;
            this.drawGroundStone(ctx, cx + hcw, cy + hch, cw / 2, ch / 2, scale, color, darkcolor);
            double = true;
        }
    }
}

ItemRendererGround.prototype.drawGroundStone = function(ctx, x, y, width, height, scale, color, darkcolor) {
    var poly = new Polygon();
    var amt = width / 5;
    poly.addPoint(new Point(x, y));
    poly.addPoint(new Point(x + width / 2, y - amt));
    poly.addPoint(new Point(x + width, y));
    poly.addPoint(new Point(x +width + amt, y + height / 2));
    poly.addPoint(new Point(x + width, y + height));
    poly.addPoint(new Point(x + width / 2, y + height + amt));
    poly.addPoint(new Point(x, y + height));
    poly.addPoint(new Point(x - amt, y + height / 2));
    var a = random(0, 360);
    var points = poly.rotate(a);
    poly.setPoints(points);
    var weight = .2 * scale;
    ctx.fillStyle = color;
    var rad = 5 * scale;
    ctx.beginPath();
    poly.drawRound(ctx, rad);
    ctx.beginPath();
    poly.drawOutlineRound(ctx, rad, darkcolor, weight);
}

























ItemRendererGround.prototype.drawPlatformTops = function(ctx, item, x, y, scale, color, theme) {
    var ptops = item.polytops;
    var offset = 5;
    var shadowoffset = offset * 1.5;
    var shadow = "#92938b";
    ctx.globalAlpha = .8;
    ctx.beginPath();
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false, theme);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true, theme);
}

ItemRendererGround.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset, details, theme) {

    var mbr = top.getMbr();
    if (mbr.width < 15 || mbr.height < 5) return;
    
    var angle = 50;
    var num = 15;
    var max = 12;
    var shadow = "#9dac4c";
    var t = top.points.length;
    var pl = new Polygon();
    for (var i = 0; i < t; i++) {
        var p = new Point(x + (top.points[i].x * scale), y + (top.points[i].y * scale) + (offset * scale));
        pl.addPoint(p);
        if (i == 0) {
            var distance = 1;
            var l = new Line(top.points[1], top.points[2]);
            var ld = l.length();
            if (ld > 60) {
                distance = 2;
                max = 8;
            }
            
            this.drawPlatformTopGrassStart(ctx, p, color, shadow, scale, max + 3, num / 3, angle + 10, distance);
            
        } else {
            var h = Math.round(t / 2, 0) - 1;
            if (i == h) {
                var distance = 1;
                var l = new Line(top.points[i - 2], top.points[i - 1]);
                var ld = l.length();
                if (ld > 60) {
                    distance = 2;    
                    max = 8;
                }
                
                this.drawPlatformTopGrassEnd(ctx, p, color, shadow, scale, max + 3, num / 3, angle + 10, distance);
                
            }
        }
    }
    
    ctx.fillStyle = color;
    
    ctx.beginPath();
    pl.drawRound(ctx, 20);
}

ItemRendererGround.prototype.drawPlatformTopGrassStart = function(ctx, point, color, shadow, scale, max, num, angle, distance) {
    for (var d = 0; d < distance; d++) {
        for (var i = 0; i < num; i++) {
            var qm = i + (d * 10);
            var em = max / 8;
            var px = point.x + (qm * scale);
            var py = point.y + (em * scale);;
            var grass = new ItemRendererGrass();
            grass.drawGrassBlades(ctx, new Point(px, py), color, shadow, scale, -angle, max);
            grass.drawGrassBlades(ctx, new Point(px + (10 * scale), py), color, shadow, scale, -angle / 2, max / 1.5);
            grass.drawGrassBlades(ctx, new Point(px + (15 * scale), py), color, shadow, scale, -angle / 2, max / 2);
        }
    }
    
}

ItemRendererGround.prototype.drawPlatformTopGrassEnd = function(ctx, point, color, shadow, scale, max, num, angle, distance) {
    for (var d = 0; d < distance; d++) {
        for (var i = 0; i < num; i++) {
            var qm = i + (d * 10);
            var em = max / 8;
            var px = point.x - (qm * scale);
            var py = point.y + (em * scale);
            var grass = new ItemRendererGrass();
            grass.drawGrassBlades(ctx, new Point(px, py), color, shadow, scale, 30, max, angle);
            grass.drawGrassBlades(ctx, new Point(px - (10 * scale), py), color, shadow, scale, angle / 2, max / 1.5);
            grass.drawGrassBlades(ctx, new Point(px - (15 * scale), py), color, shadow, scale, angle / 2, max / 2);
        }
    }
}