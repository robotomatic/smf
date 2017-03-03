"use strict";

function CharacterRendererGroups() {
    this.groupdefs = new Array();
    this.grouprenderer = new CharacterRendererGroupsGroup();
    this.debug = false;
    this.debugrects = new Array();
}

CharacterRendererGroups.prototype.renderGroups = function(ctx, character, groupnames, groups, color) {
    this.debugrects.length = 0;        
    if (!groups.length) return;
    groups.sort(sortByZIndex);  
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        this.grouprenderer.renderGroup(ctx, character.groups[group.name], groupnames, group, color, this.debugrects);
    }
    this.renderDebug(ctx);
}

CharacterRendererGroups.prototype.renderDebug = function(ctx) { 
    if (this.debugrects && this.debugrects.length) this.drawDebugRectangles(this.debugrects, ctx);        
}

CharacterRendererGroups.prototype.drawDebugRectangles = function(rects, ctx) { 
    if (rects.length) {
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            for (var ii = 0; ii < r.length; ii++) {
                r[ii].drawOutline(ctx, "black", .2, 1);
            }
        }
    }
}