"use strict";

function StageRendererDebug(renderitems) {
    this.renderitems = renderitems;
}

StageRendererDebug.prototype.renderDebug = function(now, graphics, stage, mbr, window) {
    var g = graphics["main"];
//    this.renderDebugItems(now, g, this.renderitems.above.all, "red");
    this.renderDebugItems(now, g, this.renderitems.center.z, "white");
//    this.renderDebugItems(now, g, this.renderitems.below.all, "blue");
}

StageRendererDebug.prototype.renderDebugItems = function(now, g, items, color) {
    var keys = Object.keys(items);
    for (var i = 0; i < keys.length; i++) this.renderDebugItemsSide(now, g, items[keys[i]].x, color);
}

StageRendererDebug.prototype.renderDebugItemsSide = function(now, g, item, color) {
    this.renderDebugItemsSideItem(now, g, item.left, "red");
    this.renderDebugItemsSideItem(now, g, item.center, "white");
    this.renderDebugItemsSideItem(now, g, item.right, "blue");
}

StageRendererDebug.prototype.renderDebugItemsSideItem = function(now, g, items, color) {
    var keys = Object.keys(items);
    for (var i = 0; i < keys.length; i++) this.renderDebugItem(now, g, items[keys[i]], color);
}

StageRendererDebug.prototype.renderDebugItem = function(now, g, item, color) {
    g.ctx.beginPath();
    var b = item.box;
    b.drawOutline(g.ctx, color, 2);
}

StageRendererDebug.prototype.renderCenterLines = function(graphics, window) {
    var cp = window.getCenter();
    var g = graphics["main"];
    this.line.start.x = 0;
    this.line.start.y = cp.y;
    this.line.end.x = window.width;
    this.line.end.y = cp.y;
    var ctx = g.ctx;
    ctx.beginPath();
    this.line.draw(ctx, "red", 2);
    this.line.start.x = cp.x;
    this.line.start.y = 0;
    this.line.end.x = cp.x;
    this.line.end.y = window.height;
    ctx.beginPath();
    this.line.draw(ctx, "red", 2);
}
