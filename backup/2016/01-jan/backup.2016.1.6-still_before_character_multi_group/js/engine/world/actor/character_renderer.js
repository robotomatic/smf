
/*

- multiple groups (body, face, mouth, eyes)
- group info (smooth, round, z-index)
- group and item z-index : animate and render


- hip -> thigh -> knee -> calf -> ankle -> foot
- shoulder -> bicep -> elbow -> forearm -> wrist -> hand


- idle animations : always (breathe, look right) and occasional (blink, look around, smack lips)

*/



function CharacterRenderer() {
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
    
    this.points = new Array();
    this.rects = new Array();
}


CharacterRenderer.prototype.draw = function(ctx, color, box, character) {

    var debug = false;
    if (debug) color = "pink";
    
    this.points.length = 0;
    this.rects.length = 0;
    
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
    
    if (this.points.length) {
        var poly = new Polygon();
        poly.setPoints(this.points);
        poly.filterPoints(this.rects);
        poly.translate(box.x - (box.width / 2), box.y - (box.height / 2));
        ctx.fillStyle = color;
        ctx.beginPath();
        poly.drawSmooth(ctx);
    }

    if (debug)  {
        if (this.rects.length) {
            for (var i = 0; i < this.rects.length; i++) {
                this.rects[i].translate(box.x - (box.width / 2), box.y - (box.height / 2));
                this.rects[i].drawOutline(ctx, "gray", 1, 1);
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

    var bx = box.x;
    var by = box.y;
    
    ctx.fillStyle = color;
    var c = "lightgray";
    
    var pad = .8 + addpad;
    
    if (parts.width && parts.height) {
        var part = parts;
        var part_height = box.height * ((part.height + pad) / 100);
        var part_width = box.width * ((part.width + pad) / 100);
        var part_x = bx + (box.width * ((part.x - (pad / 2)) / 100));
        var part_y = by + (box.height * ((part.y - (pad / 2)) / 100));
        
        this.rects[this.rects.length] = new Rectangle(part_x, part_y, part_width, part_height);
        
        this.points[this.points.length] = new Point(part_x, part_y);
        this.points[this.points.length] = new Point(part_x + part_width, part_y);
        this.points[this.points.length] = new Point(part_x + part_width, part_y + part_height);
        this.points[this.points.length] = new Point(part_x, part_y + part_height);
        
        
//        arr[0] = {x : part_x, y : part_y, width : part_width, height : part_height };
//        drawRect(ctx, part_x, part_y, part_width, part_height);
//        drawRectOutline(ctx, c, part_x, part_y, part_width, part_height, 1, 1);
    } else {
        if (parts.parts) {
            var keys = Object.keys(parts.parts);
            for (var i = 0; i < keys.length; i++) {
                var part = parts.parts[keys[i]];
                
                var part_height = box.height * ((part.height + pad) / 100);
                var part_width = box.width * ((part.width + pad) / 100);
                var part_x = bx + (box.width * ((part.x - (pad / 2)) / 100));
                var part_y = by + (box.height * ((part.y - (pad / 2)) / 100));

                this.rects[this.rects.length] = new Rectangle(part_x, part_y, part_width, part_height);

                this.points[this.points.length] = new Point(part_x, part_y);
                this.points[this.points.length] = new Point(part_x + part_width, part_y);
                this.points[this.points.length] = new Point(part_x + part_width, part_y + part_height);
                this.points[this.points.length] = new Point(part_x, part_y + part_height);

    //            arr[i] = {x : part_x, y : part_y, width : part_width, height : part_height };
    //            drawRect(ctx, part_x, part_y, part_width, part_height);
    //            drawRectOutline(ctx, c, part_x, part_y, part_width, part_height, 1, 1);
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