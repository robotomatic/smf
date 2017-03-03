"use strict";

function CharacterRenderer() {
    this.rendermanager = new CharacterRenderManager();
    this.grouprenderer = new CharacterRendererGroups();
}

CharacterRenderer.prototype.draw = function(ctx, playerchar) {
    var character = playerchar.animator.puppet.animchar;
    if (!character) return;
    var mbr = playerchar.mbr; 
    var pad = character.pad ? character.pad : 0;
    var color = playerchar.color;
    this.rendermanager.updateCharacter(mbr, character, pad, color);
    this.grouprenderer.initializeGroups(character, this.rendermanager.groupnames);
    this.grouprenderer.renderGroups(ctx, character, this.rendermanager.groups, color);
}