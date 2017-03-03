"use strict";

function CharacterRendererRenderer() {
    this.rotatepoly = new Polygon();
    this.rotateline = new Line();
}

CharacterRendererRenderer.prototype.drawPolygon = function(path, poly, ctx) { 
    if (path == "smooth") poly.drawSmooth(ctx);
    else if (path == "round") poly.drawRound(ctx, 5);
    else if (path == "chain") poly.drawRound(ctx, 5);
    else poly.draw(ctx);
}

CharacterRendererRenderer.prototype.drawPolygonOutline = function(path, poly, ctx, color, lineweight) { 
    if (path == "smooth") poly.drawOutlineSmooth(ctx, color, lineweight);
    else if (path == "round") poly.drawOutlineRound(ctx, 5, color, lineweight);
    else if (path == "chain") poly.drawOutlineRound(ctx, 5, color, lineweight);
    else poly.drawOutline(ctx, color, lineweight);
}

CharacterRendererRenderer.prototype.setColor = function(color, poly, ctx) { 
    if (color.gradient) {
        var gradient = color.gradient;
        var mbr = poly.getMbr();
        var mbry = mbr.y;
        var mbrh  = mbr.y + mbr.height;
        if (mbry && mbrh) {
            if (gradient.top) mbry = mbry -= gradient.top;
            if (gradient.height) mbrh = mbry + gradient.height;
            var g = ctx.createLinearGradient(0, mbry, 0, mbrh);
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        } else color = color;
    }
    return color;
}

CharacterRendererRenderer.prototype.rotateGroup = function(groupnames, group, parts) {
    if (!parts) parts = group.parts;
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var gg = groupnames[keys[i]];
        if (!gg) continue;
        this.rotatepoly.setPoints(gg.points);
        gg.points = this.rotatepoly.rotate(group.angle, group.center);
        if (gg.center) {
            this.rotateline.start = group.center;
            this.rotateline.end = gg.center;
            this.rotateline = this.rotateline.rotate(group.angle);
            gg.center = this.rotateline.end;
        }
        gg.rects[0] = this.rotatepoly.getMbr();
        if (parts[keys[i]].parts) this.rotateGroup(groupnames, group, parts[keys[i]].parts);
    }
}

