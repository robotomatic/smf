
/*

- cache gradients and clipped areas? or bake all possible animations?

- control render style : want choppy hair, frowny mouth

- idle animations : occasional by type (look around, smack lips, shuffle, wag tail, etc)

- better "chain" path creation : need this for armies and leggies as well

- armies: hip -> thigh -> knee -> calf -> ankle -> foot
- leggies : shoulder -> bicep -> elbow -> forearm -> wrist -> hand

** can armies and leggies be lines/points?

*/



function CharacterRenderer() {
    this.groupdefs = new Array();
    this.groups = new Array();
    this.clippath = null;
}


CharacterRenderer.prototype.draw = function(ctx, color, box, character, scale) {

    this.groupdefs = new Array();
    this.groups = new Array();

//    var debug = true;
//    if (debug) color = "pink";
    
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
                        
                        this.clippath = new Polygon();
                        this.clippath.setPoints(poly.getPoints());
                        this.clippath.path = groupdef.path;
                        ctx.clip();
                    } else if (groupdef.clip == "end") {
                    }
                } else {
                    if (groupdef.path == "smooth") poly.drawSmooth(ctx);
                    else if (groupdef.path == "round") poly.drawRound(ctx, 5);
                    else if (groupdef.path == "chain") poly.drawRound(ctx, 5);
                    else poly.draw(ctx);
                }
                
                if (groupdef.debug)  {
                    if (rects.length) {
                        for (var ii = 0; ii < rects.length; ii++) {
                            rects[ii].translate(box.x - (box.width / 2), box.y - (box.height / 2));
                            rects[ii].drawOutline(ctx, "black", .2, 1);
                        }
                    }
                }
                
            } else {
                if (poly.points.length) {
                    
                    var c = group.color ? group.color : color;
                    if (c.gradient) {
                        var gradient = c.gradient;
                        var mbr = poly.getMbr();
                        
                        var mbry = mbr.y;
                        var mbrh  = mbr.y + mbr.height;
                        
                        if (mbry && mbrh) {
                            
                            if (gradient.top) mbry = mbry -= gradient.top;
                            if (gradient.height) mbrh = mbry + gradient.height;
                            
                            var g = ctx.createLinearGradient(0, mbry, 0, mbrh);
                            var start = gradient.start;
                            var stop = gradient.stop;
                            g.addColorStop(0, start);
                            g.addColorStop(1, stop);
                            c = g;
                        } else c = color;
//                        c = color;
                    }
                    ctx.fillStyle = c;
                    
                    if (group.clip) {
                        if (group.clip == "start") {
                            ctx.save();
                            poly.draw(ctx);
                            this.clippath = new Polygon();
                            this.clippath.setPoints(poly.getPoints());
                            if (group.path) this.clippath.path = group.path;
                            ctx.clip();
                        } else if (group.clip == "end") {
                            poly.draw(ctx);
                            ctx.restore();
                            if (this.clippath) {
                                ctx.beginPath();
                                var lw = .8;
                                var c = color;
                                if (this.clippath.path == "smooth") this.clippath.drawOutlineSmooth(ctx, c, lw);
                                else if (this.clippath.path == "round") this.clippath.drawOutlineRound(ctx, 5, c, lw);
                                else if (this.clippath.path == "chain") this.clippath.drawOutlineRound(ctx, 5, c, lw);
                                else this.clippath.drawOutline(ctx, c, lw);
                                this.clippath = null;
                            }
                        }
                    } else {
                        
                        if (group.angle) {
                            poly.setPoints(poly.rotate(group.angle));
                        }
                        
                        if (group.path == "smooth") poly.drawSmooth(ctx);
                        else if (group.path == "round") poly.drawRound(ctx, 5);
                        else if (group.path == "chain") poly.drawRound(ctx, 5);
                        else poly.draw(ctx);
                    }
                    
                    if (group.debug)  {
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
    else group.zindex = 1000 + num;

    if (part.clip) group.clip = part.clip;
    if (part.path) group.path = part.path;
    
    if (part.debug) group.debug = part.debug;
    
    group.color = part.color ? part.color : color;
}