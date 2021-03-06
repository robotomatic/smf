"use strict";

function CharacterRendererGroupsGroupRenderer() {
    this.rotatepoly = new Polygon();
    this.rotateline = new Line();
    this.pathclip = new CharacterRendererGroupsGroupRendererPathClip();
    this.pathlink = new CharacterRendererGroupsGroupRendererPathLink();
    this.polygon = new Polygon();
}



CharacterRendererGroupsGroupRenderer.prototype.shouldDraw = function() { 
    return this.polygon.points.length;
}




CharacterRendererGroupsGroupRenderer.prototype.buildPolygon = function(pathtype, groupnames, group) { 
    
    this.polygon.points.length = 0;
    this.polygon.setPoints(group.points);
    
    var rects = group.rects;
    if (rects && pathtype) {
        if (pathtype == "smooth") this.polygon.filterPoints(rects);
        else if (pathtype == "round") this.polygon.filterPoints(rects); 
        else if (pathtype == "join") this.polygon.filterPoints(rects); 
        else if (pathtype == "chain") this.polygon.filterChain(rects); 
    }

    if (group.angle && pathtype != "join") {
        this.polygon.setPoints(this.polygon.rotate(group.angle));
        if (group.parts) this.rotateGroup(groupnames, group, null);
    }
}


    
    



    
    
CharacterRendererGroupsGroupRenderer.prototype.hasLinkPath = function() { 
    return this.pathlink.linkpathStart.points.length;
}

CharacterRendererGroupsGroupRenderer.prototype.startLinkPath = function(color, linktype) { 
    this.pathlink.startLinkPath(this.polygon, color, linktype);
}

CharacterRendererGroupsGroupRenderer.prototype.addLinkPath = function() { 
    this.pathlink.addLinkPath(this.polygon);
}

CharacterRendererGroupsGroupRenderer.prototype.endLinkPath = function(gamecanvas) { 
    this.pathlink.endLinkPath(gamecanvas);
}



CharacterRendererGroupsGroupRenderer.prototype.startClipPath = function(gamecanvas) { 
    this.pathclip.startClipPath(gamecanvas);
}

CharacterRendererGroupsGroupRenderer.prototype.endClipPath = function(gamecanvas) { 
    this.pathclip.endClipPath(gamecanvas);
}








    
CharacterRendererGroupsGroupRenderer.prototype.drawPolygon = function(path, gamecanvas) { 
    if (path == "smooth") this.polygon.drawSmooth(gamecanvas);
    else if (path == "round") this.polygon.drawRound(gamecanvas, 5);
    else if (path == "chain") this.polygon.drawRound(gamecanvas, 5);
    else this.polygon.draw(gamecanvas);
}

CharacterRendererGroupsGroupRenderer.prototype.drawPolygonOutline = function(path, gamecanvas, color, lineweight) { 
    if (path == "smooth") this.polygon.drawOutlineSmooth(gamecanvas, color, lineweight);
    else if (path == "round") this.polygon.drawOutlineRound(gamecanvas, 5, color, lineweight);
    else if (path == "chain") this.polygon.drawOutlineRound(gamecanvas, 5, color, lineweight);
    else this.polygon.drawOutline(gamecanvas, color, lineweight);
}









CharacterRendererGroupsGroupRenderer.prototype.rotateGroup = function(groupnames, group, parts) {
    if (!parts) parts = group.parts;
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var gg = groupnames[keys[i]];
        if (!gg) continue;
        gg.rotate(group.angle, group.center);
        if (gg.center) {
            this.rotateline.start.x = group.center.x;
            this.rotateline.start.y = group.center.y;
            this.rotateline.end.x = gg.center.x;
            this.rotateline.end.y = gg.center.y;
            this.rotateline = this.rotateline.rotate(group.angle);
            gg.center.x = this.rotateline.end.x;
            gg.center.y = this.rotateline.end.y;
        }
        gg.rects[0] = this.rotatepoly.getMbr();
        if (parts[keys[i]].parts) this.rotateGroup(groupnames, group, parts[keys[i]].parts);
    }
}

