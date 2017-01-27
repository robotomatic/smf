"use strict";

function StageRendererEnd(renderitems) {
    this.renderitems = renderitems;
}

StageRendererEnd.prototype.renderEnd = function(graphics, mbr) {
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        if (g.blur) blurCanvas(g.canvas, g.ctx, g.blur);
    }
}