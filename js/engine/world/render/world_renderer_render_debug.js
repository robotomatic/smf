"use strict";

function WorldRendererDebug(worldrenderer) {
    this.worldrenderer = worldrenderer;
    this.point = new Point();
}

WorldRendererDebug.prototype.renderDebug = function(now, mbr, window, graphics, camera, world, debug) {
    if (debug.level.render) this.renderDebugItems(graphics.graphics["main"], camera, mbr, window, debug);
    if (debug.collision) this.renderDebugCollisionLevel(graphics.graphics["main"], camera, mbr, window, world, debug);
    if (debug.waterline) this.renderDebugWaterline(graphics.graphics["main"], camera, mbr, window, world, debug);
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
    if (item.type == "particle") return;
    if (item.item.isHidden()) return;
    if (item.item.draw === false && !item.item.bounds) return;
    this.renderDebugItemsItemGeometry(graphics, item.item, mbr.scale, debug);
}

WorldRendererDebug.prototype.renderDebugItemsItemGeometry = function(graphics, item, scale, debug) {
    var geom = item.geometry;
    if (!geom) return;
    var color = debug.level.level ? "black" : item.bounds ? "black" : "white";
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
            
            graphics.canvas.beginPath();
            graphics.canvas.setFillStyle(color);
            this.renderDebugPoint3D(graphics, x, y, z, scale, wc, pnt, 1);
            graphics.canvas.fill();
            graphics.canvas.commit();
        }
    }
    
    graphics.canvas.setFillStyle("yellow");
    graphics.canvas.beginPath();
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
                this.renderDebugPoint3D(graphics, x, y, z, scale, wc, pnt, 3);
            }
            var tttt = ppp.bottom.length;
            for (var iiii = 0; iiii < tttt; iiii++) {
                var pnt = ppp.bottom[iiii];
                this.renderDebugPoint3D(graphics, x, y, z, scale, wc, pnt, 3);
            }
        }
    }
    graphics.canvas.fill();
    graphics.canvas.commit();
}







WorldRendererDebug.prototype.renderDebugWaterline = function(graphics, camera, mbr, window, world, debug) {
    if (!world.worldrenderer.render.world) return;
    if (!world.waterline || !world.waterline.surface.size) return;
    var points = world.waterline.surface.points;
    if (!points) return;
    window = mbr;
    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale || 0;
    var wc = window.getCenter();
    var showall = true;
    if (showall) {
        graphics.canvas.setFillStyle("cyan");
        graphics.canvas.beginPath();
        var keys = world.waterline.surface.keys;
        for (var i = 0; i < keys.length; i++) {
            var ppp = points[keys[i]].point;
            this.renderDebugPoint3D(graphics, x, y, z, scale, wc, ppp, 1);
        }
        graphics.canvas.fill();
        graphics.canvas.commit();
    }
    var hilights = world.waterline.surface.hilights;
    if (!hilights) return;
    graphics.canvas.setFillStyle("blue");
    graphics.canvas.beginPath();
    var keys = Object.keys(hilights);
    for (var i = 0; i < keys.length; i++) {
        var ppp = points[hilights[keys[i]]].point;
        this.renderDebugPoint3D(graphics, x, y, z, scale, wc, ppp, 1);
    }
    graphics.canvas.fill();
    graphics.canvas.commit();
}





WorldRendererDebug.prototype.renderDebugPoint3D = function(graphics, x, y, z, scale, wc, point, size) {
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
    np.path(graphics.canvas, s);
}
