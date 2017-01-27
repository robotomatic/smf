function CharacterRenderer() {}

CharacterRenderer.prototype.draw = function(ctx, color, box, character) {
    var arr = [];
    for (prop in character) arr.push(prop);
    var bchar = {};
    for (var n = arr.length; n--;) bchar[arr[n]] = character[arr[n]];
    
    this.drawCharacterParts(ctx, box, bchar, 1, "#424242", true);
    
    color = (color) ? color : character.color;
    this.drawCharacterParts(ctx, box, bchar, 1, color, false);
}

CharacterRenderer.prototype.drawCharacterParts = function(ctx, box, parts, pad, color, outline) { 
    for (var part in parts) this.drawCharacterPart(ctx, box, parts[part], pad, color, outline);
}

CharacterRenderer.prototype.drawCharacterPart = function(ctx, box, part, pad, color, outline) {
    this.drawPart(ctx, box, part, pad, color, outline);
    if (part.parts) {
        if (!outline) color = (part.color) ? part.color : color;
        this.drawCharacterParts(ctx, box, part.parts, pad, color, outline);
    }
}

CharacterRenderer.prototype.drawPart = function(ctx, box, part, addpad, color, outline) {
    if (part.height && part.width) {
        var pad = .8 + addpad;
        var part_height = box.height * ((part.height + pad) / 100);
        var part_width = box.width * ((part.width + pad) / 100);
        var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
        var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
        if (outline) ctx.fillStyle = color;
        else ctx.fillStyle = part.color ? part.color : color;
        drawRect(ctx, part_x, part_y, part_width, part_height);
        if (outline) drawRectOutline(ctx, color, part_x, part_y, part_width, part_height);
    }
}