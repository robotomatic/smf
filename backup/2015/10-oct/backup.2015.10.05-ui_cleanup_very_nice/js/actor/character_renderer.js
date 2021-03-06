function CharacterRenderer() {}

CharacterRenderer.prototype.draw = function(ctx, color, box, character) {
    var arr = [];
    for (prop in character) arr.push(prop);
    var bchar = {};
    for (var n = arr.length; n--;) bchar[arr[n]] = character[arr[n]];
    //this.drawCharacterParts(ctx, "#424242", box, bchar, 1.5);
    color = (character.color) ? character.color : color;
    this.drawCharacterParts(ctx, color, box, bchar, 1);
}

CharacterRenderer.prototype.drawCharacterParts = function(ctx, color, box, parts, pad) { 
    for (var part in parts) this.drawCharacterPart(ctx, color, box, parts[part], pad);
}

CharacterRenderer.prototype.drawCharacterPart = function(ctx, color, box, part, pad) {
    this.drawPart(ctx, color, box, part, pad);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawCharacterParts(ctx, color, box, part.parts, pad);
    }
}

CharacterRenderer.prototype.drawPart = function(ctx, color, box, part, addpad) {
    if (part.height && part.width) {
        var pad = .8 + addpad;
        var part_height = box.height * ((part.height + pad) / 100);
        var part_width = box.width * ((part.width + pad) / 100);
        var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
        var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
        ctx.fillStyle = part.color ? part.color : color;
        drawRect(ctx, part_x, part_y, part_width, part_height);
    }
}