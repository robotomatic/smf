function ItemRenderer(theme) {
    this.theme = theme;
    this.outlinecolor = "#424242";
    this.outlinewidth = 2;
    this.outlineopacity = null;
    
    this.cloudsrenderer = new Array();
    this.wavesrenderer = new Array();
    
    this.starsrenderer = new ItemRendererStars();
}

ItemRenderer.prototype.drawItem = function(ctx, color, item, x, y, width, height, lighten, outline, outlinewidth, scale) {

    if (!this.theme) {
        ctx.fillStyle = color ? color : "magenta";
//        ctx.fillStyle = "magenta";
        drawRect(ctx, x, y, width, height);
        return; 
    }

    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) {
        ctx.fillStyle = color ? color : "magenta";
//        ctx.fillStyle = "purple";
        drawRect(ctx, x, y, width, height);
        return; 
    }
    
    
    if (item.itemtype == "wave" || item.itemtype == "wave-1") {
        if (!this.wavesrenderer[item.name]) {
            this.wavesrenderer[item.name] = new ItemRendererWaves();
        }
        this.wavesrenderer[item.name].drawWaves(ctx, titem.color, item, x, y, width, height, lighten, outline, outlinewidth, scale, titem);
        return;
    } else if (item.itemtype == "clouds") {
        if (!this.cloudsrenderer[item.name]) {
            this.cloudsrenderer[item.name] = new ItemRendererClouds();
        }
        this.cloudsrenderer[item.name].drawClouds(ctx, item, x, y, width, height, scale, titem);
        return;
    } else if (item.itemtype == "stars") {
        this.starsrenderer.drawStars(ctx, item, x, y, width, height, scale, titem);
        return;
    }
    
    
    if (item.ramp) titem.ramp = item.ramp;
    
    var color = titem.color;
    if (color) {
        if (color.gradient) {
            var gradient = color.gradient;
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
        } else if (lighten) color = lightenColor(color, lighten);
    } else {
        color = color ? color : "magenta";
    }
    
    if (titem.parts) {
        var arr = [];
        for (var prop in titem) arr.push(prop);
        var bitem = {};
        for (var n = arr.length; n--;) bitem[arr[n]] = titem[arr[n]];
        if (outline === true) {
            outlinewidth = outlinewidth ? outlinewidth : this.outlinewidth
            this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, lighten, true, outlinewidth, this.outlineopacity, scale);
        }
        this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, lighten, false, 0, 0, scale);
    } else {
        ctx.fillStyle = color;
        if (outline === true) {
            outlinewidth = outlinewidth ? outlinewidth : this.outlinewidth
            drawShapeOutline(ctx, this.outlinecolor, item, x, y, width, height, outlinewidth, this.outlineopacity, scale);
        }
        drawShape(ctx, titem, x, y, width, height, scale);
    }
}

ItemRenderer.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale) { 
    for (var part in parts) this.drawItemPart(ctx, parts[part], x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale);
}

ItemRenderer.prototype.drawItemPart = function(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale) {
    if (part.height && part.width) this.drawPart(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale);
    
    if (outline === true) return;
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, part.parts, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale);
    }
}

ItemRenderer.prototype.drawPart = function(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale) {
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
    drawShape(ctx, part, part_x, part_y, part_width, part_height, scale);
    
    if (outline === true) drawShapeOutline(ctx, this.outlinecolor, part, part_x, part_y, part_width, part_height, outlinewidth, outlineopacity, scale);
}