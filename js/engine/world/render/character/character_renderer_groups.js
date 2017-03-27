"use strict";

function CharacterRendererGroups() {
    this.groupdefs = new Array();
    this.grouprenderer = new CharacterRendererGroupsGroup();
    this.debugrects = new Array();
}

CharacterRendererGroups.prototype.renderGroups = function(gamecanvas, character, groupnames, groups, color, debug) {
    if (debug.character || debug.guts) color = "white";
    this.debugrects.length = 0;        
    if (!groups.length) return;
    groups.sort(sortByZIndex);  
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        this.grouprenderer.renderGroup(gamecanvas, character.groups[group.name], groupnames, group, color, this.debugrects, debug);
    }
    this.renderDebug(gamecanvas);
}

CharacterRendererGroups.prototype.renderDebug = function(gamecanvas) { 
    if (!this.debugrects || !this.debugrects.length) return;
    this.drawDebugRectangles(this.debugrects, gamecanvas);        
}

CharacterRendererGroups.prototype.drawDebugRectangles = function(rects, gamecanvas) { 
    if (!rects.length) return;
    gamecanvas.beginPath();
    gamecanvas.setStrokeStyle("darkgray");
    gamecanvas.setLineWidth(.5);
    for (var i = 0; i < rects.length; i++) {
        rects[i].path(gamecanvas);
    }
    gamecanvas.stroke();
    gamecanvas.commit();
}