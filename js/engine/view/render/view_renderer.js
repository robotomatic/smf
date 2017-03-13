"use strict";

function ViewRenderer() {
    this.debug = false;
    this.mbr = geometryfactory.getRectangle(0, 0, 0, 0);
    this.window = geometryfactory.getRectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
}

ViewRenderer.prototype.update = function(now, world, view) {
}

ViewRenderer.prototype.render = function(now, world, view, graphics) {
    this.mbr = this.camera.getView(now, this.mbr, view.canvas.width, view.canvas.height);
    this.window.x = 0;
    this.window.y = 0;
    this.window.z = 0;
    this.window.width = view.canvas.width;
    this.window.height = view.canvas.height;
    this.window.depth = 1;
    this.window.scale = this.mbr.scale;
    world.render(now, graphics["view"], this.camera, this.mbr, this.window);
}