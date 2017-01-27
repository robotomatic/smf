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

CharacterRenderer.prototype.drawCharacterParts = function(ctx, box, parts, pad, color, overridestyle) { 
    for (var part in parts) this.drawCharacterPart(ctx, box, parts[part], pad, color, overridestyle);
}

CharacterRenderer.prototype.drawCharacterPart = function(ctx, box, part, pad, color, overridestyle) {
    this.drawPart(ctx, box, part, pad, color, overridestyle);
    if (part.parts) {
        if (!overridestyle) color = (part.color) ? part.color : color;
        this.drawCharacterParts(ctx, box, part.parts, pad, color, overridestyle);
    }
}

CharacterRenderer.prototype.drawPart = function(ctx, box, part, addpad, color, overridestyle) {
    if (part.height && part.width) {
        var pad = .8 + addpad;
        var part_height = box.height * ((part.height + pad) / 100);
        var part_width = box.width * ((part.width + pad) / 100);
        var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
        var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
        
        if (overridestyle) ctx.fillStyle = color;
        else ctx.fillStyle = part.color ? part.color : color;
        
        ctx.globalAlpha=1;
        drawRect(ctx, part_x, part_y, part_width, part_height);

        if (addpad && overridestyle) {
            ctx.lineCap="round";            
            ctx.strokeStyle = color;
            ctx.globalAlpha=0.8;
            ctx.lineWidth=2;
            ctx.strokeRect(part_x, part_y, part_width, part_height);            
        }
    }
}