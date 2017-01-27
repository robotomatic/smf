"use strict";

function CharacterRenderer() {
    this.groupdefs = new Array();
    this.rendermanager = new CharacterRenderManager();
    this.clippath = null;
    this.linkpathStart = null;
    this.linkpathType = "";
    this.linkpathEnd = null;
    this.linkpathColor = "";
    this.newbox = new Rectangle(0, 0, 0, 0);    
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.debugrects;
    this.rotatepoly = new Polygon();
    this.rotateline = new Line();

    
    this.quality = 3;
    
    this.tempcanvas = null;
    this.tempctx = null;
    this.groupoutline = false;
    this.outline = {
        draw : true,
        drawinner : true,
        weight : 1,
        color : "black",
        canvas : null,
        ctx : null,
        name : null,
        mask : {
            part : null,
            color : ""
        }
    }
}

CharacterRenderer.prototype.draw = function(ctx, color, width, height, box, character, outline, debug, quality) {

    this.quality = quality;
    this.outline.draw = outline;
    this.debug = debug;
    
    var wpad = 4;
    var hpad = 2;
    
    if (!this.canvas) {
        var cw = width * this.quality;
        var ch = height * this.quality;
        this.width = cw;
        this.height = ch;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
    }
    this.canvas.width = this.width * wpad;
    this.canvas.height = this.height * hpad;
    
    
    if (this.outline.draw || this.outline.drawinner) {
        if (!this.outline.canvas) {
            this.outline.canvas = document.createElement('canvas');
            this.outline.ctx = this.outline.canvas.getContext("2d");
        }
    }
    
    this.newbox.x = ((this.width * wpad) / 2) - (this.width / 2);
    this.newbox.y = this.height / 2;
    this.newbox.width = this.width;
    this.newbox.height = this.height;

    var pad = character.pad ? character.pad : 0;

    color = (color) ? color : character.color;
    if (debug) color = "pink";
    
    this.rendermanager.updateCharacter(this.newbox, character, pad, color);
    
    var groups = this.rendermanager.groups;
    if (!groups.length) return;

    if (!this.groupdefs.length && character.groups) {
        var keys = Object.keys(character.groups);
        for (var i = 0; i < keys.length; i++) {
            this.groupdefs[keys[i]] = character.groups[keys[i]];
        }
    }

    if (debug) {
        if (!this.debugrects) this.debugrects = new Array();
        else this.debugrects.length = 0;
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
        var poly = new Polygon();
        if (points.length) poly.setPoints(points);

        if (rects && groupdef && groupdef.path) {
            if (groupdef.path == "smooth") poly.filterPoints(rects);
            else if (groupdef.path == "round") poly.filterPoints(rects); 
            else if (groupdef.path == "join") poly.filterPoints(rects); 
            else if (groupdef.path == "chain") poly.filterChain(rects); 
        }

        if (group.angle && (!groupdef || !groupdef.path == "join")) {
            poly.setPoints(poly.rotate(group.angle));
            if (group.parts) this.rotateGroup(group, null);
        }
        
        var gg = groupdef ? groupdef : group;
        if (gg.draw == false) continue;

        if (!poly.points.length) continue;

        var gctx = this.ctx;

        if (this.outline.drawinner) {
            if (gg.outline) {
                if (!this.tempcanvas) {
                    this.tempcanvas = document.createElement('canvas');
                    this.tempctx = this.tempcanvas.getContext("2d");
                }
                if (this.groupoutline && this.outline.name != gg.outline) {
                    this.drawInnerOutline();
                }
                if (!this.groupoutline) {
                    this.tempcanvas.width = this.canvas.width;
                    this.tempcanvas.height = this.canvas.height;
                    var gr = group.rects[0];
                    var r = new Rectangle(gr.x, gr.y, gr.width, gr.height / 2);
                    
                    if (group.angle) r.angle = group.angle + 90;
                    
                    this.outline.name = gg.outline;
                    if (gg.mask) this.outline.mask = { part : r, color : gg.color ? gg.color : color };
                    else this.outline.mask = null;
                }
                gctx = this.tempctx;
                this.groupoutline = true;
            } else if (this.groupoutline) {
                this.drawInnerOutline();
            }
        }

        if (gg.link && gg.link != "skip") {
            if (!this.linkpathStart) this.startLinkPath(poly, gg.color ? gg.color : color, gg.linktype);
            else if (gg.link && this.linkpathStart) this.addLinkPath(poly);
        } else {
            
            if (this.linkpathStart && gg.link != "skip") this.endLinkPath(gctx, this.linkpathType);
            
            gctx.beginPath();
            var c = this.setColor(gg.color ? gg.color : color, poly, gctx);
            gctx.fillStyle = c;
            
            if (gg.clip) {
                if (gg.clip == "start") this.startClipPath(gg.path, poly, gctx);
                else if (gg.clip == "end") this.endClipPath(gg, poly, gctx, color);
            } else this.drawPolygon(gg.path, poly, gctx);
        } 
        
        
        if (debug || group.debug) this.debugrects.push(rects);
    }

    if (this.outline.drawinner && this.groupoutline) {
        this.drawInnerOutline();
    }
    
    if (this.debugrects && this.debugrects.length) this.drawDebugRectangles(this.debugrects, box, this.ctx);        

    var rx = box.x - (((box.width * wpad) / 2) - (box.width / 2));
    var ry = box.y - (box.height / 2);
    var rw = box.width * wpad;
    var rh = box.height * hpad;
    
    if (this.outline.draw) {
        this.outline.canvas.width = this.canvas.width + (2 * this.outline.weight);
        this.outline.canvas.height = this.canvas.height + (2 * this.outline.weight);
        this.outline.ctx.fillStyle = this.outline.color;
        this.outline.ctx.fillRect(0, 0, this.outline.canvas.width, this.outline.canvas.height);
        this.outline.ctx.save();
        this.outline.ctx.globalCompositeOperation = 'destination-in';
        var sw = this.outline.canvas.width / this.canvas.width;
        var sh = this.outline.canvas.height / this.canvas.height;
        this.outline.ctx.scale(sw, sh); 
        this.outline.ctx.drawImage(this.canvas, 0, 0);
        this.outline.ctx.restore();        
        var pw = this.outline.canvas.width - this.outline.weight;
        var ph = this.outline.canvas.height - this.outline.weight;
        var pp = this.outline.weight / 2;
        ctx.drawImage(this.outline.canvas, pp, pp, pw, ph, rx, ry, rw, rh);
    }

    ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, rx, ry, rw, rh);    
}

