function ItemRenderer(theme) {
    this.theme = theme;
    this.outlinecolor = "#424242";
    this.outlinewidth = 2;
    this.outlineopacity = null;
}

ItemRenderer.prototype.drawItem = function(ctx, color, item, x, y, width, height, lighten, outline, outlinewidth) {
    if (!this.theme) {
        ctx.fillStyle = color ? color : "magenta";
        drawRect(ctx, x, y, width, height);
        return; 
    }
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) {
        ctx.fillStyle = color ? color : "magenta";
        drawRect(ctx, x, y, width, height);
        return; 
    }
    var color = titem.color;
    if (color) {
        if (color.gradient) {
            var gradient = color.gradient;
            try {
                var g = ctx.createLinearGradient(0, y, 0, height + y);
                var start = gradient.start;
                var stop = gradient.stop;
                if (lighten) {
                    start = lightenColor(start, this.lighten);
                    stop = lightenColor(stop, this.lighten);
                }
                g.addColorStop(0, start);
                g.addColorStop(1, stop);
                color = g;
            } catch (e) {
                color = "magenta";
            }
        } else if (lighten) color = lightenColor(color, lighten);
    } else {
        color = color ? color : "magenta";
    }
    if (titem.parts) {
        var arr = [];
        for (prop in titem) arr.push(prop);
        var bitem = {};
        for (var n = arr.length; n--;) bitem[arr[n]] = titem[arr[n]];
        if (outline) {
            outlinewidth = outlinewidth ? outlinewidth : this.outlinewidth
            this.drawItemParts(ctx, bitem.parts, x, y, width, height, this.outlinecolor, false, true, outlinewidth, this.outlineopacity);
        }
        this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, lighten, false);
    } else {
        ctx.fillStyle = color;
        if (outline === true) {
            outlinewidth = outlinewidth ? outlinewidth : this.outlinewidth
            drawRectOutline(ctx, this.outlinecolor, x, y, width, height, outlinewidth, this.outlineopacity);
        }
        drawRect(ctx, x, y, width, height);
    }
}

ItemRenderer.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity) { 
    for (var part in parts) this.drawItemPart(ctx, parts[part], x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity);
}

ItemRenderer.prototype.drawItemPart = function(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity) {
    this.drawPart(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity);
    if (outline === true) return;
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, part.parts, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity);
    }
}

ItemRenderer.prototype.drawPart = function(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity) {
    if (part.height && part.width) {
        var pad = .8;
        var part_height = height * ((part.height + pad) / 100);
        var part_width = width * ((part.width + pad) / 100);
        var part_x = x + (width * ((part.x - (pad / 2)) / 100));
        var part_y = y + (height * ((part.y - (pad / 2)) / 100));
        var c;
        if (outline) c = color;
        else c = part.color ? part.color : color;
        if (lighten) c = lightenColor(c, lighten);
        ctx.fillStyle = c;
        drawRect(ctx, part_x, part_y, part_width, part_height);
        if (outline === true) drawRectOutline(ctx, color, part_x, part_y, part_width, part_height, outlinewidth, outlineopacity);
    }
}