CharacterRenderer = function() {
}

CharacterRenderer.prototype.draw = function(ctx, color, box, character) {
    var arr = [];
    for (prop in character.parts) arr.push(prop);
    var bchar = {};
    for (var n = arr.length; n--;)bchar[arr[n]] = character.parts[arr[n]];
    color = (character.color) ? character.color : color;
    this.drawCharacterParts(ctx, color, box, bchar);
}


CharacterRenderer.prototype.drawCharacterParts = function(ctx, color, box, parts) { 
    for (var part in parts) this.drawCharacterPart(ctx, color, box, parts[part]);
}

CharacterRenderer.prototype.drawCharacterPart = function(ctx, color, box, part) {
    this.drawPart(ctx, color, box, part);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawCharacterParts(ctx, color, box, part.parts);
    }
}

CharacterRenderer.prototype.drawPart = function(ctx, color, box, part) {
    if (part.height && part.width) {
        var part_height = box.height * (part.height / 100);
        var part_width = box.width * (part.width / 100);
        var part_x = box.x + (box.width * (part.x / 100));
        var part_y = box.y + (box.height * (part.y / 100));
        ctx.fillStyle = part.color ? part.color : color;
        drawRect(ctx, part_x, part_y, part_width, part_height);
    }
}