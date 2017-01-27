ItemRendererClouds = function() {
    this.clouds = new Array();
}

ItemRendererClouds.prototype.drawClouds = function(ctx, item, x, y, width, height, scale, clouds) {

    //  need fewer, but bigger, clouds with better distribution
    // also: cache!!!!!
    
    
    var color = clouds.color;
    ctx.fillStyle = color;
    
    if (this.clouds.length == 0) {

        var total = clouds.total;

        
        var ix = Math.abs(item.x);
        var iy = Math.abs(item.y);
        var maxwidth = clouds.maxwidth;
        var maxheight = clouds.maxheight;

        var maxspeed = clouds.maxspeed;
        
        for (var i = 0; i < total; i++) {
            
            var cwidth = random(maxwidth * .6, maxwidth);
            var cheight = random(maxheight *.6, maxheight);

            var cx = random(i, item.width);
            var cy = random(cheight + 20, item.height * .6 - 50);
            
            var speed = random(1, maxspeed) / 100;
            var opacity  = random(4, 10) / 10;
            
            var cloud = {
                color: color,
                opacity : opacity,
                x : cx,
                y : cy,
                width : cwidth,
                height : cheight,
                speed : speed
            };
            this.clouds[i] = cloud;
            this.drawCloud(ctx, cloud, x, y, scale);
        }
    } else {
        for (var i = 0; i < this.clouds.length; i++) {
            var cloud = this.clouds[i];
            this.drawCloud(ctx, cloud, x, y, scale);

            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < item.x) {
                cloud.x = item.x + item.width + Math.abs(item.x);
            }
            
        }
    }
}

ItemRendererClouds.prototype.drawCloud = function(ctx, cloud, dx, dy, scale) {

    var x = dx + (cloud.x * scale)
    var y = dy + (cloud.y * scale)
    var width = cloud.width * scale;
    var height = cloud.height * scale;
    ctx.fillStyle = cloud.color;
    ctx.globalAlpha = cloud.opacity;
    
    
    drawRoundRect(ctx, x, y, width, height, 25);
    
    
    
    
    ctx.globalAlpha = 1;
}

