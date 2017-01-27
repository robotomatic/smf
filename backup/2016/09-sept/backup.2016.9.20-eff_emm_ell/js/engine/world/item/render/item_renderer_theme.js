"use strict";

function ItemRendererTheme() {
    this.itemrendererdynamic = new ItemRendererDynamic();
    this.itemrenderermaterial = new ItemRendererMaterial();
    this.box = new Rectangle();
    this.triangle = new Triangle(0, 0, 0, 0, 0);
    this.polygon = new Polygon();
}

ItemRendererTheme.prototype.render = function(ctx, color, item, window, x, y, titem, scale) { 
    
    var box = item.box;
    var width = box.width;
    var height = box.height;
    
    if (titem.parts) this.drawItemThemeParts(ctx, color, item, window, x, y, width, height, titem, scale);
    else this.drawItemThemePart(ctx, color, item, window, x, y, width, height, titem, scale);
}

ItemRendererTheme.prototype.drawItemThemeParts = function(ctx, color, item, window, x, y, width, height, titem, scale) { 
    var parts = titem.parts;
    var keys = Object.keys(parts);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var part = parts[keys[i]];
        this.drawItemThemePart(ctx, color, item, window, x, y, width, height, part, scale);
        if (part.parts && titem.itemtype != "group") {
            var c = this.getColor(ctx, part, part, x, y, width, height, scale, color);
            this.drawItemThemeParts(ctx, c, part, window, x, y, width, height, part, scale);
        }
    }
}

ItemRendererTheme.prototype.drawItemThemePart = function(ctx, color, part, window, x, y, width, height, titem, scale) { 
    var c = this.getColor(ctx, part, titem, x, y, width, height, scale, color);
    this.drawItem(ctx, c, part, window, x, y, width, height, titem, scale);
}


ItemRendererTheme.prototype.drawItem = function(ctx, color, item, window, x, y, width, height, titem, scale) { 
    if (!item.width || !item.height) return;
    if (this.itemrendererdynamic.render(ctx, color, item, window, x, y, titem, scale)) return;
    if (!this.itemrenderermaterial.render(ctx, item, titem, x, y, color, scale)) {
        this.drawItemTheme(ctx, color, item, window, x, y, width, height, titem, scale);    
    }
}

ItemRendererTheme.prototype.drawItemTheme = function(ctx, color, item, window, x, y, width, height, titem, scale) { 
    if (!titem) return false;
    if (titem.draw === false) return true;
    ctx.fillStyle = color;
    if (titem.itemtype == "group") {
//        this.polygon.points.length = 0;
//        this.polygon.setPoints(item.polygon.getPoints());
//        this.polygon.translate(x, y, scale);
//        this.polygon.draw(ctx);
    } else if (item.parts) {
        
        var parts = item.parts;
        var keys = Object.keys(parts);
        var t = keys.length;
        for (var i = 0; i < t; i++) {
            var part = parts[keys[i]];
            var px = x + part.x;
            var py = y + part.y;
            var pw = part.width;
            var ph = part.height;
            if (part.ramp) {
                this.triangle.info = part.ramp;
                this.triangle.x = round(x + (px * scale));
                this.triangle.y = round(y + (py * scale));
                this.triangle.width = round(pw * scale);
                this.triangle.height = round(ph * scale);
                this.triangle.draw(ctx);
            } else {
                this.box.x = round(x + (px * scale));
                this.box.y = round(y + (py * scale));
                this.box.width = round(pw * scale);
                this.box.height = round(ph * scale);
                this.box.draw(ctx);
            }
        }
        
    } else if (item.box) {
        this.box.x = x;
        this.box.y = y;
        this.box.width = item.box.width;
        this.box.height = item.box.height;
        this.box.draw(ctx);
    } else {
        
        
        
        this.box.x = x + (item.x * scale);
        this.box.y = y + (item.y * scale);
        this.box.width = item.width * scale;
        this.box.height = item.height * scale;
        this.box.draw(ctx);
    }
}

ItemRendererTheme.prototype.getColor = function(ctx, item, titem, x, y, width, height, scale, color) { 
    var c;
    if (titem && titem.color) c = titem.color;
    else if (item.color) c = item.color;    
    if (!c) return color;
    if (!c.gradient) {
        if (c.color) return c.color;
        return c;
    }
    var gradient = c.gradient;
    
//    var t = gradient.top ? ((gradient.top - item.y) * scale) + y  : y;
//    var h = gradient.height ? gradient.height * scale  : height;
//    if (isNaN(t) || isNaN(h)) return color;

    var t = y;
    if(gradient.top) {
        var d = item.y - gradient.top;
        var dy = d * scale;
        t = y - dy;
    }
    var h = height;
    if (gradient.height) h = gradient.height * scale;
    
    var g = ctx.createLinearGradient(0, t, 0, h + t);
    var start = gradient.start;
    var stop = gradient.stop;
    g.addColorStop(0, start);
    g.addColorStop(1, stop);
    return g;
}

