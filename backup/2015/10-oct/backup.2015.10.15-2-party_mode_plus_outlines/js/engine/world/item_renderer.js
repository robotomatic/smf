function ItemRenderer(items) {
    this.items = items;
}

ItemRenderer.prototype.drawItem = function(ctx, color, item, x, y, width, height, lighten) {
    var ritem = this.items[item.itemtype];
    if (!ritem) {
        if (color) ctx.fillStyle = color;
        drawRect(ctx, x, y, width, height);
//        drawRectOutline(ctx, "#424242", x, y, width, height);
        return; 
    }
    var arr = [];
    for (prop in ritem) arr.push(prop);
    var bitem = {};
    for (var n = arr.length; n--;) bitem[arr[n]] = ritem[arr[n]];
    
    this.drawItemParts(ctx, bitem.parts, x, y, width, height, "#424242", false, true);
    
    color = (item.color) ? item.color : color;
    this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, lighten, false);
}

ItemRenderer.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, lighten, outline) { 
    for (var part in parts) this.drawItemPart(ctx, parts[part], x, y, width, height, color, lighten, outline);
}

ItemRenderer.prototype.drawItemPart = function(ctx, part, x, y, width, height, color, lighten, outline) {
    this.drawPart(ctx, part, x, y, width, height, color, lighten, outline);
    if (part.parts) {
        if (!outline) color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, part.parts, x, y, width, height, color, lighten, outline);
    }
}

ItemRenderer.prototype.drawPart = function(ctx, part, x, y, width, height, color, lighten, outline) {
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
        if (outline) drawRectOutline(ctx, color, part_x, part_y, part_width, part_height);
    }
}