"use strict";

function CharacterRendererRenderer() {
    this.rotatepoly = new Polygon();
    this.rotateline = new Line();
    this.pathclip = new CharacterRendererGroupsGroupPathClip();
    this.pathlink = new CharacterRendererGroupsGroupPathLink();
}







CharacterRendererRenderer.prototype.hasLinkPath = function() { 
    return this.pathlink.linkpathStart.points.length;
}

CharacterRendererRenderer.prototype.startLinkPath = function(polygon, color, linktype) { 
    this.pathlink.startLinkPath(polygon, color, linktype);
}

CharacterRendererRenderer.prototype.addLinkPath = function(polygon) { 
    this.pathlink.addLinkPath(polygon);
}

CharacterRendererRenderer.prototype.endLinkPath = function(gamecanvas) { 
    this.pathlink.endLinkPath(gamecanvas);
}



CharacterRendererRenderer.prototype.startClipPath = function(gamecanvas) { 
    this.pathclip.startClipPath(gamecanvas);
}

CharacterRendererRenderer.prototype.endClipPath = function(gamecanvas) { 
    this.pathclip.endClipPath(gamecanvas);
}








    
CharacterRendererRenderer.prototype.drawPolygon = function(path, poly, gamecanvas) { 
    if (path == "smooth") poly.drawSmooth(gamecanvas);
    else if (path == "round") poly.drawRound(gamecanvas, 5);
    else if (path == "chain") poly.drawRound(gamecanvas, 5);
    else poly.draw(gamecanvas);
}

CharacterRendererRenderer.prototype.drawPolygonOutline = function(path, poly, gamecanvas, color, lineweight) { 
    if (path == "smooth") poly.drawOutlineSmooth(gamecanvas, color, lineweight);
    else if (path == "round") poly.drawOutlineRound(gamecanvas, 5, color, lineweight);
    else if (path == "chain") poly.drawOutlineRound(gamecanvas, 5, color, lineweight);
    else poly.drawOutline(gamecanvas, color, lineweight);
}

CharacterRendererRenderer.prototype.setColor = function(color, poly, gamecanvas) { 
    if (color.gradient) {
        var gradient = color.gradient;
        var mbr = poly.getMbr();
        var mbry = mbr.y;
        var mbrh  = mbr.y + mbr.height;
        if (mbry && mbrh) {
            if (gradient.top) mbry = mbry -= gradient.top;
            if (gradient.height) mbrh = mbry + gradient.height;
            var g = gamecanvas.createLinearGradient(0, mbry, 0, mbrh);
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        } else color = color;
    }
    return color;
}

CharacterRendererRenderer.prototype.rotateGroup = function(groupnames, group, parts) {
    if (!parts) parts = group.parts;
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var gg = groupnames[keys[i]];
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
        if (parts[keys[i]].parts) this.rotateGroup(groupnames, group, parts[keys[i]].parts);
    }
}

