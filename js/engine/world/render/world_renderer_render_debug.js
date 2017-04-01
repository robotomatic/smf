"use strict";

function WorldRendererDebug(renderitems) {
    this.renderitems = renderitems;
    this.line = new Line(new Point(0, 0), new Point(0, 0));
    
    this.temp = {
        canvas : null,
        ctx : null
    };
    
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.polygon = new Polygon();
}

WorldRendererDebug.prototype.renderDebug = function(now, mbr, window, graphics, camera, world, debug) {
    if (debug.level.render) this.renderDebugItems(graphics, mbr, window);
}

WorldRendererDebug.prototype.renderDebugItems = function(graphics, mbr, window) {
    for (var i = 0; i < this.renderitems.all.length; i++) this.renderDebugItemsItem(graphics, this.renderitems.all[i], mbr, window);
}

WorldRendererDebug.prototype.renderDebugItemsItem = function(graphics, item, mbr, window) {
    
    if (item.item.width == "100%") return;
    if (item.type == "player") return;
    
//    this.renderDebugItemsItemBox(graphics, item);
//    this.renderDebugItemsItemCenter(graphics, window, mbr);
//    this.renderDebugItemsItemText(graphics, item);
    
    this.renderDebugItemsItemGeometry(graphics, item);
    graphics.canvas.commit();
}

WorldRendererDebug.prototype.renderDebugItemsItemCenter = function(graphics, window, mbr) {
//    var mbrxw = ((mbr.x + (mbr.width / 2)) - mbr.x) * mbr.scale;
//    var mbryh = ((mbr.y + (mbr.height / 2)) - mbr.y) * mbr.scale;
//    
//    var cp = window.getCenter();
//    var mbrxw = cp.x;
//    var mbryh = cp.y + 20; 
//    
//    var p = 5;
//    var c = geometryfactory.getCircle(mbrxw - p, mbryh - p, p * 2);
//    graphics.canvas.setFillStyle("cyan");
//    graphics.canvas.beginPath();
//    c.draw(graphics.canvas);
}


WorldRendererDebug.prototype.renderDebugItemsItemBox = function(graphics, item) {
//    var box = item.box;
//    if (!box) return;
//    box.drawOutline(graphics.canvas, "white", 1);
}

WorldRendererDebug.prototype.renderDebugItemsItemText = function(graphics, item) {
//    var message = "D: " + round(item.distance);
//    var tx = item.box.x + 5;
//    
////    if (tx < 0) tx = 100;
//    
//    var ty = item.box.y + 10;
//    var t = geometryfactory.getText(tx, ty, message);
//    graphics.canvas.setFillStyle("white");
//    graphics.canvas.beginPath();
//    t.draw(graphics.canvas, 9);
}

WorldRendererDebug.prototype.renderDebugItemsItemGeometry = function(graphics, item) {
    var geom = item.geometry;
    if (!geom) return;
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.left.geometry, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.right.geometry, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.bottom.geometry, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.top.geometry, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.front.geometry, "white");
}

WorldRendererDebug.prototype.renderDebugItemsItemGeometryGeometry = function(graphics, geometry, color) {
    if (!geometry) return;
    graphics.canvas.beginPath();
    geometry.drawOutline(graphics.canvas, color, .5);
    graphics.canvas.commit();
}