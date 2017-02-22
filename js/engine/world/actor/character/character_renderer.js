"use strict";

function CharacterRenderer() {
    this.groupdefs = new Array();
    this.rendermanager = new CharacterRenderManager();
    this.clippath = new Polygon();
    this.linkpathStart = new Polygon();
    this.linkpathType = "";
    this.linkpathEnd = new Polygon();
    this.linkpathColor = "";
    this.path = new Polygon();
    
    this.box = new Rectangle(0, 0, 0, 0);
    this.newbox = new Rectangle(0, 0, 0, 0);    
    this.polygon = new Polygon();
    
    this.width = 0;
    this.height = 0;
    this.debug = false;
    this.debugrects;
    this.rotatepoly = new Polygon();
    this.rotateline = new Line();
}

CharacterRenderer.prototype.draw = function(ctx, playerchar) {
    
    var mbr = playerchar.mbr; 
    var puppet = playerchar.animator.puppet    
    
    var character = puppet.animchar;
    if (!character) return;
    
    this.box.x = mbr.x;
    this.box.y = mbr.y;
    this.box.width = mbr.width;
    this.box.height = mbr.height;

    
    this.width = mbr.width;
    this.height = mbr.height;
    
    var px = mbr.x;
    var py = mbr.y;
    
    var pad = character.pad ? character.pad : 0;

    var color = playerchar.color;
    
    this.newbox.x = mbr.x;
    this.newbox.y = mbr.y;
    this.newbox.width = this.width;
    this.newbox.height = this.height;
    
    this.rendermanager.updateCharacter(this.newbox, character, pad, color);
    
    var groups = this.rendermanager.groups;
    if (!groups.length) return;

    if (!this.groupdefs.length && character.groups) {
        var keys = Object.keys(character.groups);
        for (var i = 0; i < keys.length; i++) {
            this.groupdefs[keys[i]] = character.groups[keys[i]];
        }
    }

    if (this.debug) {
        if (!this.debugrects) this.debugrects = new Array();
        else this.debugrects.length = 0;
    } else {
        if (this.debugrects) this.debugrects.length = 0;        
    }
    
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var name = group.name;
        var groupdef = this.groupdefs[name];
        if (!groupdef || groupdef.draw == false) continue;
        var z = 100;
        if (groupdef.zindex || groupdef.zindex == 0) z = groupdef.zindex;
        groups[i].zindex  = z;
    }

    groups.sort(sortByZIndex);  

    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var name = group.name;
        var groupdef = this.groupdefs[name];
        var points = group.points;
        var rects = group.rects;
        this.polygon.points.length = 0;
        if (points.length) this.polygon.setPoints(points);
        
        if (rects && groupdef && groupdef.path) {
            if (groupdef.path == "smooth") this.polygon.filterPoints(rects);
            else if (groupdef.path == "round") this.polygon.filterPoints(rects); 
            else if (groupdef.path == "join") this.polygon.filterPoints(rects); 
            else if (groupdef.path == "chain") this.polygon.filterChain(rects); 
        }

        if (group.angle && (!groupdef || !groupdef.path == "join")) {
            this.polygon.setPoints(this.polygon.rotate(group.angle));
            if (group.parts) this.rotateGroup(group, null);
        }
        
        var gg = groupdef ? groupdef : group;
        if (gg.draw == false) continue;

        if (!this.polygon.points.length) continue;

        if (gg.link && gg.link != "skip") {
            if (!this.linkpathStart.points.length) this.startLinkPath(this.polygon, gg.color ? gg.color : color, gg.linktype);
            else if (gg.link && this.linkpathStart.points.length) this.addLinkPath(this.polygon);
        } else {
            
            if (this.linkpathStart.points.length && gg.link != "skip") this.endLinkPath(ctx, this.linkpathType);
            
            ctx.beginPath();
            var c = this.setColor(gg.color ? gg.color : color, this.polygon, ctx);
            ctx.fillStyle = c;
            
            if (gg.clip) {
                if (gg.clip == "start") this.startClipPath(gg.path, this.polygon, ctx);
                else if (gg.clip == "end") this.endClipPath(gg, this.polygon, ctx, color);
            } else this.drawPolygon(gg.path, this.polygon, ctx);
        } 
        
        
        if (this.debug || group.debug) this.debugrects.push(rects);
    }

    if (this.debugrects && this.debugrects.length) this.drawDebugRectangles(this.debugrects, this.box, ctx);        
}


