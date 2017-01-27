"use strict";


/*


think of a better way to render:
--> we know all groups, links and parts after the 1st run, keep them in memory
--> just need to update items instead of group and collect?




- rotate groups (body, headface, etc)

- darken main color for shadow

- possible to mask body to create shadow where arms overlap?

- cache gradients and clipped areas? or bake all possible animations?

- control render style : want choppy hair, frowny mouth

- draw char at 2x reso and scale down to render?

*/



function CharacterRenderer() {
    
    // todo: these need to be real objects
    
    this.groupdefs = new Array();
    this.rendermanager = new CharacterRenderManager();
    
    this.clippath = null;
    this.linkpathStart = null;
    this.linkpathType = "";
    this.linkpathEnd = null;
    this.linkpathColor = "";
}

CharacterRenderer.prototype.draw = function(ctx, color, width, box, character, scale, debug) {
    this.groupdefs.length = 0;
    this.rendermanager.reset();
    let debugrects = new Array();
    
    if (debug) color = "pink";
    
    if (character.groups) {
        let keys = Object.keys(character.groups);
        for (let i = 0; i < keys.length; i++) {
            this.groupdefs[keys[i]] = character.groups[keys[i]];
        }
    }
    color = (color) ? color : character.color;
    let bw = box.width * 2;
    let bh = box.height * 2;
    let bx = box.x - (box.width / 2);
    let by = box.y - (box.height / 2);
    let newbox = new Rectangle(box.width / 2, box.height / 2, box.width, box.height);
    
    let pad = character.pad ? character.pad : 0;
    
    this.rendermanager.drawCharacterParts(newbox, character, pad, color);
    
    let groups = this.rendermanager.groups;
    if (groups.length) {
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            let name = group.name;
            let groupdef = this.groupdefs[name];
            if (!groupdef || groupdef.draw == false) continue;
            let z = 100;
            if (groupdef.zindex || groupdef.zindex == 0) z = groupdef.zindex;
            groups[i].zindex  = z;
        }
        groups.sort(sortByZIndex);  
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            let name = group.name;
            let groupdef = this.groupdefs[name];
            let points = group.points;
            let rects = group.rects;
            let poly = new Polygon();
            if (points.length) poly.setPoints(points);
            if (rects && groupdef && groupdef.path) {
                if (groupdef.path == "smooth") poly.filterPoints(rects);
                else if (groupdef.path == "round") poly.filterPoints(rects); 
                else if (groupdef.path == "join") poly.filterPoints(rects); 
                else if (groupdef.path == "chain") poly.filterChain(rects); 
            }
            if (group.angle && (!groupdef || !groupdef.path == "join")) {
                poly.setPoints(poly.rotate(group.angle));
                if (group.parts) this.rotateGroup(groups, group, null);
            }
            poly.translate(box.x - (box.width / 2), box.y - (box.height / 2));
            let gg = groupdef ? groupdef : group;
            if (gg.draw == false) continue;
            if (poly.points.length) {
                if (gg.link && gg.link != "skip") {
                    if (!this.linkpathStart) this.startLinkPath(poly, gg.color ? gg.color : color, gg.linktype);
                    else if (gg.link && this.linkpathStart) this.addLinkPath(poly);
                } else {
                    if (this.linkpathStart && gg.link != "skip") this.endLinkPath(ctx, this.linkpathType);
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

CharacterRenderer.prototype.startLinkPath = function(poly, color, linktype) { 
    if (!this.linkpathStart) {
        this.linkpathStart = new Polygon();
        this.linkpathEnd = new Polygon();
        this.linkpathColor = color;
        this.linkpathType = (linktype) ? linktype : "";
    }
    this.addLinkPath(poly);
}
    
CharacterRenderer.prototype.addLinkPath = function(poly) { 
    if (this.linkpathStart.points.length > 1) {
        let spps = this.linkpathStart.points[this.linkpathStart.points.length - 2];
        let sppe = this.linkpathStart.points[this.linkpathStart.points.length -1];
        let cs = getLineIntersection(spps.x, spps.y, sppe.x, sppe.y, poly.points[1].x, poly.points[1].y, poly.points[2].x, poly.points[2].y);
        if (cs.onLine1 && cs.onLine2) this.linkpathStart.points[this.linkpathStart.points.length - 1] = new Point(cs.x, cs.y);
        else this.linkpathStart.addPoint(poly.points[1]);
        let epps = this.linkpathEnd.points[this.linkpathEnd.points.length - 2];
        let eppe = this.linkpathEnd.points[this.linkpathEnd.points.length -1];
        let ce = getLineIntersection(epps.x, epps.y, eppe.x, eppe.y, poly.points[0].x, poly.points[0].y, poly.points[3].x, poly.points[3].y);
        if (ce.onLine1 && ce.onLine2) this.linkpathEnd.points[this.linkpathEnd.points.length - 1] = new Point(ce.x, ce.y);
        else this.linkpathEnd.addPoint(poly.points[0]);
    } else {
        this.linkpathStart.addPoint(poly.points[1]);
        this.linkpathEnd.addPoint(poly.points[0]);
    }
    this.linkpathStart.addPoint(poly.points[2]);
    this.linkpathEnd.addPoint(poly.points[3]);
}
    
CharacterRenderer.prototype.endLinkPath = function(ctx, linktype) { 
    let path = new Polygon();
    for (let i = 0; i < this.linkpathStart.points.length; i++) path.addPoint(this.linkpathStart.points[i]);
    for (let i = this.linkpathEnd.points.length; i > 0 ; i--) path.addPoint(this.linkpathEnd.points[i - 1]);
    ctx.beginPath();
    ctx.fillStyle = this.linkpathColor;
    if (linktype == "join") path.draw(ctx);
    else path.drawSmooth(ctx);
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
        let lw = .8;
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
        for (let i = 0; i < rects.length; i++) {
            let r = rects[i];
            for (let ii = 0; ii < r.length; ii++) {
                r[ii].translate(box.x - (box.width / 2), box.y - (box.height / 2));
                r[ii].drawOutline(ctx, "black", .2, 1);
            }
        }
    }
}

CharacterRenderer.prototype.setColor = function(color, poly, ctx) { 
    if (color.gradient) {
        let gradient = color.gradient;
        let mbr = poly.getMbr();
        let mbry = mbr.y;
        let mbrh  = mbr.y + mbr.height;
        if (mbry && mbrh) {
            if (gradient.top) mbry = mbry -= gradient.top;
            if (gradient.height) mbrh = mbry + gradient.height;
            let g = ctx.createLinearGradient(0, mbry, 0, mbrh);
            let start = gradient.start;
            let stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        } else color = color;
    }
    return color;
}

CharacterRenderer.prototype.rotateGroup = function(groups, group, parts) {
    if (!parts) parts = group.parts;
    let keys = Object.keys(parts);
    for (let i = 0; i < keys.length; i++) {
        for (let ii = 0; ii < groups.length; ii++) {
            if (groups[ii].name != keys[i]) continue;
            let np = new Polygon();
            np.setPoints(groups[ii].points);
            groups[ii].points = np.rotate(group.angle, group.center);
            if (groups[ii].center) {
                let l = new Line(group.center, groups[ii].center);
                l = l.rotate(clamp(group.angle));
                groups[ii].center = l.end;
            }
            groups[ii].rects[0] = np.getMbr();
            if (parts[keys[i]].parts) this.rotateGroup(groups, group, parts[keys[i]].parts);
            break;
        }
    }
}