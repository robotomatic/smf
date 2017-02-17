"use strict";

function StageRendererDebug(renderitems) {
    this.renderitems = renderitems;
    this.line = new Line(new Point(0, 0), new Point(0, 0));
    
    this.temp = {
        canvas : null,
        ctx : null
    };
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.polygon = new Polygon();
}

StageRendererDebug.prototype.renderDebug = function(now, graphics, camera, stage, mbr, window, debug) {
    var g = graphics["main"];
    if (debug.render) this.renderDebugItems(g, mbr, window);
    if (debug.overdraw) this.renderDebugItemsOverlap(g);    
}

StageRendererDebug.prototype.renderDebugItems = function(graphics, mbr, window) {
    for (var i = 0; i < this.renderitems.all.length; i++) this.renderDebugItemsItem(graphics, this.renderitems.all[i], mbr, window);
}

StageRendererDebug.prototype.renderDebugItemsItem = function(graphics, item, mbr, window) {
    
    if (item.item.width == "100%") return;
    if (item.type == "player") return;
    
    this.renderDebugItemsItemBox(graphics, item);
    this.renderDebugItemsItemCenter(graphics, window, mbr);
    this.renderDebugItemsItemText(graphics, item);
    this.renderDebugItemsItemGeometry(graphics, item);
}

StageRendererDebug.prototype.renderDebugItemsItemCenter = function(graphics, window, mbr) {
//    var mbrxw = ((mbr.x + (mbr.width / 2)) - mbr.x) * mbr.scale;
//    var mbryh = ((mbr.y + (mbr.height / 2)) - mbr.y) * mbr.scale;
    
    var cp = window.getCenter();
    var mbrxw = cp.x;
    var mbryh = cp.y + 20; 
    
    var p = 5;
    var c = new Circle(mbrxw - p, mbryh - p, p * 2);
    graphics.ctx.fillStyle = "cyan";
    graphics.ctx.beginPath();
    c.draw(graphics.ctx);
}


StageRendererDebug.prototype.renderDebugItemsItemBox = function(graphics, item) {
    var box = item.box;
    if (!box) return;
    box.drawOutline(graphics.ctx, "white", 1);
}

StageRendererDebug.prototype.renderDebugItemsItemText = function(graphics, item) {
    var message = "D: " + round(item.distance);
    var tx = item.box.x + 5;
    
//    if (tx < 0) tx = 100;
    
    var ty = item.box.y + 10;
    var t = new Text(tx, ty, message);
    graphics.ctx.fillStyle = "white";
    graphics.ctx.beginPath();
    t.draw(graphics.ctx, 9);
}

StageRendererDebug.prototype.renderDebugItemsItemGeometry = function(graphics, item) {
    var geom = item.geometry;
    if (!geom) return;
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.sides, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.bottoms, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.tops, "white");
    
    graphics.ctx.beginPath();
    geom.projected.drawOutline(graphics.ctx, "white", 1);
}

StageRendererDebug.prototype.renderDebugItemsItemGeometryGeometry = function(graphics, geometry, color) {
    if (!geometry || !geometry.length) return;
    for (var i = 0; i < geometry.length; i++) {
        var geom = geometry[i];
        graphics.ctx.beginPath();
        geom.drawOutline(graphics.ctx, color, .2);
    }
}