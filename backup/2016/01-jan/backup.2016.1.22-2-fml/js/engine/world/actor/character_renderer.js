
/*

- need ass cheeks attached to hips and delts attached to shoulders

- fix dummy's stupid facehead

- rotate groups (body, headface, etc)

- knees & elbows, hands & feet

- path for arms and legs

- darken main color for shadow

- possible to mask body to create shadow where arms overlap?

- cache gradients and clipped areas? or bake all possible animations?

- control render style : want choppy hair, frowny mouth

- idle animations : occasional by type (look around, smack lips, shuffle, wag tail, etc)

- better "chain" path creation : need this for armies and leggies as well

- draw char at 2x reso and scale down to render?

*/



function CharacterRenderer() {
    
    // todo: these need to be real objects
    
    this.groupdefs = new Array();
    this.groups = new Array();
    this.clippath = null;
    this.linkpathStart = null;
    this.linkpathEnd = null;
    this.linkpathColor = "";
}

CharacterRenderer.prototype.draw = function(ctx, color, box, character, scale, debug) {
    this.groupdefs.length = 0;
    this.groups.length = 0;
    var debugrects = new Array();
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
            if (gg.draw == false) continue;
            if (poly.points.length) {
                if (gg.link && gg.link != "skip") {
                    if (!this.linkpathStart) this.startLinkPath(poly, gg.color ? gg.color : color);
                    else if (gg.link && this.linkpathStart) this.addLinkPath(poly);
                } else {
                    if (this.linkpathStart && gg.link != "skip") this.endLinkPath(ctx);
                    ctx.beginPath();
                    ctx.fillStyle = this.setColor(gg.color ? gg.color : color, poly, ctx);
                    if (gg.clip) {
                        if (gg.clip == "start") this.startClipPath(gg.path, poly, ctx);
                        else if (gg.clip == "end") this.endClipPath(gg, poly, ctx, color);
                    } else this.drawPolygon(gg.path, poly, ctx);
                } 
                if (debug || group.debug) debugrects.push(rects);
            }
        }
    }
    
    if (debugrects.length) this.drawDebugRectangles(debugrects, box, ctx)        
}

CharacterRenderer.prototype.startLinkPath = function(poly, color) { 
    if (!this.linkpathStart) {
        this.linkpathStart = new Polygon();
        this.linkpathEnd = new Polygon();
        this.linkpathColor = color;
    }
    this.addLinkPath(poly);
}
    
CharacterRenderer.prototype.addLinkPath = function(poly) { 
    if (this.linkpathStart.points.length > 1) {
        var spps = this.linkpathStart.points[this.linkpathStart.points.length - 2];
        var sppe = this.linkpathStart.points[this.linkpathStart.points.length -1];
        var cs = getLineIntersection(spps.x, spps.y, sppe.x, sppe.y, poly.points[1].x, poly.points[1].y, poly.points[2].x, poly.points[2].y);
        if (cs.onLine1 || cs.onLine2) this.linkpathStart.points[this.linkpathStart.points.length - 1] = new Point(cs.x, cs.y);
        else this.linkpathStart.addPoint(poly.points[1]);
        var epps = this.linkpathEnd.points[this.linkpathEnd.points.length - 2];
        var eppe = this.linkpathEnd.points[this.linkpathEnd.points.length -1];
        var ce = getLineIntersection(epps.x, epps.y, eppe.x, eppe.y, poly.points[0].x, poly.points[0].y, poly.points[3].x, poly.points[3].y);
        if (ce.onLine1 || ce.onLine2) this.linkpathEnd.points[this.linkpathEnd.points.length - 1] = new Point(ce.x, ce.y);
        else this.linkpathEnd.addPoint(poly.points[0]);
    } else {
        this.linkpathStart.addPoint(poly.points[1]);
        this.linkpathEnd.addPoint(poly.points[0]);
    }
    this.linkpathStart.addPoint(poly.points[2]);
    this.linkpathEnd.addPoint(poly.points[3]);
}
    
CharacterRenderer.prototype.endLinkPath = function(ctx) { 
    var path = new Polygon();
    for (var i = 0; i < this.linkpathStart.points.length; i++) path.addPoint(this.linkpathStart.points[i]);
    for (var i = this.linkpathEnd.points.length; i > 0 ; i--) path.addPoint(this.linkpathEnd.points[i - 1]);
    ctx.beginPath();
    ctx.fillStyle = this.linkpathColor;
    path.drawSmooth(ctx);
    this.linkpathStart = null;
    this.linkpathEnd = null;
    this.linkpathColor = "";
}
    
CharacterRenderer.prototype.startClipPath = function(path, poly, ctx) { 
    ctx.save();
    this.drawPolygon(path, poly, ctx);
    this.clippath = new Polygon();
    this.clippath.setPoints(poly.getPoints());
    if (path) this.clippath.path = path;
    ctx.clip();
}
    
CharacterRenderer.prototype.endClipPath = function(path, poly, ctx, color) { 
    this.drawPolygon(path, poly, ctx);
    ctx.restore();
    if (this.clippath) {
        ctx.beginPath();
        var lw = .8;
        this.drawPolygonOutline(this.clippath.path, this.clippath, ctx, color, lw);
        this.clippath = null;
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
            var r = rects[i];
            for (var ii = 0; ii < r.length; ii++) {
                r[ii].translate(box.x - (box.width / 2), box.y - (box.height / 2));
                r[ii].drawOutline(ctx, "black", .2, 1);
            }
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
    return color;
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
    if (part.group) this.drawGroup(box, part, pad, color);
    else if (part.height && part.width) this.drawPart(box, partname, part, pad, color);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        if (part.group) this.drawGroup(box, part.parts, pad, color);
        else this.drawCharacterParts(box, part.parts, pad, color);
    }
}

CharacterRenderer.prototype.drawGroup = function(box, parts, addpad, color) {
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
    if (parts.draw == false) group.draw = false;
}

CharacterRenderer.prototype.drawPart = function(box, partname, part, addpad, color) {
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
    if (part.draw == false) group.draw = false;
    if (part.link) group.link = part.link;
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