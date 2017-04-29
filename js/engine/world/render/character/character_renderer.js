"use strict";

function CharacterRenderer() {
    this.rendermanager = new CharacterRenderManager();
    this.grouprenderer = new CharacterRendererGroups();
}

CharacterRenderer.prototype.draw = function(gamecanvas, character, debug) {
    var animchar = character.animator.animationcharacter.animchar;
    if (!animchar) return;
    this.rendermanager.updateCharacter(character, animchar);
    this.grouprenderer.renderGroups(gamecanvas, character, animchar, this.rendermanager, debug);
}