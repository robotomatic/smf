
/*

- temp-fix terrain

- flag uckfayed

- better "chain" path creation : need this for armies and leggies as well

- control render style : want choppy hair, slanty eyes

- armies: hip -> thigh -> knee -> calf -> ankle -> foot
- leggies : shoulder -> bicep -> elbow -> forearm -> wrist -> hand


- idle animations : always (breathe, look right) and occasional (blink, look around, smack lips)
- set breathing rate

*/



function CharacterRenderer() {
    this.groupdefs = new Array();
    this.groups = new Array();
    this.clippath = null;
}


CharacterRenderer.prototype.draw = function(ctx, color, box, character, scale) {

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
    
    var newbox = new Rectangle(box.width / 2, box.height / 2, box.width, box.height);
//    drawRectOutline(ctx, "red", bx, by, bw, bh, 1, 1, 1);
    
    this.drawCharacterParts(newbox, character, 1, color);
    
    if (this.groups.length) {
        
        for (var i = 0; i < this.groups.length; i++) {
            var group = this.groups[i];
            var name = group.name;
            var groupdef = this.groupdefs[name];
            if (!groupdef || groupdef.draw == false) continue;
            var z = 100;
            if (groupdef.zindex || groupdef.zindex == 0) z = groupdef.zindex;
            this.groups[i].zindex  = z;
        }

        this.groups.sort(sortByZIndex);  
    
        for (var i = 0; i < this.groups.length; i++) {
            var group = this.groups[i];
            var name = group.name;
            var groupdef = this.groupdefs[name];
            if (groupdef && groupdef.draw == false) continue;
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
                
                if (groupdef.clip) {
                    if (groupdef.clip == "start") {
                        ctx.save();
                        
                        if (groupdef.path == "smooth") poly.drawSmooth(ctx);
                        else if (groupdef.path == "round") poly.drawRound(ctx, 5);
                        else if (groupdef.path == "chain") poly.drawRound(ctx, 5);
                        else poly.draw(ctx);

                        
/*

Todo: Look at options to replace costly (and glitchy!) clip operation:

1) render to buffer context, use globalCompositeOperation = 'destination-in' to clip

- or - 

2) render to buffer context and cache



*/
                        
                        
//                        this.clippath = new Polygon();
//                        this.clippath.setPoints(poly.getPoints());
//                        this.clippath.path = groupdef.path;
                        ctx.clip();
                    } else if (groupdef.clip == "end") {
//                        if (groupdef.path == "smooth") poly.drawSmooth(ctx);
//                        else if (groupdef.path == "round") poly.drawRound(ctx, 5);
//                        else if (groupdef.path == "chain") poly.drawRound(ctx, 5);
//                        else poly.draw(ctx);
//                        
//                        ctx.restore();
//                        ctx.beginPath();
//                        if (this.clippath) {
//                            //this.clippath.drawOutline(ctx, "black", 1);
//                            this.clippath = null;
//                        }
                    }
                } else {
                    if (groupdef.path == "smooth") poly.drawSmooth(ctx);
                    else if (groupdef.path == "round") poly.drawRound(ctx, 5);
                    else if (groupdef.path == "chain") poly.drawRound(ctx, 5);
                    else poly.draw(ctx);
                }
            } else {
                if (poly.points.length) {
                    ctx.fillStyle = group.color ? group.color : color;
                    if (group.clip) {
                        if (group.clip == "start") {
                            ctx.save();
                            poly.draw(ctx);
//                            this.clippath = new Polygon();
//                            this.clippath.setPoints(poly.getPoints());
//                            if (group.path) this.clippath.path = group.path;
                            ctx.clip();
                        } else if (group.clip == "end") {
                            poly.draw(ctx);
                            ctx.restore();
//                            ctx.beginPath();
//                            if (this.clippath) {
//                                var lw = 1 * scale;
//                                if (this.clippath.path == "smooth") this.clippath.drawOutlineSmooth(ctx, "black", lw);
//                                else if (this.clippath.path == "round") this.clippath.drawRound(ctx, 5, "black", lw);
//                                else if (this.clippath.path == "chain") this.clippath.drawRound(ctx, 5, "black", lw);
//                                else this.clippath.drawOutline(ctx, "black", lw);
//                                this.clippath = null;
//                            }
                        }
                    } else {
                        poly.draw(ctx);
                    }
                }
            }

            if (debug)  {
                if (rects.length) {
                    for (var ii = 0; ii < rects.length; ii++) {
                        rects[ii].translate(box.x - (box.width / 2), box.y - (box.height / 2));
                        rects[ii].drawOutline(ctx, "black", .2, 1);
                    }
                }
            }
        }
    }
}

