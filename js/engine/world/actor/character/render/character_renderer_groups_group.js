"use strict";

function CharacterRendererGroupsGroup() {
    this.renderer = new CharacterRendererRenderer();
    this.pathclip = new CharacterRendererGroupsGroupPathClip();
    this.pathlink = new CharacterRendererGroupsGroupPathLink();
    this.polygon = new Polygon();
}

CharacterRendererGroupsGroup.prototype.renderGroup = function(ctx, groupdef, groupnames, group, color, debugrects) {
    
    var points = group.points;
    var rects = group.rects;
    this.polygon.points.length = 0;
    if (points.length) this.polygon.setPoints(points);

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

    if (gg.link && gg.link != "skip") {
        if (!this.pathlink.linkpathStart.points.length) {
            this.pathlink.startLinkPath(this.polygon, gg.color ? gg.color : color, gg.linktype);
        } else if (gg.link && this.pathlink.linkpathStart.points.length) {
            this.pathlink.addLinkPath(this.polygon);
        }
    } else {
        if (this.pathlink.linkpathStart.points.length && gg.link != "skip") {
            this.pathlink.endLinkPath(ctx, this.pathlink.linkpathType);
        }

        ctx.fillStyle = this.renderer.setColor(gg.color ? gg.color : color, this.polygon, ctx);;
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
    } 

    if (group.debug) debugrects.push(rects);
}