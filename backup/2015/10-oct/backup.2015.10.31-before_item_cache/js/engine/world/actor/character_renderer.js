function CharacterRenderer() {
    this.outlinecolor = "#424242";
    this.outlinewidth = 2;
    this.outlineopacity = null;
}

CharacterRenderer.prototype.draw = function(ctx, color, box, character, outline) {
    var arr = [];
    for (var prop in character) arr.push(prop);
    var bchar = {};
    for (var n = arr.length; n--;) bchar[arr[n]] = character[arr[n]];
    
    if (outline) this.drawCharacterParts(ctx, box, bchar, 1, this.outlinecolor, true, this.outlinewidth, this.outlineopacity);
    
    color = (color) ? color : character.color;
    this.drawCharacterParts(ctx, box, bchar, 1, color, false);
}

CharacterRenderer.prototype.drawCharacterParts = function(ctx, box, parts, pad, color, outline, outlinewidth, outlineopacity) { 
    for (var part in parts) this.drawCharacterPart(ctx, box, parts[part], pad, color, outline, outlinewidth, outlineopacity);
}

CharacterRenderer.prototype.drawCharacterPart = function(ctx, box, part, pad, color, outline, outlinewidth, outlineopacity) {
    if (part.height && part.width) this.drawPart(ctx, box, part, pad, color, outline, outlinewidth, outlineopacity);
    if (part.parts) {
        if (!outline) color = (part.color) ? part.color : color;
        this.drawCharacterParts(ctx, box, part.parts, pad, color, outline, outlinewidth, outlineopacity);
    }
}

CharacterRenderer.prototype.drawPart = function(ctx, box, part, addpad, color, outline, outlinewidth, outlineopacity) {
    var pad = .8 + addpad;
    var part_height = box.height * ((part.height + pad) / 100);
    var part_width = box.width * ((part.width + pad) / 100);
    var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
    var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
    if (outline) ctx.fillStyle = color;
    else ctx.fillStyle = part.color ? part.color : color;
    drawShape(ctx, part, part_x, part_y, part_width, part_height);
    if (outline) drawShapeOutline(ctx, color, part, part_x, part_y, part_width, part_height, outlinewidth, outlineopacity);
}