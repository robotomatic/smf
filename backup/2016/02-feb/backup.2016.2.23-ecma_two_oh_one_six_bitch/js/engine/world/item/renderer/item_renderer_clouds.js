"use strict";

function ItemRendererClouds() {
    this.clouds = new Array();
    this.cloudcache = new Array();
}

ItemRendererClouds.prototype.drawClouds = function(ctx, item, x, y, width, height, scale, clouds) {

    let color = clouds.color;
    ctx.fillStyle = color;

    let maxspeed = clouds.maxspeed;
    let maxwidth = clouds.maxwidth;
    let maxheight = clouds.maxheight;
    
    let offsety = (clouds.offsety) ? Number(clouds.offsety) : 0;
    
    if (this.clouds.length == 0) {

        let total = clouds.total;

        let ix = Math.abs(item.x);
        let iy = Math.abs(item.y);

        let xsector = item.width / total;
        
        for (let i = 0; i < total; i++) {
            
            let cwidth = random(maxwidth * .6, maxwidth);
            let cheight = random(maxheight *.6, maxheight);

            let cxs = i * xsector;
            let cx = random(0, xsector / 2) + cxs;

            let cy = random(0, item.height * .4) + offsety;
            
            let opacity  = random(5, 7) / 10;
            let speed = random(maxspeed / 2, maxspeed) / 10;
            
            this.clouds[i] = new Cloud(color, cx, cy, cwidth, cheight, opacity, speed);
            this.drawCloud(ctx, this.clouds[i], x, y, scale);
        }
    } else {
        for (let i = 0; i < this.clouds.length; i++) {
            let cloud = this.clouds[i];
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
    let id = cloud.id;
    let x = dx + (cloud.x * scale)
    let y = dy + (cloud.y * scale)
    let width = cloud.width * scale;
    let height = cloud.height * scale;
    if (this.cloudcache[id]) {
        let c = this.cloudcache[id];
        ctx.globalAlpha = cloud.opacity;
        ctx.drawImage(c.canvas, x, y, width, height);
        ctx.globalAlpha = 1;
    } else {
        let cx = 5;
        let cy = 5;
        let cw = cloud.width + 10;
        let ch = cloud.height + 10;
        let canvas = document.createElement('canvas');
        canvas.width = cw * 2;
        canvas.height = ch + (ch / 2);
        let cctx = canvas.getContext("2d");
        cloud.draw(cctx, cx, cy, cw, ch);
        blurCanvas(canvas, cctx, 2);
        this.cloudcache[id] = {
            canvas : canvas,
            ctx : cctx
        };
    }
}

function Cloud(color, x, y, width, height, opacity, speed) {
    this.id = x + "_" + y  + "_" + width  + "_" + height + "_" + opacity + "_" + speed;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.opacity = opacity;
    
    this.optstart = random(0, 4);
    let rs = random(1, 2) / 10;
    this.startw = width * rs;
    this.starth = random(25, 33) / 100;
    
    let rm = random(5, 8) / 10;
    this.mid = width * rm;
    
    let re = random(2, 3) / 10;
    this.endw = width * re;
    this.endh = random(60, 70) / 100;

    this.optend = random(0, 4);
    let ro = random(1, 4) / 10;
    this.optionalw = width * ro;
    this.optionalh = random(15, 25) / 100;
}

Cloud.prototype.draw = function(ctx, x, y, width, height) {

    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    
    let dw = width / this.width;

    let points = new Array();

    let sbw;
    let sbh;
    let sbx;
    let sby;
    
    if (this.optstart < 3) {
        sbw = this.startw * dw;
        sbh = height * this.starth;
        sbx = x;
        sby = y + (height  - sbh);

        points[points.length] = new Point(sbx, sby + sbh);

        points[points.length] = new Point(sbx, sby);
        points[points.length] = new Point(sbx + sbw, sby);
    } else {
        sbx = x;
        sbw = 0;
        points[points.length] = new Point(x, y + height);
    }
    
    let fbw = this.mid * dw;
    let fbh = height;
    let fbx = sbx + sbw;
    let fby = y;

    points[points.length] = new Point(fbx, fby);
    points[points.length] = new Point(fbx + fbw, fby);
    
    let ebw = this.endw * dw;
    let ebh = height * this.endh;
    let ebx = fbx + fbw;
    let eby = y + (height - ebh);

    points[points.length] = new Point(ebx, eby);
    points[points.length] = new Point(ebx + ebw, eby);
    
    if (this.optend < 2) {
        let obw = this.optionalw * dw;
        let obh = height * this.optionalh;
        let obx = ebx + ebw;
        let oby = y + (height - obh);
        
        points[points.length] = new Point(obx, oby);
        points[points.length] = new Point(obx + obw, oby);
        points[points.length] = new Point(obx + obw, oby + obh);
    } else {
        points[points.length] = new Point(ebx + ebw, eby + ebh);
    }
    
    drawRoundPolygon(ctx, points);
    
    ctx.globalAlpha = 1;
}