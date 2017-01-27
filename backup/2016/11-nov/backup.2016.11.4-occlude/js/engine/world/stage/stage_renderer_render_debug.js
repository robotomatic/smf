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

StageRendererDebug.prototype.renderDebug = function(now, graphics, stage, mbr, window, debug) {
    var g = graphics["main"];
    if (debug.render) this.renderDebugItems(g);
    if (debug.overdraw) this.renderDebugItemsOverlap(g);    
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





StageRendererDebug.prototype.renderDebugItems = function(graphics) {
    for (var i = 0; i < this.renderitems.all.length; i++) this.renderDebugItemsItem(graphics, this.renderitems.all[i]);
}

StageRendererDebug.prototype.renderDebugItemsItem = function(graphics, item) {
    
    if (item.item.width == "100%") return;
    if (item.type == "player") return;
    
    this.renderDebugItemsItemBox(graphics, item);
    this.renderDebugItemsItemGeometry(graphics, item);
}

StageRendererDebug.prototype.renderDebugItemsItemBox = function(graphics, item) {
    var box = item.box;
    if (!box) return;
    box.drawOutline(graphics.ctx, "white", 1);
}

StageRendererDebug.prototype.renderDebugItemsItemGeometry = function(graphics, item) {
    var geom = item.geometry;
    if (!geom) return;
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.sides, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.bottoms, "white");
    this.renderDebugItemsItemGeometryGeometry(graphics, geom.tops, "white");
}

StageRendererDebug.prototype.renderDebugItemsItemGeometryGeometry = function(graphics, geometry, color) {
    if (!geometry || !geometry.length) return;
    for (var i = 0; i < geometry.length; i++) {
        var geom = geometry[i];
        graphics.ctx.beginPath();
        geom.drawOutline(graphics.ctx, color, 1);
    }
}





















StageRendererDebug.prototype.renderDebugItemsOverlap = function(graphics) {

    var m = {
        front_top : 0,
        front_front : 0,
        front_bottom : 0,
        side_top : 0,
        side_side : 0,
        side_bottom : 0,
        items : 0
    };

    var c = {
        front_top : "yellow",
        front_front : "green",
        front_bottom : "magenta",
        side_top : "red",
        side_side : "blue",
        side_bottom : "purple",
        items : "black"
    };

    m.front_top = this.renderitems.overlap.front_top.length;
    if (document.getElementById("dev-render-occlude-label-front-top-debug").checked) {
        for (var i = 0; i < m.front_top; i++) this.renderDebugItemsOverlapOverlapItem(graphics, this.renderitems.overlap.front_top[i], c.front_top);
    }
    
    m.front_front = this.renderitems.overlap.front_front.length;
    if (document.getElementById("dev-render-occlude-label-front-front-debug").checked) {
        for (var i = 0; i < m.front_front; i++) this.renderDebugItemsOverlapOverlapItem(graphics, this.renderitems.overlap.front_front[i], c.front_front);
    }
    
    m.front_bottom = this.renderitems.overlap.front_bottom.length;
    if (document.getElementById("dev-render-occlude-label-front-bottom-debug").checked) {
        for (var i = 0; i < m.front_bottom; i++) this.renderDebugItemsOverlapOverlapItem(graphics, this.renderitems.overlap.front_bottom[i], c.front_bottom);
    }
    
    m.side_top = this.renderitems.overlap.side_top.length;
    if (document.getElementById("dev-render-occlude-label-side-top-debug").checked) {
        for (var i = 0; i < m.side_top; i++) this.renderDebugItemsOverlapOverlapItem(graphics, this.renderitems.overlap.side_top[i], c.side_top);
    }

    m.side_side = this.renderitems.overlap.side_side.length;
    if (document.getElementById("dev-render-occlude-label-side-side-debug").checked) {
        for (var i = 0; i < m.side_side; i++) this.renderDebugItemsOverlapOverlapItem(graphics, this.renderitems.overlap.side_side[i], c.side_side);
    }

    m.side_bottom = this.renderitems.overlap.side_bottom.length;
    if (document.getElementById("dev-render-occlude-label-side-bottom-debug").checked) {
        for (var i = 0; i < m.side_bottom; i++) this.renderDebugItemsOverlapOverlapItem(graphics, this.renderitems.overlap.side_bottom[i], c.side_bottom);
    }

    var keys = Object.keys(this.renderitems.overlap.items);
    m.items = keys.length;
    if (document.getElementById("dev-render-occlude-label-items-debug").checked) {
        for (var i = 0; i < m.items; i++) this.renderDebugItemsOverlapItem(graphics, this.renderitems.overlap.items[keys[i]], c.items);
    }
    
    devLogRenderOcclusions(m, c);
}

StageRendererDebug.prototype.renderDebugItemsOverlapOverlapItem = function(graphics, item, color) {
   var ctx = graphics.ctx;
    var point = item.point;
    ctx.beginPath();
    ctx.fillStyle = color;
    point.draw(ctx, 5);
}

StageRendererDebug.prototype.renderDebugItemsOverlapItem = function(graphics, item, color) {
    var ctx = graphics.ctx;
    var keys = Object.keys(item.item.geometry);
    for (var i = 0; i < keys.length; i++) {
        var g = item.item.geometry[keys[i]];
        for (var ii = 0; ii < g.length; ii++) {
            ctx.beginPath();
            g[ii].drawOutline(ctx, color, 1);
        }
    }
}
