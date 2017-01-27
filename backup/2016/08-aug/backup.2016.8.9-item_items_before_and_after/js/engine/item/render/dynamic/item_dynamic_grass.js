"use strict";

function ItemDynamicGrass() { 
    
    this.grass = Array();
    
    this.bladewidth = 5;
    this.rectangle = new Rectangle(0, 0, 0, 0);
}

ItemDynamicGrass.prototype.draw = function(ctx, color, item, window, x, y, width, height, titem, scale, name) {
    this.drawGrass(ctx, item, x, y, width, height, scale, titem, name);
}

ItemDynamicGrass.prototype.drawGrass = function(ctx, item, x, y, width, height, scale, titem, name) {

    var id = item.id;
    if (!id) {
        id = item.x + "_" + item.y + "_" + item.width + "_" + item.height + "_" + name;
        item.id = id;
    }

    if (this.grass[id]) {
        this.renderGrass(ctx, id, item.x, item.y, item.width, item.height);
        return;
    }
    
    var canvas = document.createElement('canvas');
    canvas.width = item.width;
    canvas.height = item.height;
    var grassctx = canvas.getContext("2d");
    
    var lean = titem.renderer.lean;
    
    var color = titem.renderer.color.light;
    grassctx.fillStyle = color;

    var gx = 0;
    var gy = 0;
    var gw = item.width;
    var gh = item.height;
    var bw = this.bladewidth;
    var numblades = gw / bw;
    for (var i = 0; i < numblades; i++) this.drawGrassBlade(grassctx, lean, gx, gy, gh, bw, i);
    
    this.grass[id] = {
        canvas : canvas,
        ctx : grassctx,
        id : id
    };
    
    this.renderGrass(ctx, id, item.x, item.y, item.width, item.height);
}

ItemDynamicGrass.prototype.drawGrassBlade = function(ctx, lean, bladex, bladey, bladeheight, bladewidth, index) {
    this.rectangle.width = bladewidth;
    this.rectangle.x = bladex + (bladewidth * index);   
    this.rectangle.y = bladey + bladeheight;
    var height = round(random(bladeheight / 2, bladeheight));
    this.rectangle.height = height;
    this.rectangle.y -= height;
    ctx.beginPath();
    this.rectangle.draw(ctx);
}


ItemDynamicGrass.prototype.renderGrass = function(ctx, id, x, y, width, height) {
    var cg = this.grass[id];
    ctx.drawImage(cg.canvas, x, y, width, height);
}