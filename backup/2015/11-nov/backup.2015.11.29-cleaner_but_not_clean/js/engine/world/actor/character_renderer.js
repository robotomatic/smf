function CharacterRenderer() {
}

CharacterRenderer.prototype.draw = function(ctx, color, box, character) {
    var keys = Object.keys(character);
    var arr = [];
    for (var n = keys.length; n--;) arr[keys[n]] = character[keys[n]];
    color = (color) ? color : character.color;
    this.drawCharacterParts(ctx, box, arr, 1, color);
}

CharacterRenderer.prototype.drawCharacterParts = function(ctx, box, parts, pad, color) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = keys[i];
        this.drawCharacterPart(ctx, box, parts[part], pad, color);
    }
}

CharacterRenderer.prototype.drawCharacterPart = function(ctx, box, part, pad, color) {
    if (part.height && part.width) this.drawPart(ctx, box, part, pad, color);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawCharacterParts(ctx, box, part.parts, pad, color);
    }
}

CharacterRenderer.prototype.drawPart = function(ctx, box, part, addpad, color) {
    var pad = .8 + addpad;
    var part_height = box.height * ((part.height + pad) / 100);
    var part_width = box.width * ((part.width + pad) / 100);
    var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
    var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
    ctx.fillStyle = part.color ? part.color : color;
    drawShape(ctx, part, part_x, part_y, part_width, part_height);
}