"use strict";

// knots
// bark
// break lines


function ItemMaterialWood() {
}

ItemMaterialWood.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {

    var color = material.color.light;
    var shadow = material.color.dark;
    if (color.gradient) {
        if (material.direction && material.direction == "vertical") {
            var g = ctx.createLinearGradient(0, 0, width, 0);
            g.addColorStop(0, color.gradient.start);
            g.addColorStop(.5, color.gradient.stop);
            g.addColorStop(1, color.gradient.start);
        } else {
            var g = ctx.createLinearGradient(0, 0, 0, height);
            g.addColorStop(0, color.gradient.start);
            g.addColorStop(1, color.gradient.stop);
        }
        color = g;
    }
    ctx.fillStyle = color;
    
    if (material.craziness) polygon.craziness(material.craziness);
    ctx.beginPath();
    
    polygon.draw(ctx);
    
    ctx.globalCompositeOperation = 'source-atop';
    this.drawLines(ctx, material, x, y, width, height, scale);
    ctx.globalCompositeOperation = 'source-over';
}

ItemMaterialWood.prototype.drawLines = function(ctx, material, x, y, width, height, scale) {
    var color = material.color.dark;
    var sectionsize = material.sectionwidth * scale;
    var lw = material.linewidth * scale; 
    this.drawLineDirection(ctx, material, x, y, width, height, scale, sectionsize, color, lw);
}

ItemMaterialWood.prototype.drawLineDirection = function(ctx, material, x, y, width, height, scale, sectionsize, color, lw) {
    if (material.direction && material.direction == "vertical") this.drawLineVertical(ctx, material, x, y, width, height, scale, sectionsize, color, lw);
    else this.drawLineHorizontal(ctx, material, x, y, width, height, scale, sectionsize, color, lw);
}

ItemMaterialWood.prototype.drawLineVertical = function(ctx, material, x, y, width, height, scale, sectionwidth, color, lw) {
    var h = height;
    var sections = width / sectionwidth;
    for (var i = 0; i < sections; i++) {
        var ix = x + sectionwidth * (i + 1);
        var iy = y;
        var start = new Point(ix, iy);
        var end = new Point(ix, iy + h);
        var l = new Line(start, end);
        ctx.beginPath();
        l.draw(ctx, color, lw);
    }
}

ItemMaterialWood.prototype.drawLineHorizontal = function(ctx, material, x, y, width, height, scale, sectionheight, color, lw) {
    var w = width;
    var sections = height / sectionheight;
    for (var i = 0; i < sections; i++) {
        var ix = x;
        var iy = y + sectionheight * (i + 1);
        var start = new Point(ix, iy);
        var end = new Point(ix + w, iy);
        var l = new Line(start, end);
        ctx.beginPath();
        l.draw(ctx, color, lw);
    }
}


