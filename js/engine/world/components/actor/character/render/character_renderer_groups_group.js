"use strict";

function CharacterRendererGroupsGroup() {
    this.renderer = new CharacterRendererGroupsGroupRenderer();
    this.debugoutlinecolor = "darkgray";
    this.colors = new Array();
}

CharacterRendererGroupsGroup.prototype.renderGroup = function(gamecanvas, character, groupdef, groupnames, group, debugrects, debug) {

    var gp = groupdef ? groupdef.path : "";
    this.renderer.buildPolygon(gp, groupnames, group);
    if (!this.renderer.shouldDraw()) return false;

    var gg = groupdef ? groupdef : group;
    if (gg.draw == false) return false;
    
    var dodebug = debug.character || debug.guts;
    var color = dodebug ? "white" : this.getColor(gamecanvas, character, gg.color);
    
    var linkpath = this.renderer.hasLinkPath();
    if (gg.link && gg.link != "skip") {
        if (!linkpath) {
            this.renderer.startLinkPath(color, gg.linktype);
            return false;
        } else if (gg.link && gg.linktype == "end") {
            if (linkpath && gg.link != "skip") {
                this.renderer.addLinkPath();
                this.renderer.endLinkPath(gamecanvas);
                return true;
            }
        } else if (gg.link && linkpath) {
            this.renderer.addLinkPath();
            return false;
        }
    } else {

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
    return true;
}


CharacterRendererGroupsGroup.prototype.getColor = function(gamecanvas, character, colorname) {
    this.gradient = false;
    if (this.colors[colorname]) return this.colors[colorname];
    var colors = character.colors;
    if (!colors[colorname]) return "white";
    var cc = colors[colorname];
    if (cc.gradient) cc = "black";
    this.colors[colorname] = cc;
    return cc;
}