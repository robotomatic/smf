"use strict";

function CharacterRendererGroupsGroup() {
    this.renderer = new CharacterRendererRenderer();
    this.pathclip = new CharacterRendererGroupsGroupPathClip();
    this.pathlink = new CharacterRendererGroupsGroupPathLink();
    this.polygon = new Polygon();
    this.debugoutlinecolor = "darkgray";
}

CharacterRendererGroupsGroup.prototype.renderGroup = function(gamecanvas, groupdef, groupnames, group, color, debugrects, debug) {
    
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

    if (gg.link && gg.link != "skip") {
        if (!this.pathlink.linkpathStart.points.length) {
            var cc = dodebug ? color : gg.color ? gg.color : color;
            this.pathlink.startLinkPath(this.polygon, cc, gg.linktype);
        } else if (gg.link && this.pathlink.linkpathStart.points.length) {
            this.pathlink.addLinkPath(this.polygon);
        }
    } else {
        if (this.pathlink.linkpathStart.points.length && gg.link != "skip") {
            this.pathlink.endLinkPath(gamecanvas, this.pathlink.linkpathType);
            
            if (debug.character) {
                var p = this.pathlink.path;
                gamecanvas.beginPath();
                p.drawOutline(gamecanvas, this.debugoutlinecolor, 1);
            }
            
        }

        gamecanvas.setFillStyle(dodebug ? color : this.renderer.setColor(gg.color ? gg.color : color, this.polygon, gamecanvas));
        gamecanvas.beginPath();

        if (gg.clip) {
            if (gg.clip == "start") {
                this.renderer.drawPolygon(gg.path, this.polygon, gamecanvas);
                this.pathclip.startClipPath(gg.path, this.polygon, gamecanvas);
            } else if (gg.clip == "end") {
                this.renderer.drawPolygon(gg.path, this.polygon, gamecanvas);
                this.pathclip.endClipPath(gg, this.polygon, gamecanvas, color);
            }
        } else this.renderer.drawPolygon(gg.path, this.polygon, gamecanvas);
        
        if (debug.character) {
            gamecanvas.beginPath();
            this.polygon.drawOutline(gamecanvas, this.debugoutlinecolor, 1);
        }
    } 
    
    gamecanvas.commit();
}