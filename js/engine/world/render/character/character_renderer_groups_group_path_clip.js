"use strict";

function CharacterRendererGroupsGroupPathClip() {
}

CharacterRendererGroupsGroupPathClip.prototype.startClipPath = function(path, poly, gamecanvas) { 
    gamecanvas.save();
    gamecanvas.clip();
}
    
CharacterRendererGroupsGroupPathClip.prototype.endClipPath = function(path, poly, gamecanvas, color) { 
    gamecanvas.restore();
}

