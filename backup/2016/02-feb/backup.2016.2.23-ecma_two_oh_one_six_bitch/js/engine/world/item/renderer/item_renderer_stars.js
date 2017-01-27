"use strict";

function ItemRendererStars() {
    this.stars = new Array();
}

ItemRendererStars.prototype.drawStars = function(ctx, item, x, y, width, height, scale, stars) {
    ctx.fillStyle = "white";
    if (this.stars.length == 0) {
        let total = stars.total;
        for (let i = 0; i < total; i++) {
            let sx = random(0, item.width + 600);
            let sy = random(0, item.height);
            let s = random(1, 2);
            let cs = random(1, 3);
            this.stars[i] = {
                x: sx - 300,
                y: sy - 300,
                size : s,
                sparkle : false,
                cansparkle : cs == 1 ? true : false,
                sparklecount : 0,
                sparkletotal : 0,
            }
            this.drawStar(ctx, this.stars[i], x, y, scale);
        }
    } else {
        for (let i = 0; i < this.stars.length; i++) this.drawStar(ctx, this.stars[i], x, y, scale);
    }
}

ItemRendererStars.prototype.drawStar = function(ctx, star, x, y, scale) {
    

    let ddx;
    let ddy;
    
    let parallax = true;
    
    if (parallax) {
        ddx = star.x;
        ddy = star.y;
    } else {
        ddx = x + (star.x * scale);
        ddy = y + (star.y * scale);
    }
    
    let ss = star.size;

    if (star.cansparkle) {
        if (!star.sparkle) {
            let sparkle = random(1, 999);
            if (sparkle == 999) {
                star.sparkle = true;
                star.sparkletotal = random(3, 10);
            }
        } else {
            if (star.sparklecount < star.sparkletotal) {
                let spk = random(1, 2)
                ddx -= spk / 2;
                ddy -= spk / 2;
                ss += spk;
                star.sparklecount++;
            } else {
                star.sparklecount = 0;
                star.sparkle = false;
            }
        }
    }
    drawRect(ctx, ddx, ddy, ss, ss);
}