CharacterRenderer.prototype.drawInnerOutline = function( ) { 
    var w = this.outline.weight;
    this.outline.canvas.width = this.canvas.width + (2 * w);
    this.outline.canvas.height = this.canvas.height + (2 * w);
    this.outline.ctx.fillStyle = this.outline.color;
    this.outline.ctx.fillRect(0, 0, this.outline.canvas.width, this.outline.canvas.height);
    this.outline.ctx.save();
    this.outline.ctx.globalCompositeOperation = 'destination-in';
    
    var sw = this.outline.canvas.width / this.canvas.width;
    var sh = this.outline.canvas.height / this.canvas.height;
    this.outline.ctx.scale(sw, sh); 
    this.outline.ctx.drawImage(this.tempcanvas, 0, 0);
    this.outline.ctx.restore();        

    this.ctx.globalCompositeOperation = 'source-atop';
    this.ctx.drawImage(this.outline.canvas, -w, -w);

    if (this.outline.mask) {
        var tc = this.ctx.fillStyle;
        this.ctx.fillStyle = this.outline.mask.color;
        this.outline.mask.part.translate(-w, -w);
        this.ctx.beginPath();
        this.outline.mask.part.drawRound(this.ctx);
        this.ctx.fillStyle = tc;
    }

    this.ctx.globalCompositeOperation = 'source-over';

    var pw = this.outline.canvas.width - w;
    var ph = this.outline.canvas.height - w;
    var pp = w / 2;

    this.ctx.drawImage(this.tempcanvas, -pp, -pp, pw, ph);
    this.groupoutline = false;
    this.outline.name = "";
    this.outline.mask = null;
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
        var spps = this.linkpathStart.points[this.linkpathStart.points.length - 2];
        var sppe = this.linkpathStart.points[this.linkpathStart.points.length -1];
        var cs = getLineIntersection(spps.x, spps.y, sppe.x, sppe.y, poly.points[1].x, poly.points[1].y, poly.points[2].x, poly.points[2].y);
        if (cs.onLine1 && cs.onLine2) this.linkpathStart.points[this.linkpathStart.points.length - 1] = new Point(cs.x, cs.y);
        else this.linkpathStart.addPoint(poly.points[1]);
        var epps = this.linkpathEnd.points[this.linkpathEnd.points.length - 2];
        var eppe = this.linkpathEnd.points[this.linkpathEnd.points.length -1];
        var ce = getLineIntersection(epps.x, epps.y, eppe.x, eppe.y, poly.points[0].x, poly.points[0].y, poly.points[3].x, poly.points[3].y);
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
    var path = new Polygon();
    for (var i = 0; i < this.linkpathStart.points.length; i++) path.addPoint(this.linkpathStart.points[i]);
    for (var i = this.linkpathEnd.points.length; i > 0 ; i--) path.addPoint(this.linkpathEnd.points[i - 1]);
    
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