function Layer() {
    this.name;
    this.collide = false;
    this.draw = true;
    this.cssblur = "";
    this.blur = false;
    this.scale = 1;
    this.cache = true;
    this.lighten = false;
    this.parallax = 0;
    this.width = "";
    this.items;
    this.lastX;
    this.lastY;
    this.lastW;
    this.lastH;
}

Layer.prototype.loadJson = function(json) {
    this.name = json.name;
    this.collide = json.collide;
    this.draw = json.draw;
    this.cssblur = json.cssblur;
    this.blur = json.blur;
    this.scale = (json.scale) ? json.scale : 1;
    this.cache = (json.cache === false) ? false : true;
    this.lighten = json.lighten;
    this.parallax = json.parallax;
    this.width = json.width;
    this.items = json.items;
    return this;
}

Layer.prototype.getItems = function() { return this.items; }

Layer.prototype.drawItem = function(ctx, item, x, y, width, height, renderer) {
    var color;
    if (item.color) {
        if (item.color.gradient) {
            var gradient = item.color.gradient;
            var g = ctx.createLinearGradient(0, y, 0, height + y);
            var start = gradient.start;
            var stop = gradient.stop;
            if (this.lighten) {
                start = lightenColor(start, this.lighten);
                stop = lightenColor(stop, this.lighten);
            }
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        } else {
            color = item.color;
            if (this.lighten) color = lightenColor(color, this.lighten);
        }
    } else {
        color = "#A3B5A3";
        if (this.lighten) color = lightenColor(color, this.lighten);
    }
    if (renderer) renderer.drawItem(ctx, color, item, x, y, width, height, this.lighten);
    else {
        ctx.fillStyle = color; 
        drawRect(ctx, x, y, width, height); 
    }
}