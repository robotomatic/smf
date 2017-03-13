"use strict";

function CharacterRendererGroupsGroup() {
    this.renderer = new CharacterRendererRenderer();
    this.pathclip = new CharacterRendererGroupsGroupPathClip();
    this.pathlink = new CharacterRendererGroupsGroupPathLink();
    this.polygon = new Polygon();
    this.debugoutlinecolor = "darkgray";
}

CharacterRendererGroupsGroup.prototype.renderGroup = function(ctx, groupdef, groupnames, group, color, debugrects, debug) {
    
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
            this.pathlink.endLinkPath(ctx, this.pathlink.linkpathType);
            
            if (debug.character) {
                var p = this.pathlink.path;
                ctx.beginPath();
                p.drawOutline(ctx, this.debugoutlinecolor, 1);
            }
            
        }

        ctx.fillStyle = dodebug ? color : this.renderer.setColor(gg.color ? gg.color : color, this.polygon, ctx);
        ctx.beginPath();

        if (gg.clip) {
            if (gg.clip == "start") {
                this.renderer.drawPolygon(gg.path, this.polygon, ctx);
                this.pathclip.startClipPath(gg.path, this.polygon, ctx);
            } else if (gg.clip == "end") {
                this.renderer.drawPolygon(gg.path, this.polygon, ctx);
                this.pathclip.endClipPath(gg, this.polygon, ctx, color);
            }
        } else this.renderer.drawPolygon(gg.path, this.polygon, ctx);
        
        if (debug.character) {
            ctx.beginPath();
            this.polygon.drawOutline(ctx, this.debugoutlinecolor, 1);
        }
    } 

}