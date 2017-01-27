"use strict";

function ItemRendererTheme() {
    this.itemrendererdynamic = new ItemRendererDynamic();
    this.itemrenderermaterial = new ItemRendererMaterial();
    this.box = new Rectangle();
    this.triangle = new Triangle(0, 0, 0, 0, 0);
    this.polygon = new Polygon();
}

ItemRendererTheme.prototype.render = function(ctx, color, item, window, x, y, width, height, titem, scale, name) { 
    if (titem.parts) this.drawItemThemeParts(ctx, color, item, window, x, y, width, height, titem, scale, name);
    else this.drawItemThemePart(ctx, color, item, window, x, y, width, height, titem, scale, false, name);
}

ItemRendererTheme.prototype.drawItemThemeParts = function(ctx, color, item, window, x, y, width, height, titem, scale, name) { 
    var parts = titem.parts;
    var keys = Object.keys(parts);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var part = parts[keys[i]];
        this.drawItemThemePart(ctx, color, part, window, x, y, width, height, part, scale, true, name);
        if (part.parts && titem.itemtype != "group") {
            var c = this.getColor(ctx, part, part, x, y, width, height, scale, color);
            this.drawItemThemeParts(ctx, c, part, window, x, y, width, height, part, scale, true, name);
        }
    }
}

ItemRendererTheme.prototype.drawItemThemePart = function(ctx, color, part, window, x, y, width, height, titem, scale, relative, name) { 
    var c = this.getColor(ctx, part, titem, x, y, width, height, scale, color);
    this.drawItem(ctx, c, part, window, x, y, width, height, titem, scale, relative, name);
}


ItemRendererTheme.prototype.drawItem = function(ctx, color, item, window, x, y, width, height, titem, scale, relative, name) { 
    if (!item.width || !item.height) return;
    if (this.itemrendererdynamic.render(ctx, color, item, window, x, y, width, height, titem, scale, name)) return;
    if (!this.itemrenderermaterial.render(ctx, item, titem, x, y, width, height, color, scale)) {
        this.drawItemTheme(ctx, color, item, window, x, y, width, height, titem, scale, relative);    
    }
}

ItemRendererTheme.prototype.drawItemTheme = function(ctx, color, item, window, x, y, width, height, titem, scale, relative) { 
    if (!titem) return false;
    if (titem.draw === false) return true;
    ctx.fillStyle = color;
    if (titem.itemtype == "group") {
        this.polygon.points.length = 0;
        this.polygon.setPoints(item.polygon.getPoints());
        this.polygon.translate(x, y, scale);
        this.polygon.draw(ctx);
    } else if (relative) {
        this.box.x = round(x + (width * (item.x / 100)));
        this.box.y = round(y + (height * (item.y / 100)));
        this.box.width = round(width * (item.width / 100));
        this.box.height = round(height * (item.height / 100));
        this.box.draw(ctx);
    } else if (item.parts) {
        var parts = item.parts;
        var keys = Object.keys(parts);
        var t = keys.length;
        for (var i = 0; i < t; i++) {
            var part = parts[keys[i]];
            var px = part.x;
            var py = part.y;
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
    } else {
        this.box.x = round(x);
        this.box.y = round(y);
        this.box.width = round(width);
        this.box.height = round(height);
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
    var t = gradient.top ? ((gradient.top - item.y) * scale) + y  : y;
    var h = gradient.height ? gradient.height * scale  : height;
    if (isNaN(t) || isNaN(h)) return color;
    var g = ctx.createLinearGradient(0, t, 0, h + t);
    var start = gradient.start;
    var stop = gradient.stop;
    g.addColorStop(0, start);
    g.addColorStop(1, stop);
    return g;
}

