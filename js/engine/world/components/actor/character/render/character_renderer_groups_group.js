"use strict";

function CharacterRendererGroupsGroup() {
    this.renderer = new CharacterRendererRenderer();
    this.debugoutlinecolor = "darkgray";
    this.colors = new Array();
}

CharacterRendererGroupsGroup.prototype.renderGroup = function(gamecanvas, character, groupdef, groupnames, group, debugrects, debug) {

    var gp = groupdef ? groupdef.path : "";
    this.renderer.buildPolygon(gp, groupnames, group);
    if (!this.renderer.shouldDraw()) return;

    var gg = groupdef ? groupdef : group;
    if (gg.draw == false) return;
    
    var dodebug = debug.character || debug.guts;
    var color = dodebug ? "white" : this.getColor(gamecanvas, character, gg.color);
    
    var linkpath = this.renderer.hasLinkPath();
    if (gg.link && gg.link != "skip") {
        if (!linkpath) {
            this.renderer.startLinkPath(color, gg.linktype);
        } else if (gg.link && linkpath) {
            this.renderer.addLinkPath();
        }
    } else {
        if (linkpath && gg.link != "skip") {
            this.renderer.endLinkPath(gamecanvas);
        }

        gamecanvas.setFillStyle(color);
        gamecanvas.beginPath();

        this.renderer.drawPolygon(gg.path, gamecanvas);
        
        if (gg.clip) {
            if (gg.clip == "start") {
                this.renderer.startClipPath(gamecanvas);
            } else if (gg.clip == "end") {
                this.renderer.endClipPath(gamecanvas);
            }
        }
    } 
    
    gamecanvas.commit();
}


CharacterRendererGroupsGroup.prototype.getColor = function(gamecanvas, character, colorname) {
    if (this.colors[colorname]) return this.colors[colorname];
    var colors = character.colors;
    if (!colors[colorname]) return "white";
    
    //
    //
    // TODO: Here is the gradient place for the thing
    
    
    var cc = colors[colorname];
    this.colors[colorname] = cc;
    return cc;
}