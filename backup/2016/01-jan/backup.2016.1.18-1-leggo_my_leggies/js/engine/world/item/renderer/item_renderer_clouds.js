ItemRendererClouds = function() {
    this.clouds = new Array();
    this.cloudcache = new Array();
}

ItemRendererClouds.prototype.drawClouds = function(ctx, item, x, y, width, height, scale, clouds) {

    var color = clouds.color;
    ctx.fillStyle = color;

    var maxspeed = clouds.maxspeed;
    var maxwidth = clouds.maxwidth;
    var maxheight = clouds.maxheight;
    
    var offsety = (clouds.offsety) ? Number(clouds.offsety) : 0;
    
    if (this.clouds.length == 0) {

        var total = clouds.total;

        var ix = Math.abs(item.x);
        var iy = Math.abs(item.y);

        var xsector = item.width / total;
        
        for (var i = 0; i < total; i++) {
            
            var cwidth = random(maxwidth * .6, maxwidth);
            var cheight = random(maxheight *.6, maxheight);

            var cxs = i * xsector;
            var cx = random(0, xsector / 2) + cxs;

            var cy = random(0, item.height * .4) + offsety;
            
            var opacity  = random(5, 7) / 10;
            var speed = random(maxspeed / 2, maxspeed) / 10;
            
            this.clouds[i] = new Cloud(color, cx, cy, cwidth, cheight, opacity, speed);
            this.drawCloud(ctx, this.clouds[i], x, y, scale);
        }
    } else {
        for (var i = 0; i < this.clouds.length; i++) {
            var cloud = this.clouds[i];
            this.drawCloud(ctx, cloud, x, y, scale);

            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < item.x) {
                cloud.x = item.x + item.width + Math.abs(item.x);
                
                cloud.width = random(maxwidth * .6, maxwidth);
                cloud.height = random(maxheight * .6, maxheight);

                cloud.y = random(0, item.height * .4) + offsety;
                
                cloud.opacity  = random(5, 7) / 10;
                cloud.speed = random(maxspeed / 2, maxspeed) / 10;
            }
            
        }
    }
}

ItemRendererClouds.prototype.drawCloud = function(ctx, cloud, dx, dy, scale) {
    var id = cloud.id;
    var x = dx + (cloud.x * scale)
    var y = dy + (cloud.y * scale)
    var width = cloud.width * scale;
    var height = cloud.height * scale;
    if (this.cloudcache[id]) {
        var c = this.cloudcache[id];
        ctx.globalAlpha = cloud.opacity;
        ctx.drawImage(c.canvas, x, y, width, height);
        ctx.globalAlpha = 1;
    } else {
        var cx = 5;
        var cy = 5;
        var cw = cloud.width + 10;
        var ch = cloud.height + 10;
        var canvas = document.createElement('canvas');
        canvas.width = cw * 2;
        canvas.height = ch + (ch / 2);
        var cctx = canvas.getContext("2d");
        cloud.draw(cctx, cx, cy, cw, ch);
        blurCanvas(canvas, cctx, 2);
        this.cloudcache[id] = {
            canvas : canvas,
            ctx : cctx
        };
    }
}

Cloud = function(color, x, y, width, height, opacity, speed) {
    this.id = x + "_" + y  + "_" + width  + "_" + height + "_" + opacity + "_" + speed;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.opacity = opacity;
    
    this.optstart = random(0, 4);
    var rs = random(1, 2) / 10;
    this.startw = width * rs;
    this.starth = random(25, 33) / 100;
    
    var rm = random(5, 8) / 10;
    this.mid = width * rm;
    
    var re = random(2, 3) / 10;
    this.endw = width * re;
    this.endh = random(60, 70) / 100;

    this.optend = random(0, 4);
    var ro = random(1, 4) / 10;
    this.optionalw = width * ro;
    this.optionalh = random(15, 25) / 100;
}

Cloud.prototype.draw = function(ctx, x, y, width, height) {

    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    
    var dw = width / this.width;

    var points = new Array();
    
    if (this.optstart < 3) {
        var sbw = this.startw * dw;
        var sbh = height * this.starth;
        var sbx = x;
        var sby = y + (height  - sbh);

        points[points.length] = new Point(sbx, sby + sbh);

        points[points.length] = new Point(sbx, sby);
        points[points.length] = new Point(sbx + sbw, sby);
    } else {
        sbx = x;
        sbw = 0;
        points[points.length] = new Point(x, y + height);
    }
    
    var fbw = this.mid * dw;
    var fbh = height;
    var fbx = sbx + sbw;
    var fby = y;

    points[points.length] = new Point(fbx, fby);
    points[points.length] = new Point(fbx + fbw, fby);
    
    var ebw = this.endw * dw;
    var ebh = height * this.endh;
    var ebx = fbx + fbw;
    var eby = y + (height - ebh);

    points[points.length] = new Point(ebx, eby);
    points[points.length] = new Point(ebx + ebw, eby);
    
    if (this.optend < 2) {
        var obw = this.optionalw * dw;
        var obh = height * this.optionalh;
        var obx = ebx + ebw;
        var oby = y + (height - obh);
        
        points[points.length] = new Point(obx, oby);
        points[points.length] = new Point(obx + obw, oby);
        points[points.length] = new Point(obx + obw, oby + obh);
    } else {
        points[points.length] = new Point(ebx + ebw, eby + ebh);
    }
    
    drawRoundPolygon(ctx, points);
    
    ctx.globalAlpha = 1;
}