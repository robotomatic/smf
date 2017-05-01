"use strict";

function CharacterRendererGroupsGroupRendererPathClip() {
}

CharacterRendererGroupsGroupRendererPathClip.prototype.startClipPath = function(gamecanvas) { 
    gamecanvas.save();
    gamecanvas.clip();
}
    
CharacterRendererGroupsGroupRendererPathClip.prototype.endClipPath = function(gamecanvas) { 
    gamecanvas.restore();
}

