function Character() {
    this.name;
    this.parts;
    this.animations;
}

Character.prototype.loadJson = function(json) {
    this.name = json.name;
    this.parts = json.parts;
    return this;
}

Character.prototype.draw = function(ctx, color, x, y, width, height, state)  { 
    this.drawParts(ctx, color, x, y, width, height, "", this.parts, state); 
}

Character.prototype.drawParts = function(ctx, color, x, y, width, height, name, parts, state) { 
    for (var part in parts) {
        var partmod = (this.animations[state] && this.animations[state].parts[part]) ? this.animatePart(part, state, parts[part]) : parts[part];
        this.drawPart(ctx, color, x, y, width, height, part, partmod, state);
    }
}

Character.prototype.drawPart = function(ctx, color, x, y, width, height, partname, part, state) {

    if (part.parts) this.drawParts(ctx, part.color ? part.color : color, x, y, width, height, partname, part.parts, state);
    else {
        var partmod = (this.animations[state] && this.animations[state].parts[partname]) ? this.animatePart(partname, state, part) : part;
        
        var part_height = height * (partmod.height / 100);
        var part_width = width * (partmod.width / 100);
        var part_x = x + (width * (partmod.x / 100));
        var part_y = y + (height * (partmod.y / 100));
        
        
        ctx.fillStyle = part.color ? part.color : color;
        drawRect(ctx, part_x, part_y, part_width, part_height);
    }
}

Character.prototype.animatePart = function(name, state, part) {
    
    var partmod = Object.create(part);
    var animation = this.animations[state].parts[name];

    var frame = animation.frames[0];
    
    for (var att in frame) {
        var val = frame[att];
        partmod[att] *= val;
    }

    return partmod;
}