"use strict";

function CharacterRendererGroupsGroupPathClip() {
}

CharacterRendererGroupsGroupPathClip.prototype.startClipPath = function(path, poly, ctx) { 
    ctx.save();
    ctx.clip();
}
    
CharacterRendererGroupsGroupPathClip.prototype.endClipPath = function(path, poly, ctx, color) { 
    ctx.restore();
}

