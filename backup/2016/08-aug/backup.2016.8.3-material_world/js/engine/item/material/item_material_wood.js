"use strict";

// knots
// bark
// break lines


function ItemMaterialWood() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
}

ItemMaterialWood.prototype.draw = function(ctx, color, material, item, polygon, window, x, y, width, height, titem, scale) {

    this.canvas.width = width;
    this.canvas.height = height;
    
    var color = material.color.light;
    var shadow = material.color.dark;
    if (color.gradient) {
        if (material.direction && material.direction == "vertical") {
            var g = this.ctx.createLinearGradient(0, 0, width, 0);
            g.addColorStop(0, color.gradient.start);
            g.addColorStop(.5, color.gradient.stop);
            g.addColorStop(1, color.gradient.start);
        } else {
            var g = this.ctx.createLinearGradient(0, 0, 0, height);
            g.addColorStop(0, color.gradient.start);
            g.addColorStop(1, color.gradient.stop);
        }
        color = g;
    }
    this.ctx.fillStyle = color;
    
    polygon.translate(-x, -y);
    this.ctx.beginPath();
    polygon.draw(this.ctx);
    
    this.ctx.globalCompositeOperation = 'source-atop';
    this.drawLines(this.ctx, material, width, height, scale);
    this.ctx.globalCompositeOperation = 'source-over';
    
    var img = new Image(this.canvas, 0, 0, width, height);
    img.draw(ctx, x, y, width, height);
}

ItemMaterialWood.prototype.drawLines = function(ctx, material, width, height, scale) {
    var sections = material.sectionwidth + 1;
    var color = material.color.dark;
    var lw = material.linewidth * scale    
    for (var i = 0; i < sections; i++) this.drawLine(ctx, material, width, height, scale, sections, i, color, lw);
}

ItemMaterialWood.prototype.drawLine = function(ctx, material, width, height, scale, sections, index, color, lw) {
    if (material.direction && material.direction == "vertical") this.drawLineVertical(ctx, material, width, height, scale, sections, index, color, lw);
    else this.drawLineHorizontal(ctx, material, width, height, scale, sections, index, color. lw);
}

ItemMaterialWood.prototype.drawLineVertical = function(ctx, material, width, height, scale, sections, index, color, lw) {
    var section = width / sections;
    var x = (section * (index + 1)) * scale;
    var y = 0;
    var h = height * scale;
    var start = new Point(x, y);
    var end = new Point(x, y + h);
    var l = new Line(start, end);
    ctx.beginPath();
    l.draw(ctx, color, lw);
}

ItemMaterialWood.prototype.drawLineHorizontal = function(ctx, material, width, height, scale, sections, index, color, lw) {
    var section = height / sections;
    var x = 0;
    var y = (section * (index + 1)) * scale;
    var w = width * scale;
    var start = new Point(x, y);
    var end = new Point(x + w, y);
    var l = new Line(start, end);
    ctx.beginPath();
    l.draw(ctx, color, lw);
}


