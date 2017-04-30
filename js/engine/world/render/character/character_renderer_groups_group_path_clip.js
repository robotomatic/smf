"use strict";

function CharacterRendererGroupsGroupPathClip() {
}

CharacterRendererGroupsGroupPathClip.prototype.startClipPath = function(gamecanvas) { 
    gamecanvas.save();
    gamecanvas.clip();
}
    
CharacterRendererGroupsGroupPathClip.prototype.endClipPath = function(gamecanvas) { 
    gamecanvas.restore();
}

