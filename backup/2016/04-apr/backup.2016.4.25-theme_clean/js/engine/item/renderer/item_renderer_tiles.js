"use strict";

function ItemRendererTiles() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.patterns = new Array();
    this.managerrenderer = new ItemRenderManagerRenderer();
}

ItemRendererTiles.prototype.drawTiles = function(ctx, color, item, x, y, width, height, scale, titem) {
    if (this.patterns[titem.name]) {
        this.drawPattern(this.patterns[titem.name], ctx, item, x, y, width, height, scale);
        return;
    }
    var pw = titem.tilewidth * scale;
    var ph = titem.tileheight * scale;
    this.canvas.width = pw;
    this.canvas.height = ph;
    this.managerrenderer.drawItemTheme(this.ctx, color, item, 0, 0, pw, ph, scale, titem)    
    var newpat = ctx.createPattern(this.canvas, "repeat");
    this.patterns[titem.name] = newpat;    
    this.drawPattern(this.patterns[titem.name], ctx, item, x, y, width, height, scale);
}


ItemRendererTiles.prototype.drawPattern = function(pattern, ctx, item, x, y, width, height, scale) {
    ctx.fillStyle = pattern;
    drawShape(ctx, item, x, y, width, height, scale);        
}