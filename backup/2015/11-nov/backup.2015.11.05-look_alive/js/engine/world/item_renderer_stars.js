ItemRendererStars = function() {
    this.stars = new Array();
}

ItemRendererStars.prototype.drawStars = function(ctx, item, x, y, width, height, scale, stars) {
    ctx.fillStyle = "white";
    if (this.stars.length == 0) {
        var total = stars.total;
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
            this.drawStar(ctx, this.stars[i]);
        }
    } else {
        for (var i = 0; i < this.stars.length; i++) this.drawStar(ctx, this.stars[i]);
    }
}

ItemRendererStars.prototype.drawStar = function(ctx, star) {
    
    var ddx = star.x;
    var ddy = star.y;
    
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
    drawRect(ctx, ddx, ddy, ss, ss);
}