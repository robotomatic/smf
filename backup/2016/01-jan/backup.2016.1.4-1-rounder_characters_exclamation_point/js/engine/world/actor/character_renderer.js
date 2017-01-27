function CharacterRenderer() {
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
    
    this.points = new Array();
    this.rects = new Array();
}


CharacterRenderer.prototype.draw = function(ctx, color, box, character) {

    var debug = false;
    
    if (debug) color = "yellow";
    
    // todo: cache item parts and keys
    var keys = Object.keys(character);
    var arr = [];
    for (var n = keys.length; n--;) arr[keys[n]] = character[keys[n]];
    
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
    
    this.drawCharacterParts(this.ctx, newbox, arr, 1, color);
    
    
    if (this.points.length) {
        
        var minpx;
        var minpy;
        var maxpx;
        var maxpy;
        var outline = new Array();
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            var inside = false;
            if (this.rects.length) {
                for (var ii = 0; ii < this.rects.length; ii++) {
                    var rect = this.rects[ii];
                    if (rect.contains(point)) {
                        inside = true;
                        break;
                    }
                }
            }
            if (!inside) {
                if (!minpx || (this.points[i].x < minpx)) minpx = this.points[i].x;
                if (!minpy || (this.points[i].y < minpy)) minpy = this.points[i].y;
                if (!maxpx || (this.points[i].x > maxpx)) maxpx = this.points[i].x;
                if (!maxpy || (this.points[i].y > maxpy)) maxpy = this.points[i].y;
                outline[outline.length] = new Point(this.points[i].x, this.points[i].y);
            }
        }
        
        if (outline.length) {

            var cp = new Point(minpx + ((maxpx - minpx) / 2), minpy + ((maxpy - minpy) / 2));
            
            var leftpoints = new Array();
            var rightpoints = new Array();
            
            var angle;
            var line = new Line();
            line.start.x = cp.x;
            line.start.y = cp.y;
            for (var i = 0; i < outline.length; i++) {
                
                line.end.x = outline[i].x;
                line.end.y = outline[i].y;
                
                angle = line.angle();
                if (angle <= 90 && angle >= -90) leftpoints[leftpoints.length] = new Point(outline[i].x + box.x - (box.width / 2), outline[i].y + box.y - (box.height / 2));
                else rightpoints[rightpoints.length] = new Point(outline[i].x + box.x - (box.width / 2), outline[i].y + box.y - (box.height / 2));
                
            }
            

            var poly = new Polygon();
            
            if (leftpoints.length) {
                leftpoints.sort(sortByPositionY);
                var pn = 0;
                for (var i = 0; i < leftpoints.length; i++) {
                    var p = leftpoints[i];
                    
                    poly.addPoint(p);
                    
//                    p.draw(ctx, "red", 5);
//                    var px = p.x + 2;
//                    var py = p.y - 2;
//                    drawText(ctx, pn++, "red", px, py);
                }
            }

            if (rightpoints.length) {
                rightpoints.sort(sortByPositionY);
                rightpoints.reverse();
                var pn = 0;
                for (var i = 0; i < rightpoints.length; i++) {
                    var p = rightpoints[i];
                    poly.addPoint(p);
                    
//                    p.draw(ctx, "blue", 5);
//                    var px = p.x + 2;
//                    var py = p.y - 2;
//                    drawText(ctx, pn++, "blue", px, py);
                }
            }
            
            
            
            ctx.fillStyle = color;
            ctx.beginPath();
            poly.drawRound(ctx, 15);
            
        }
    }
    
    ctx.drawImage(this.canvas, box.x - (box.width / 2), box.y - (box.height / 2), bw, bh);

    
    if (debug) {
        if (this.rects.length) for (var i = 0; i < this.rects.length; i++) {
            this.rects[i].x += (box.x - (box.width / 2));
            this.rects[i].y += (box.y - (box.height / 2));
            this.rects[i].drawOutline(ctx, "gray", 1);
        }


        if (leftpoints && leftpoints.length) {
            for (var i = 0; i < leftpoints.length; i++) {
                var p = leftpoints[i];
                p.draw(ctx, "black", 2);
                var px = p.x + 5;
                var py = p.y - 5;
                drawText(ctx, pn++, "black", px, py);
            }
        }

        if (rightpoints && rightpoints.length) {
            rightpoints.sort(sortByPositionY);
            rightpoints.reverse();
            var pn = 0;
            for (var i = 0; i < rightpoints.length; i++) {
                var p = rightpoints[i];
                p.draw(ctx, "black", 2);
                var px = p.x + 5;
                var py = p.y - 5;
                drawText(ctx, pn++, "black", px, py);
            }
        }
    }
}

function sortByPositionX(a, b){
  if (a.x == b.x) return a.y - b.y;
  return a.x - b.x;
}

function sortByPositionY(a, b){
 if (a.y == b.y) return a.x - b.x;
  return a.y - b.y;
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