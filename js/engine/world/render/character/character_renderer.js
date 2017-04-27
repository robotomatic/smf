"use strict";

function CharacterRenderer() {
    this.rendermanager = new CharacterRenderManager();
    this.grouprenderer = new CharacterRendererGroups();
}

CharacterRenderer.prototype.draw = function(gamecanvas, animationchar, debug) {
    var character = animationchar.animator.animationcharacter.animchar;
    if (!character) return;
    var color = animationchar.color;
    this.rendermanager.updateCharacter(animationchar.mbr, character, 0, color);
    this.grouprenderer.renderGroups(gamecanvas, character, this.rendermanager.groupnames, this.rendermanager.groups, color, debug);
}