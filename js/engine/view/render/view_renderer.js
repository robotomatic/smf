"use strict";

function ViewRenderer() {
    this.debug = false;
    this.mbr = geometryfactory.getRectangle(0, 0, 0, 0);
    this.window = geometryfactory.getRectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
}

ViewRenderer.prototype.update = function(now, world, view) {
}

ViewRenderer.prototype.render = function(now, world, width, height, graphics, render, follow, paused) {
    this.mbr = this.camera.getView(now, this.mbr, width, height, follow, paused);
    this.window.x = 0;
    this.window.y = 0;
    this.window.z = 0;
    this.window.width = width;
    this.window.height = height;
    this.window.depth = 1;
    this.window.scale = this.mbr.scale;
    world.render(now, graphics, this.camera, this.mbr, this.window, render);
}