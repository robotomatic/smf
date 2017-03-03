"use strict";

function CharacterRendererGroupsGroupPathLink() {
    this.path = new Polygon();
    this.linkpathStart = new Polygon();
    this.linkpathType = "";
    this.linkpathEnd = new Polygon();
    this.linkpathColor = "";
}

CharacterRendererGroupsGroupPathLink.prototype.startLinkPath = function(poly, color, linktype) { 
    if (!this.linkpathStart.points.length) {
        this.linkpathStart.points.length = 0;
        this.linkpathEnd.points.length = 0;
        this.linkpathColor = color;
        this.linkpathType = (linktype) ? linktype : "";
    }
    this.addLinkPath(poly);
}
    
CharacterRendererGroupsGroupPathLink.prototype.addLinkPath = function(poly) { 
    if (this.linkpathStart.points.length > 1) {
        var spps = this.linkpathStart.points[this.linkpathStart.points.length - 2];
        var sppe = this.linkpathStart.points[this.linkpathStart.points.length -1];
        var cs = getLineIntersection(spps.x, spps.y, sppe.x, sppe.y, poly.points[1].x, poly.points[1].y, poly.points[2].x, poly.points[2].y);
        if (cs.onLine1 && cs.onLine2) this.linkpathStart.points[this.linkpathStart.points.length - 1] = geometryfactory.getPoint(cs.x, cs.y);
        else this.linkpathStart.addPoint(poly.points[1]);
        var epps = this.linkpathEnd.points[this.linkpathEnd.points.length - 2];
        var eppe = this.linkpathEnd.points[this.linkpathEnd.points.length -1];
        var ce = getLineIntersection(epps.x, epps.y, eppe.x, eppe.y, poly.points[0].x, poly.points[0].y, poly.points[3].x, poly.points[3].y);
        if (ce.onLine1 && ce.onLine2) this.linkpathEnd.points[this.linkpathEnd.points.length - 1] = geometryfactory.getPoint(ce.x, ce.y);
        else this.linkpathEnd.addPoint(poly.points[0]);
    } else {
        this.linkpathStart.addPoint(poly.points[1]);
        this.linkpathEnd.addPoint(poly.points[0]);
    }
    this.linkpathStart.addPoint(poly.points[2]);
    this.linkpathEnd.addPoint(poly.points[3]);
}
    
CharacterRendererGroupsGroupPathLink.prototype.endLinkPath = function(ctx, linktype) { 
    this.path.points.length = 0;
    for (var i = 0; i < this.linkpathStart.points.length; i++) this.path.addPoint(this.linkpathStart.points[i]);
    for (var i = this.linkpathEnd.points.length; i > 0 ; i--) this.path.addPoint(this.linkpathEnd.points[i - 1]);
    
    ctx.beginPath();
    ctx.fillStyle = this.linkpathColor;
    if (linktype === "join") this.path.draw(ctx);
    else this.path.drawSmooth(ctx);
    
    this.linkpathStart.points.length = 0;
    this.linkpathEnd.points.length = 0;
    this.linkpathColor = "";
}