CharacterRenderer.prototype.startLinkPath = function(poly, color, linktype) { 
    if (!this.linkpathStart.points.length) {
        this.linkpathStart.points.length = 0;
        this.linkpathEnd.points.length = 0;
        this.linkpathColor = color;
        this.linkpathType = (linktype) ? linktype : "";
    }
    this.addLinkPath(poly);
}
    
CharacterRenderer.prototype.addLinkPath = function(poly) { 
    if (this.linkpathStart.points.length > 1) {
        var spps = this.linkpathStart.points[this.linkpathStart.points.length - 2];
        var sppe = this.linkpathStart.points[this.linkpathStart.points.length -1];
        var cs = getLineIntersection(spps.x, spps.y, sppe.x, sppe.y, poly.points[1].x, poly.points[1].y, poly.points[2].x, poly.points[2].y);
        if (cs.onLine1 && cs.onLine2) this.linkpathStart.points[this.linkpathStart.points.length - 1] = geometryfactory.getPoint(cs.x, cs.y);
        else this.linkpathStart.addPoint(poly.points[1]);
        var epps = this.linkpathEnd.points[this.linkpathEnd.points.length - 2];
        var eppe = this.linkpathEnd.points[this.linkpathEnd.points.length -1];
        var ce = getLineIntersection(epps.x, epps.y, eppe.x, eppe.y, poly.points[0].x, poly.points[0].y, poly.points[3].x, poly.points[3].y);
        if (ce.onLine1 && ce.onLine2) this.linkpathEnd.points[this.linkpathEnd.points.length - 1] = geometryfactory.getPoint(ce.x, ce.y);
        else this.linkpathEnd.addPoint(poly.points[0]);
    } else {
        this.linkpathStart.addPoint(poly.points[1]);
        this.linkpathEnd.addPoint(poly.points[0]);
    }
    this.linkpathStart.addPoint(poly.points[2]);
    this.linkpathEnd.addPoint(poly.points[3]);
}
    
CharacterRenderer.prototype.endLinkPath = function(ctx, linktype) { 
    this.path.points.length = 0;
    for (var i = 0; i < this.linkpathStart.points.length; i++) this.path.addPoint(this.linkpathStart.points[i]);
    for (var i = this.linkpathEnd.points.length; i > 0 ; i--) this.path.addPoint(this.linkpathEnd.points[i - 1]);
    
    ctx.beginPath();
    ctx.fillStyle = this.linkpathColor;
    if (linktype === "join") this.path.draw(ctx);
    else this.path.drawSmooth(ctx);
    
    this.linkpathStart.points.length = 0;
    this.linkpathEnd.points.length = 0;
    this.linkpathColor = "";
}
    
CharacterRenderer.prototype.startClipPath = function(path, poly, ctx) { 
    ctx.save();
    this.drawPolygon(path, poly, ctx);
    this.clippath.points.length = 0;
    this.clippath.setPoints(poly.getPoints());
    if (path) this.clippath.path = path;
    ctx.clip();
}
    
CharacterRenderer.prototype.endClipPath = function(path, poly, ctx, color) { 
    this.drawPolygon(path, poly, ctx);
    ctx.restore();
    if (this.clippath.points.length) {
        ctx.beginPath();
        var lw = .8;
        this.drawPolygonOutline(this.clippath.path, this.clippath, ctx, color, lw);
        this.clippath.points.length = 0;
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

CharacterRenderer.prototype.rotateGroup = function(group, parts) {
    if (!parts) parts = group.parts;
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var gg = this.rendermanager.groupnames[keys[i]];
        if (!gg) continue;
        this.rotatepoly.setPoints(gg.points);
        gg.points = this.rotatepoly.rotate(group.angle, group.center);
        if (gg.center) {
            this.rotateline.start = group.center;
            this.rotateline.end = gg.center;
            this.rotateline = this.rotateline.rotate(group.angle);
            gg.center = this.rotateline.end;
        }
        gg.rects[0] = this.rotatepoly.getMbr();
        if (parts[keys[i]].parts) this.rotateGroup(group, parts[keys[i]].parts);
    }
}