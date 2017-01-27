
/*

- fix dummy's stupid facehead

- knees & elbows, hands & feet

- path for arms and legs

- darken main color for shadow

- cache gradients and clipped areas? or bake all possible animations?

- control render style : want choppy hair, frowny mouth

- idle animations : occasional by type (look around, smack lips, shuffle, wag tail, etc)

- better "chain" path creation : need this for armies and leggies as well

- draw char at 2x reso and scale down to render?

*/



function CharacterRenderer() {
    this.groupdefs = new Array();
    this.groups = new Array();
    this.clippath = null;
}

CharacterRenderer.prototype.draw = function(ctx, color, box, character, scale, debug) {

    this.groupdefs.length = 0;
    this.groups.length = 0;

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
            if (group.angle) {
                poly.setPoints(poly.rotate(group.angle));
                if (group.parts) this.rotateGroup(this.groups, group);
            }
            poly.translate(box.x - (box.width / 2), box.y - (box.height / 2));
            var gg = groupdef ? groupdef : group;
            if (poly.points.length) {
                ctx.beginPath();
                this.setColor(gg.color ? gg.color : color, poly, ctx);
                if (gg.clip) {
                    if (gg.clip == "start") {
                        ctx.save();
                        this.drawPolygon(gg.path, poly, ctx);
                        this.clippath = new Polygon();
                        this.clippath.setPoints(poly.getPoints());
                        if (gg.path) this.clippath.path = gg.path;
                        ctx.clip();
                    } else if (gg.clip == "end") {
                        this.drawPolygon(gg.path, poly, ctx);
                        ctx.restore();
                        if (this.clippath) {
                            ctx.beginPath();
                            var lw = .8;
                            var c = color;
                            this.drawPolygonOutline(this.clippath.path, this.clippath, ctx, c, lw);
                            this.clippath = null;
                        }
                    }
                } else this.drawPolygon(gg.path, poly, ctx);
                if (debug || group.debug) this.drawDebugRectangles(rects, box, ctx);
            }
        }
    }
}

CharacterRenderer.prototype.drawPolygon = function(path, poly, ctx) { 
    if (path == "smooth") poly.drawSmooth(ctx);
    else if (path == "round") poly.drawRound(ctx, 5);
    else if (path == "chain") poly.drawRound(ctx, 5);
    else poly.draw(ctx);
}

CharacterRenderer.prototype.drawPolygonOutline = function(path, poly, ctx, color, lineweight) { 
    if (path == "smooth") poly.drawOutlineSmooth(ctx, color, lineweight);
    else if (path == "round") poly.drawOutlineRound(ctx, 5, color, lineweight);
    else if (path == "chain") poly.drawOutlineRound(ctx, 5, color, lineweight);
    else poly.drawOutline(ctx, color, lineweight);
}

CharacterRenderer.prototype.drawDebugRectangles = function(rects, box, ctx) { 
    if (rects.length) {
        for (var i = 0; i < rects.length; i++) {
            rects[i].translate(box.x - (box.width / 2), box.y - (box.height / 2));
            rects[i].drawOutline(ctx, "black", .2, 1);
        }
    }
}

CharacterRenderer.prototype.setColor = function(color, poly, ctx) { 
    if (color.gradient) {
        var gradient = color.gradient;
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
            color = g;
        } else color = color;
    }
    ctx.fillStyle = color;
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
    var group = null;
    for (var i = 0; i < this.groups.length; i++) {
        if (this.groups[i].name == parts.group) {
            group = this.groups[i];
            break;
        }
    }
    if (!group){
        group = { name : parts.group, points : new Array(), rects : new Array() };  
        this.groups[this.groups.length] = group;
    } 
    var pad = .8 + addpad;
    if (parts.width && parts.height) this.addCharacterGroupPart(part, box, pad, group);
    else {
        if (parts.parts) {
            var keys = Object.keys(parts.parts);
            for (var i = 0; i < keys.length; i++) this.addCharacterGroupPart(parts.parts[keys[i]], box, pad, group);
        }
    }
    if (parts.angle) group.angle = parts.angle;
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
    this.addCharacterGroupPart(part, box, pad, group);
    group.color = part.color ? part.color : color;
    if (part.zindex || part.zindex == 0) group.zindex = part.zindex;
    else group.zindex = 1000 + num;
    if (part.parts) this.updateGroup(part.parts, group.color, part.zindex);
    if (part.clip) group.clip = part.clip;
    if (part.path) group.path = part.path;
    if (part.debug) group.debug = part.debug;
}

CharacterRenderer.prototype.addCharacterGroupPart = function(part, box, pad, group) {
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
    if (part.angle) {
        group.angle = part.angle;
        var cp = new Point(part_x + (part_width / 2), part_y + (part_height / 2));
        group.center = cp;
        if (part.parts) group.parts = part.parts;
    }
}

CharacterRenderer.prototype.updateGroup = function(parts, color, zindex) {
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = parts[keys[i]];
        part.zindex = ++zindex;
        if (!part.color) part.color = color;
        if (part.parts) this.updateGroup(part.parts, color, zindex);
    }
}

CharacterRenderer.prototype.rotateGroup = function(groups, group, parts) {
    if (!parts) parts = group.parts;
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        for (var ii = 0; ii < groups.length; ii++) {
            if (this.groups[ii].name != keys[i]) continue;
            var np = new Polygon();
            np.setPoints(groups[ii].points);
            groups[ii].points = np.rotate(group.angle, group.center);
            if (groups[ii].center) {
                var l = new Line(group.center, groups[ii].center);
                l = l.rotate(group.angle);
                groups[ii].center = l.end;
            }
            groups[ii].rects[0] = np.getMbr();
            if (parts[keys[i]].parts) this.rotateGroup(groups, group, parts[keys[i]].parts);
            break;
        }
    }
}