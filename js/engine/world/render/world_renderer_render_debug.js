"use strict";

function WorldRendererDebug(worldrenderer) {
    this.worldrenderer = worldrenderer;
    this.point = new Point();
}

WorldRendererDebug.prototype.renderDebug = function(now, mbr, window, graphics, camera, world, debug) {
    if (debug.level.render) this.renderDebugItems(graphics.graphics["main"], camera, mbr, window, debug);
    if (debug.collision.level) this.renderDebugCollisionLevel(graphics.graphics["main"], camera, mbr, window, world, debug);
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
    if (item.item.draw === false) return;
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





WorldRendererDebug.prototype.renderDebugCollisionLevel = function(graphics, camera, mbr, window, world, debug) {
    
    var points = world.worldcollider.collisionindex.points;
    if (!points) return;
    window = mbr;
    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale || 0;
    var wc = window.getCenter();

    var hbounds = world.bounds.height; 
    var tbounds = 0;
    
    var keys = Object.keys(points);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var ppp = points[k];
        var tt = ppp.top.length;
        for (var ii = 0; ii < tt; ii++) {
            var pnt = ppp.top[ii];
            if (i == 0 && ii == 0) tbounds = pnt.y;
            
            var top = pnt.y - tbounds;
            var pheight = hbounds - tbounds;
            var percent = (top / pheight);
            var r = clamp(255 * percent);
            var g = 0;
            var b = 0;
            var color = "rgb(" + r + ", " + g + ", " + b + ")";
            
            this.renderDebugCollisionLevelPoint(graphics, x, y, z, scale, wc, pnt, color, 1);
        }
    }
    
    
    var players = world.players.players;
    for (var ii = 0; ii < players.length; ii++) {
        var player = players[ii];
        var collisions = player.collider.index;
        var keys = Object.keys(collisions);
        for (var iii = 0; iii < keys.length; iii++) {
            var ppp = points[keys[iii]];
            var tttt = ppp.top.length;
            for (var iiii = 0; iiii < tttt; iiii++) {
                var pnt = ppp.top[iiii];
                this.renderDebugCollisionLevelPoint(graphics, x, y, z, scale, wc, pnt, "yellow", 3);
            }
            var tttt = ppp.bottom.length;
            for (var iiii = 0; iiii < tttt; iiii++) {
                var pnt = ppp.bottom[iiii];
                this.renderDebugCollisionLevelPoint(graphics, x, y, z, scale, wc, pnt, "yellow", 3);
            }
        }
    }
    
    
}

WorldRendererDebug.prototype.renderDebugCollisionLevelPoint = function(graphics, x, y, z, scale, wc, point, color, size) {

    var px = (point.x - x) * scale;
    var py = (point.y - y) * scale;
    var pz = (point.z - z) * scale;
    var ppp = new Point(px, py);

    if (pz < -(__fov - 1)) {
        var nz = __fov - 1;
        pz = -nz;
    }

    var np = new Point(0, 0, 0);
    np = projectPoint3D(ppp, pz, scale, x, y, wc, np);
    var s = 2 * scale;
    if (s < 2) s = 2;
    if (s > 4) s = 4;
    s *= size;

    graphics.canvas.commit();
    graphics.canvas.beginPath();
    
    graphics.canvas.setFillStyle(color);

    np.draw(graphics.canvas, s);
    graphics.canvas.commit();
}
