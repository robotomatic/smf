"use strict";

function WorldRendererDebug(worldrenderer) {
    this.worldrenderer = worldrenderer;
}

WorldRendererDebug.prototype.renderDebug = function(now, mbr, window, graphics, camera, world, debug) {
    if (debug.level.render) this.renderDebugItems(graphics.graphics["main"], camera, mbr, window, debug);
}

WorldRendererDebug.prototype.renderDebugItems = function(graphics, camera, mbr, window, debug) {
    graphics.canvas.beginPath();
    for (var i = 0; i < this.worldrenderer.renderitems.all.length; i++) {
        this.renderDebugItemsItem(graphics, camera, this.worldrenderer.renderitems.all[i], mbr, window, debug);
    }
    graphics.canvas.stroke();
    graphics.canvas.commit();
}

WorldRendererDebug.prototype.renderDebugItemsItem = function(graphics, camera, item, mbr, window, debug) {
    if (!item.showing) return;
    if (item.item.width == "100%") return;
    if (item.type == "player") return;
    if (item.item.isHidden()) return;
    this.renderDebugItemsItemGeometry(graphics, item.item, mbr.scale, debug);
}

WorldRendererDebug.prototype.renderDebugItemsItemGeometry = function(graphics, item, scale, debug) {
    var geom = item.geometry;
    if (!geom) return;
    var color = debug.level.level ? "black" : "white";
    graphics.canvas.setStrokeStyle(color);
    var lw = debug.level.level ? .1 : 1;
    graphics.canvas.setLineWidth(lw * scale);
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.left);
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.right);
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.bottom);
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.top);
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.front);
}

WorldRendererDebug.prototype.renderDebugItemsItemGeometryGeometry = function(graphics, geometry) {
    if (!geometry.geometry || !geometry.showing) return;
    geometry.geometry.path(graphics.canvas);
}