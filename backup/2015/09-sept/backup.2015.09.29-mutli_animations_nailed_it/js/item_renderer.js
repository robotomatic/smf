ItemRenderer = function(items) {
    this.items = items;
}

ItemRenderer.prototype.drawItem = function(ctx, color, item, x, y, width, height, lighten) {
    var ritem = this.items[item.itemtype];
    if (!ritem) {
        if (color) ctx.fillStyle = color;
        drawRect(ctx, x, y, width, height);
        return; 
    }
    var arr = [];
    for (prop in ritem) arr.push(prop);
    var bitem = {};
    for (var n = arr.length; n--;) bitem[arr[n]] = ritem[arr[n]];
    color = (item.color) ? item.color : color;
    
    this.drawItemParts(ctx, color, bitem.parts, x, y, width, height, lighten);
}

ItemRenderer.prototype.drawItemParts = function(ctx, color, parts, x, y, width, height, lighten) { 
    for (var part in parts) this.drawItemPart(ctx, color, parts[part], x, y, width, height, lighten);
}

ItemRenderer.prototype.drawItemPart = function(ctx, color, part, x, y, width, height, lighten) {
    this.drawPart(ctx, color, part, x, y, width, height, lighten);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, color, part.parts, x, y, width, height, lighten);
    }
}

ItemRenderer.prototype.drawPart = function(ctx, color, part, x, y, width, height, lighten) {
    if (part.height && part.width) {
        var pad = .8;
        var part_height = height * ((part.height + pad) / 100);
        var part_width = width * ((part.width + pad) / 100);
        var part_x = x + (width * ((part.x - (pad / 2)) / 100));
        var part_y = y + (height * ((part.y - (pad / 2)) / 100));
        var c = part.color ? part.color : color;
        if (lighten) c = lightenColor(c, lighten);
        ctx.fillStyle = c;
        drawRect(ctx, part_x, part_y, part_width, part_height);
    }
}