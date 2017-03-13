"use strict";

function Item3D(item) {
    
    this.item = item;
    
    this.line = new Line(new Point(0, 0), new Point(0, 0));
    this.polygon = new Polygon();

    this.left = false;
    this.right = false;
    
    this.dopoly = false;
    
    this.creator = new Item3DCreator(this);
    this.renderer = new Item3DRenderer(this);
    
}

Item3D.prototype.createItem3D = function(now, renderer, ctx, scale) {
    this.creator.createItem3D(now, renderer, ctx, scale)
}

Item3D.prototype.renderItem3D = function(now, renderer, ctx, scale, debug) {
    this.renderer.renderItem3D(now, renderer, ctx, scale, debug)
}
