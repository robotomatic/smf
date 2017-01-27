"use strict";

function ItemRendererStars() {
    this.stars = new Array();
}

ItemRendererStars.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale) {
    this.drawStars(ctx, item, x, y, width, height, scale, titem);
}

ItemRendererStars.prototype.drawStars = function(ctx, item, x, y, width, height, scale, stars) {
    ctx.beginPath();
    ctx.fillStyle = "white";
    if (this.stars.length == 0) {
        var total = stars.renderer.total;
        for (var i = 0; i < total; i++) {
            var sx = random(0, item.width + 600);
            var sy = random(0, item.height);
            var s = random(1, 2);
            var cs = random(1, 3);
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
        for (var i = 0; i < this.stars.length; i++) this.drawStar(ctx, this.stars[i], x, y, scale);
    }
    ctx.beginPath();
}

ItemRendererStars.prototype.drawStar = function(ctx, star, x, y, scale) {
    
    var ddx;
    var ddy;
    
    var parallax = true;
    
    if (!parallax) {
        ddx = star.x;
        ddy = star.y;
    } else {
        
        var p = .2;
        
        ddx = (x * p) + (star.x * scale);
        ddy = (y * p) + (star.y * scale);
    }
    
    var ss = star.size;

    if (star.cansparkle) {
        if (!star.sparkle) {
            var sparkle = random(1, 999);
            if (sparkle == 999) {
                star.sparkle = true;
                star.sparkletotal = random(3, 10);
            }
        } else {
            if (star.sparklecount < star.sparkletotal) {
                var spk = random(1, 2)
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
    
    var r = new Rectangle(ddx, ddy, ss, ss);
    r.draw(ctx);
}