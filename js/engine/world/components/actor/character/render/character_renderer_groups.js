"use strict";

function CharacterRendererGroups() {
    this.groupdefs = new Array();
    this.grouprenderer = new CharacterRendererGroupsGroup();

    this.gradientcanvas = null;
    this.scratchcanvas = new GameCanvas();
    this.rect = new Rectangle(0, 0, 0, 0);
    
    this.debugrects = new Array();
}

CharacterRendererGroups.prototype.renderGroups = function(gamecanvas, character, animchar, rendermanager, debug) {
    this.debugrects.length = 0;        

    var groupnames = rendermanager.groupnames;
    var groups = rendermanager.groups;
    if (!groups.length) return;
    groups.sort(sortByZIndex);  

    for (var i = 0; i < groups.length; i++) {
        var cnv = gamecanvas;
        var group = groups[i];
        var groupdef = animchar.groups[group.name];
        var gg = groupdef ? groupdef : group;
        var grad = character.colors && character.colors[gg.color] && character.colors[gg.color].gradient;
        if (grad) cnv = this.getGradient(gamecanvas, grad);
        var r = this.grouprenderer.renderGroup(cnv, character, groupdef, groupnames, group, this.debugrects, debug);
        if (grad && r) {
            this.scratchcanvas.setCompositeOperation("source-in");
            this.scratchcanvas.drawImage(this.gradientcanvas, 0, 0, cnv.canvas.width, cnv.canvas.height);
            gamecanvas.drawImage(cnv, 0, 0, cnv.canvas.width, cnv.canvas.height);
        }
    }
    
    this.renderDebug(gamecanvas);
}

CharacterRendererGroups.prototype.getGradient = function(gamecanvas, color) { 
    
    // todo:
    //
    // - need an attribute to group render calls so gradient canvas doesn't get cleared and drawn as often:
    //  --> draww bg arm and leg --> draw body --> draw fg arm
    //
    // - need to be able to store and manage muultiple gradients
    //
    
    this.createGradient(gamecanvas, color);
    this.scratchcanvas.canvas.width = gamecanvas.canvas.width;
    this.scratchcanvas.canvas.height = gamecanvas.canvas.height;
    return this.scratchcanvas;
}


CharacterRendererGroups.prototype.createGradient = function(gamecanvas, color) { 

    if (this.gradientcanvas) return;
    
    var start = color.start;   
    var stop = color.stop;   
    var top = color.top || 0;   
    var size = color.height;   
    this.gradientcanvas = new GameCanvas();

    this.gradientcanvas.canvas.width = 1;
    this.gradientcanvas.canvas.height = size;

    var g = this.gradientcanvas.createLinearGradient(0, top, 0, size);
    g.addColorStop(0, start);
    g.addColorStop(1, stop);
    this.gradientcanvas.setFillStyle(g);

    this.rect.width = 1;
    this.rect.height = size;

    this.gradientcanvas.beginPath();
    this.rect.draw(this.gradientcanvas);
    this.gradientcanvas.commit();
}




CharacterRendererGroups.prototype.renderDebug = function(gamecanvas) { 
    if (!this.debugrects || !this.debugrects.length) return;
    this.drawDebugRectangles(this.debugrects, gamecanvas);        
}

CharacterRendererGroups.prototype.drawDebugRectangles = function(rects, gamecanvas) { 
    if (!rects.length) return;
    gamecanvas.beginPath();
    gamecanvas.setStrokeStyle("black");
    gamecanvas.setLineWidth(.5);
    for (var i = 0; i < rects.length; i++) {
        rects[i].path(gamecanvas);
    }
    gamecanvas.stroke();
    gamecanvas.commit();
}