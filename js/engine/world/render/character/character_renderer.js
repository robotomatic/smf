"use strict";

function CharacterRenderer() {
    this.rendermanager = new CharacterRenderManager();
    this.grouprenderer = new CharacterRendererGroups();
}

CharacterRenderer.prototype.draw = function(ctx, animationchar, debug) {
    var character = animationchar.animator.puppet.animchar;
    if (!character) return;
    var color = animationchar.color;
    this.rendermanager.updateCharacter(animationchar.mbr, character, character.pad || 0, color);
    this.grouprenderer.renderGroups(ctx, character, this.rendermanager.groupnames, this.rendermanager.groups, color, debug);
}