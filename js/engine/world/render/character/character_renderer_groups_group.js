"use strict";

function CharacterRendererGroupsGroup() {
    this.renderer = new CharacterRendererRenderer();
    this.polygon = new Polygon();
    this.debugoutlinecolor = "darkgray";
    this.colors = new Array();
}

CharacterRendererGroupsGroup.prototype.renderGroup = function(gamecanvas, character, groupdef, groupnames, group, debugrects, debug) {

    gamecanvas.commit();
    gamecanvas.beginPath();
    
    var points = group.points;
    this.polygon.points.length = 0;
    if (points.length) this.polygon.setPoints(points);

    var rects = group.rects;
    if (debug.guts) {
        var rt = rects.length;
        for (var ri = 0; ri < rt; ri++) {
            var rr = rects[ri];
            var nr = geometryfactory.getRectangle(rr.x, rr.y, rr.width, rr.height);
            debugrects.push(nr);
        }
    }
    
    if (rects && groupdef && groupdef.path) {
        if (groupdef.path == "smooth") this.polygon.filterPoints(rects);
        else if (groupdef.path == "round") this.polygon.filterPoints(rects); 
        else if (groupdef.path == "join") this.polygon.filterPoints(rects); 
        else if (groupdef.path == "chain") this.polygon.filterChain(rects); 
    }

    if (group.angle && (!groupdef || !groupdef.path == "join")) {
        this.polygon.setPoints(this.polygon.rotate(group.angle));
        if (group.parts) this.renderer.rotateGroup(groupnames, group, null);
    }
    if (!this.polygon.points.length) return;
    
    
    
    
    
    

    var gg = groupdef ? groupdef : group;
    if (gg.draw == false) return;
    
    var dodebug = debug.character || debug.guts;

    var color = "white";
    var gcolor = this.getColor(gamecanvas, character, gg.color);
    
    
    
    var linkpath = this.renderer.hasLinkPath();
    if (gg.link && gg.link != "skip") {
        if (!linkpath) {
            var cc = dodebug ? color : gcolor ? gcolor : color;
            this.renderer.startLinkPath(this.polygon, cc, gg.linktype);
        } else if (gg.link && linkpath) {
            this.renderer.addLinkPath(this.polygon);
        }
    } else {
        if (linkpath && gg.link != "skip") {
            this.renderer.endLinkPath(gamecanvas);
            
            if (debug.character) {
                var p = this.pathlink.path;
                gamecanvas.beginPath();
                p.drawOutline(gamecanvas, this.debugoutlinecolor, 1);
            }
            
        }

        gamecanvas.setFillStyle(dodebug ? color : this.renderer.setColor(gcolor ? gcolor : color, this.polygon, gamecanvas));
        gamecanvas.beginPath();

        if (gg.clip) {
            if (gg.clip == "start") {
                this.renderer.drawPolygon(gg.path, this.polygon, gamecanvas);
                this.renderer.startClipPath(gamecanvas);
            } else if (gg.clip == "end") {
                this.renderer.drawPolygon(gg.path, this.polygon, gamecanvas);
                this.renderer.endClipPath(gamecanvas);
            }
        } else this.renderer.drawPolygon(gg.path, this.polygon, gamecanvas);
        
        if (debug.character) {
            gamecanvas.beginPath();
            this.polygon.drawOutline(gamecanvas, this.debugoutlinecolor, 1);
        }
    } 
    
    gamecanvas.commit();
}


CharacterRendererGroupsGroup.prototype.getColor = function(gamecanvas, character, colorname) {
    
    //
    // TODO: ugh.
    //
    
    
    if (this.colors[colorname]) return this.colors[colorname];
    var colors = character.colors;
    if (!colors[colorname]) return "white";
    var cc = colors[colorname];
    if (cc.gradient) {
        var gg = gamecanvas.createLinearGradient(0, 0, gamecanvas.width, gamecanvas.height);
        gg.addColorStop(0, cc.gradient.start);
        gg.addColorStop(1, cc.gradient.stop);
        this.colors[colorname] = gg;
        return gg;
    } else {
        this.colors[colorname] = cc;
        return cc;
    }
}