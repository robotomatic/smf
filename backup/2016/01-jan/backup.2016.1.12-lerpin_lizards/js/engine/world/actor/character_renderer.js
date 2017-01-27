
/*

- temp-fix terrain

- better "chain" path creation : need this for armies and leggies as well

- control render style : want choppy hair, slanty eyes

- group and item z-index : animate and render

- armies: hip -> thigh -> knee -> calf -> ankle -> foot
- leggies : shoulder -> bicep -> elbow -> forearm -> wrist -> hand


- idle animations : always (breathe, look right) and occasional (blink, look around, smack lips)
- set breathing rate

*/



function CharacterRenderer() {
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
    
    this.groupdefs = new Array();
    this.groups = new Array();
}


CharacterRenderer.prototype.draw = function(ctx, color, box, character) {

    this.groupdefs = new Array();
    this.groups = new Array();

    var debug = false;
    if (debug) color = "pink";
    
    if (character.groups) {
        var keys = Object.keys(character.groups);
        for (var i = 0; i < keys.length; i++) {
            this.groupdefs[keys[i]] = character.groups[keys[i]];
        }
    }
    
    color = (color) ? color : character.color;

    var bw = box.width * 2;
    var bh = box.height * 2;
    
    var bx = box.x - (box.width / 2);
    var by = box.y - (box.height / 2);
    
    this.canvas.width = bw;
    this.canvas.height = bh;
    
    var newbox = new Rectangle(box.width / 2, box.height / 2, box.width, box.height);
//    drawRectOutline(ctx, "red", bx, by, bw, bh, 1, 1, 1);
    
    this.drawCharacterParts(this.ctx, newbox, character, 1, color);
    
    var gkeys = Object.keys(this.groups);
    if (gkeys.length) {
        for (var i = 0; i < gkeys.length; i++) {
            var group = this.groups[gkeys[i]];
            var name = group.name;
            var groupdef = this.groupdefs[name];
            var points = group.points;
            var rects = group.rects;
            var poly = new Polygon();
            if (points.length) poly.setPoints(points);
            if (rects && groupdef && groupdef.path) {
                if (groupdef.path == "smooth") poly.filterPoints(rects);
                else if (groupdef.path == "round") poly.filterPoints(rects); 
                else if (groupdef.path == "chain") poly.filterChain(rects); 
            }
            poly.translate(box.x - (box.width / 2), box.y - (box.height / 2));
            ctx.beginPath();
            if (groupdef) {
                if (groupdef.color) ctx.fillStyle = groupdef.color;
                else ctx.fillStyle = color;
                if (groupdef.path == "smooth") poly.drawSmooth(ctx);
                else if (groupdef.path == "round") poly.drawRound(ctx, 5);
                else if (groupdef.path == "chain") poly.drawRound(ctx, 5);
                else poly.draw(ctx);
            } else {
                if (poly.points.length) {
                    ctx.fillStyle = color;
                    poly.draw(ctx);
                }
            }

            if (debug)  {
                if (rects.length) {
                    for (var ii = 0; ii < rects.length; ii++) {
                        rects[ii].translate(box.x - (box.width / 2), box.y - (box.height / 2));
                        rects[ii].drawOutline(ctx, "gray", 1, 1);
                    }
                }
            }
        }
    }
    
    ctx.drawImage(this.canvas, box.x - (box.width / 2), box.y - (box.height / 2), bw, bh);
}

CharacterRenderer.prototype.drawCharacterParts = function(ctx, box, parts, pad, color) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = keys[i];
        if (part.draw == false) continue;
        this.drawCharacterPart(ctx, box, parts[part], pad, color);
    }
}

CharacterRenderer.prototype.drawCharacterPart = function(ctx, box, part, pad, color) {
    if (part.draw == false) return;
    if (part.group) this.drawCharacterPartsGroup(ctx, box, part, pad, color);
    else if (part.height && part.width) this.drawPart(ctx, box, part, pad, color);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        if (part.group) this.drawCharacterPartsGroup(ctx, box, part.parts, pad, color);
        else this.drawCharacterParts(ctx, box, part.parts, pad, color);
//        this.drawCharacterParts(ctx, box, part.parts, pad, color);
    }
}

CharacterRenderer.prototype.drawCharacterPartsGroup = function(ctx, box, parts, addpad, color) {
    var g = parts.group;
    if (!this.groups[g]) this.groups[g] = { name : g, points : new Array(), rects : new Array() };
    var group = this.groups[g];
    var bx = box.x;
    var by = box.y;
    var pad = .8 + addpad;
    if (parts.width && parts.height) {
        var part = parts;
        var part_height = box.height * ((part.height + pad) / 100);
        var part_width = box.width * ((part.width + pad) / 100);
        var part_x = bx + (box.width * ((part.x - (pad / 2)) / 100));
        var part_y = by + (box.height * ((part.y - (pad / 2)) / 100));
        group.rects[group.rects.length] = new Rectangle(part_x, part_y, part_width, part_height);
        group.points[group.points.length] = new Point(part_x, part_y);
        group.points[group.points.length] = new Point(part_x + part_width, part_y);
        group.points[group.points.length] = new Point(part_x + part_width, part_y + part_height);
        group.points[group.points.length] = new Point(part_x, part_y + part_height);
    } else {
        if (parts.parts) {
            var keys = Object.keys(parts.parts);
            for (var i = 0; i < keys.length; i++) {
                var part = parts.parts[keys[i]];
                var part_height = box.height * ((part.height + pad) / 100);
                var part_width = box.width * ((part.width + pad) / 100);
                var part_x = bx + (box.width * ((part.x - (pad / 2)) / 100));
                var part_y = by + (box.height * ((part.y - (pad / 2)) / 100));
                group.rects[group.rects.length] = new Rectangle(part_x, part_y, part_width, part_height);
                group.points[group.points.length] = new Point(part_x, part_y);
                group.points[group.points.length] = new Point(part_x + part_width, part_y);
                group.points[group.points.length] = new Point(part_x + part_width, part_y + part_height);
                group.points[group.points.length] = new Point(part_x, part_y + part_height);
            }
        }
    }
    
}

CharacterRenderer.prototype.drawPart = function(ctx, box, part, addpad, color) {
    
    if (part.draw == false) return;
    
    var pad = .8 + addpad;
    var part_height = box.height * ((part.height + pad) / 100);
    var part_width = box.width * ((part.width + pad) / 100);
    var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
    var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
    ctx.fillStyle = part.color ? part.color : color;
    drawShape(ctx, part, part_x, part_y, part_width, part_height);
}