CharacterRenderer.prototype.drawCharacterParts = function(box, parts, pad, color) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = keys[i];
        if (part.draw == false) continue;
        this.drawCharacterPart(box, part, parts[part], pad, color);
    }
}

CharacterRenderer.prototype.drawCharacterPart = function(box, partname, part, pad, color) {
    if (part.draw == false) return;
    if (part.group) this.drawCharacterPartsGroup(box, part, pad, color);
    else if (part.height && part.width) this.drawPart(box, partname, part, pad, color);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        if (part.group) this.drawCharacterPartsGroup(box, part.parts, pad, color);
        else this.drawCharacterParts(box, part.parts, pad, color);
    }
}

CharacterRenderer.prototype.drawCharacterPartsGroup = function(box, parts, addpad, color) {

    var g = parts.group;
    
    var group = null;
    for (var i = 0; i < this.groups.length; i++) {
        if (this.groups[i].name == g) {
            group = this.groups[i];
            break;
        }
    }
    if (!group){
        group = { name : g, points : new Array(), rects : new Array() };  
        this.groups[this.groups.length] = group;
    } 

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
        
        var current = group.points.length; 
        group.points[group.points.length] = new Point(part_x, part_y);
        group.points[group.points.length] = new Point(part_x + part_width, part_y);
        group.points[group.points.length] = new Point(part_x + part_width, part_y + part_height);
        group.points[group.points.length] = new Point(part_x, part_y + part_height);
        
        if (part.pointinfo) {
            var k = Object.keys(part.pointinfo);
            for (var i = 0; i < k.length; i++) {
                group.points[current + Number(k[i])].setInfo(part.pointinfo[k[i]]);
            }
        }
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
                
                var current = group.points.length; 
                group.points[group.points.length] = new Point(part_x, part_y);
                group.points[group.points.length] = new Point(part_x + part_width, part_y);
                group.points[group.points.length] = new Point(part_x + part_width, part_y + part_height);
                group.points[group.points.length] = new Point(part_x, part_y + part_height);
                
                if (part.pointinfo) {
                    var k = Object.keys(part.pointinfo);
                    for (var i = 0; i < k.length; i++) {
                        group.points[current + Number(k[i])].setInfo(part.pointinfo[k[i]]);
                    }
                }
            }
        }
    }
    
}

CharacterRenderer.prototype.drawPart = function(box, partname, part, addpad, color) {
    
    if (part.draw == false) return;
 
    var g = partname;
    var group = null;
    for (var num = 0; num < this.groups.length; num++) {
        if (this.groups[num].name == g) {
            group = this.groups[num];
            break;
        }
    }
    if (!group){
        group = { name : g, points : new Array(), rects : new Array() };  
        var num = this.groups.length;
        this.groups[num] = group;
    } 
    
    var pad = .8 + addpad;
    var part_height = box.height * ((part.height + pad) / 100);
    var part_width = box.width * ((part.width + pad) / 100);
    var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
    var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
    
    group.rects[group.rects.length] = new Rectangle(part_x, part_y, part_width, part_height);

    var current = group.points.length; 
    group.points[group.points.length] = new Point(part_x, part_y);
    group.points[group.points.length] = new Point(part_x + part_width, part_y);
    group.points[group.points.length] = new Point(part_x + part_width, part_y + part_height);
    group.points[group.points.length] = new Point(part_x, part_y + part_height);

    if (part.pointinfo) {
        var k = Object.keys(part.pointinfo);
        for (var i = 0; i < k.length; i++) {
            group.points[current + Number(k[i])].setInfo(part.pointinfo[k[i]]);
        }
    }
    
    if (part.zindex || part.zindex == 0) group.zindex = part.zindex;
    else group.zindex = 100 + num;

    if (part.clip) group.clip = part.clip;
    if (part.path) group.path = part.path;
     
    group.color = part.color ? part.color : color;
}