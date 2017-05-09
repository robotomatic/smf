"use strict";

function CharacterRendererGroups() {
    this.groupdefs = new Array();
    this.grouprenderer = new CharacterRendererGroupsGroup();

    this.gradients = new Array();
    this.scratchcanvas = new GameCanvas();
    this.padtop = 20;
    
    this.debugrects = new Array();
}

CharacterRendererGroups.prototype.renderGroups = function(gamecanvas, character, rendermanager, scale, debug) {
    this.debugrects.length = 0;        
    var groupnames = rendermanager.groupnames;
    var groups = rendermanager.groups;
    if (!groups.length) return;
    groups.sort(sortByZIndex);  
    for (var i = 0; i < groups.length; i++) {
        var cnv = gamecanvas;
        var group = groups[i];
        var groupdef = character.groups[group.name];
        var gg = groupdef ? groupdef : group;
        var colorname = gg ? gg.color : "";
        var grad = character.colors && character.colors[colorname] && character.colors[colorname].gradient;
        if (grad) cnv = this.getGradient(gamecanvas, colorname, grad);
        var r = this.grouprenderer.renderGroup(cnv, character, groupdef, groupnames, group, this.debugrects, debug);
        if (grad && r) {
            this.scratchcanvas.setCompositeOperation("source-in");
            this.scratchcanvas.drawImage(this.gradients[colorname], 
                                         0, 0, this.gradients[colorname].canvas.width, this.gradients[colorname].canvas.height,
                                         0, 0, this.scratchcanvas.canvas.width, this.scratchcanvas.canvas.height);
            gamecanvas.drawImage(cnv, 0, 0, gamecanvas.canvas.width, gamecanvas.canvas.height);
        }
    }
    this.renderDebug(gamecanvas);
}

CharacterRendererGroups.prototype.getGradient = function(gamecanvas, colorname, color) { 
    
    // todo:
    //
    // - need an attribute to group render calls so gradient canvas doesn't get cleared and drawn as often:
    //  --> draww bg arm and leg --> draw body --> draw fg arm
    //
    // - debuggeru
    //
    
    this.createGradient(gamecanvas, colorname, color);
    this.scratchcanvas.canvas.width = gamecanvas.canvas.width;
    this.scratchcanvas.canvas.height = gamecanvas.canvas.height;
    return this.scratchcanvas;
}


CharacterRendererGroups.prototype.createGradient = function(gamecanvas, colorname, color) { 
    if (this.gradients[colorname]) return;
    var start = color.start;   
    var stop = color.stop;   
    var top = color.top || 0;   
    var size = color.height;   
    var gradientcanvas = new GameCanvas();
    gradientcanvas.canvas.width = 1;
    gradientcanvas.canvas.height = size;
    var g = gradientcanvas.createLinearGradient(0, top, 0, size);
    g.addColorStop(0, start);
    g.addColorStop(1, stop);
    gradientcanvas.setFillStyle(g);
    var rect = new Rectangle(0, 0, 1, size);
    gradientcanvas.beginPath();
    rect.draw(gradientcanvas);
    gradientcanvas.commit();
    this.gradients[colorname] = gradientcanvas;
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