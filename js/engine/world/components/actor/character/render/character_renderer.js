"use strict";

function CharacterRenderer() {
    this.rendermanager = new CharacterRenderManager();
    this.grouprenderer = new CharacterRendererGroups();
}

CharacterRenderer.prototype.draw = function(gamecanvas, character, scale, debug) {
    this.rendermanager.updateCharacter(character);
    this.grouprenderer.renderGroups(gamecanvas, character, this.rendermanager, scale, debug);
}