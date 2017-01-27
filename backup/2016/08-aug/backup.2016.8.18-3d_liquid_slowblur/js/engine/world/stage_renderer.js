"use strict"

/*

    todo:

        - speed up blurrrrrrr
        - fix draw order
        
        - better specificity for which edges to draw - i.e. platform backgrounds need top edges
        - draw shadders under top edge
        - player can fall off left side of level
        - clip items at waterline
        - option to make liquid transparent...need to use render mask with graident. would look supercool
        - draw liquid effects

*/

function StageRenderer() {
    
    this.renderpad = 150;
    
    this.renderitems = {
        all : new Array(),
        left : new Array(),
        middle : new Array(),
        right : new Array()
    }
    
    this.itemcache = new ItemCache();
    
    this.flood = {
        level : 0,
        amount : 0.1,
        max : 5,
        min : -2,
        down : true
    }
    
}

StageRenderer.prototype.render = function(now, graphics, stage, window, x, y, scale, levelquality, playerquality) {

    this.clearGraphics(graphics);
    
    var level = stage.level;

    var flood = level.flood;
    if (flood) {
        var g = graphics.main;
        if (this.flood.down) {
            this.flood.level += this.flood.amount;
            if (this.flood.level > this.flood.max) {
                this.flood.down = false;
            }
        } else {
            this.flood.level -= this.flood.amount;
            if (this.flood.level < this.flood.min) {
                this.flood.down = true;
            }
        }
    }

    if (this.renderitems.all.length == 0) {
        var t = level.layers.length;
        for (var i = 0; i < t; i++) {
            var layer = level.layers[i];
            if (layer.draw === false) continue;
            this.renderitems.all = this.renderitems.all.concat(layer.items.items);
        }
//        this.renderitems.all.sort(sortByZ);
        this.renderitems.all.sort(sortByZIndex);
    }
    
    this.renderItems(now, graphics, stage, window, this.renderitems.all, x, y, scale, levelquality, playerquality, flood, true);
    
    /*
    
    todo: nope...
    
    
    var wc = window.getCenter();
    this.renderitems.left.length = 0;
    this.renderitems.middle.length = 0;
    this.renderitems.right.length = 0;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var item = this.renderitems.all[i];
        if (item.x + item.width < wc.x) this.renderitems.left.push(item);
        else if (item.x > wc.x) this.renderitems.right.push(item);
        else this.renderitems.middle.push(item);
    }
    this.renderitems.right.reverse();

    this.renderItems(now, graphics, stage, window, this.renderitems.left, x, y, scale, levelquality, playerquality, flood, false);
    this.renderItems(now, graphics, stage, window, this.renderitems.right, x, y, scale, levelquality, playerquality, flood, false);
    this.renderItems(now, graphics, stage, window, this.renderitems.middle, x, y, scale, levelquality, playerquality, flood, true);
    */
    
}
    
StageRenderer.prototype.renderItems = function(now, graphics, stage, window, items, x, y, scale, levelquality, playerquality, flood, drawplayers) {

    var renderer = stage.level.itemrenderer;
    
    // todo: need to set player zindex better
    
    var t = items.length;
    for (var i = 0; i < t; i++) {
        var item = items[i];
        item.smooth();
        if (item.zindex !== undefined && item.zindex > 999) continue;
        if (!item.isVisible(window, this.renderpad)) continue;
        this.renderItemsItem(now, graphics, window, x, y, scale, levelquality, renderer, item, flood);
    }

    if (drawplayers) {
        var ctx = graphics.main.ctx;
        var players = stage.players;
        if (players && players.players) {
            var pt = players.players.length;
            for (var pi = 0; pi < pt; pi++) {
                var rp = players.players[pi];
                players.renderPlayer(now, window, ctx, rp, x, y, scale, playerquality);
            }
        }
    }
    
    for (var ii = 0; ii < t; ii++) {
        var item = items[ii];
        if (item.zindex !== undefined && item.zindex <= 999) continue;
        if (!item.isVisible(window, this.renderpad)) continue;
        this.renderItemsItem(now, graphics, window, x, y, scale, levelquality, renderer, item, flood);
    }
}

StageRenderer.prototype.renderItemsItem = function(now, graphics, window, x, y, scale, quality, renderer, item, flood) {

    if (item.iteminfo && item.iteminfo.flood) return;
    
    var g = item.blur ? graphics["blur_" + item.blur] : graphics.main;
    var ctx = g.ctx;
    var width = g.canvas.width;
    var height = g.canvas.height;
    
    this.itemcache.cacheItem(now, ctx, item, renderer, window, x, y, width, height, scale, quality);
    
    this.renderItemFlood(now, graphics, window, x, y, scale, quality, renderer, item, flood);
}

StageRenderer.prototype.renderItemFlood = function(now, graphics, window, x, y, scale, quality, renderer, item, flood) {
    
    
    if (!flood) return;

    var fy = flood.y + this.flood.level;
    
    if (item.width == "100%") return;
    var mbr = item.getMbr();
    if (item.y + mbr.height < fy) {
        return;
    }

    var grap = item.blur ? graphics["blur_" + item.blur] : graphics.main;
    var ctx = grap.ctx;

    var titem = renderer.getItemTheme(flood);
    var c = titem.color;
    var gradient = c.gradient;
    
    var t = y;
    if(gradient.top) {
        var ix = (item.x - x) * scale;
        var it = (item.y - y) * scale;
        var dt = (gradient.top - item.y) * scale;
        var iy = it + dt;
        var p1 = new Point(ix, iy);
        var np1 = new Point(0, 0);
        var wc = window.getCenter();
        np1 = projectPoint3D(p1, 300 * scale, scale, x, y, wc, np1);
        t = np1.y;
    }
    
    var h = 0;
    if (gradient.height) h = gradient.height * scale;
    var g = ctx.createLinearGradient(0, t, 0, h + t);
    var start = gradient.start;
    var stop = gradient.stop;
    g.addColorStop(0, start);
    g.addColorStop(1, stop);
    var color = g;
    
    
    
    var ip = item.getLocation();
    
    var ix = (ip.x - x) * scale;
    var iy = (ip.y - y) * scale;
    var ify = (fy - y) * scale;
    var iz = item.z;
    var iw = item.width * scale;
    var ih = item.height * scale;

    var wc = window.getCenter();
    var sd = iz * scale || 0;

    var depth = item.depth;

    if (!item.parts || item.parts.length == 1) {
        var rh = iy + ih;    
        var p1 = new Point(ix, ify);
        var p2 = new Point(ix + iw, ify);

        this.projectFlood(ctx, p1, p2, x, y, rh, sd, depth, scale, wc, color);
    } else {
        
        var left = null;
        var right = null;
        var bottom = 0;
        
        var poly = new Polygon();
        poly.setPoints(item.polygon.points);
        
        var t = poly.points.length;
        for (var i = 1; i < t; i++) {
            
            var ps = poly.points[i - 1];
            var p1 = new Point(item.x + ps.x, item.y + ps.y);
            
            var pe = poly.points[i];
            var p2 = new Point(item.x + pe.x, item.y + pe.y);
            
            if (p2.y > bottom) bottom = p2.y;
            
            if (p1.y < p2.y) {
                if (p1.y < fy && p2.y > fy) {
                    if (!right) right = new Point(0, 0);
                    right.x = p1.x
                }
            } else {
                if (p2.y < fy && p1.y > fy) {
                    if (!left) left = new Point(0, 0);
                    left.x = p1.x
                }
            }
        }
        

        var ps = poly.points[t - 1];
        var p1 = new Point(item.x + ps.x, item.y + ps.y);

        var pe = poly.points[0];
        var p2 = new Point(item.x + pe.x, item.y + pe.y);

        if (p2.y > bottom) bottom = p2.y;

        if (p2.y < fy && p1.y > fy) {
            if (!left) left = new Point(0, 0);
            left.x = p1.x
        }
        
        
        if (left && right) {
            
            left.x = ix + ((left.x - item.x) * scale);
            left.y = ify;
            
            right.x = ix + ((right.x - item.x) * scale);
            right.y = ify;
            
            var rh = (bottom * scale) - iy;

            this.projectFlood(ctx, left, right, x, y, rh, sd, depth, scale, wc, color);
        } else {
            var debug = true;
        }
    }
    
}


StageRenderer.prototype.projectFlood = function(ctx, p1, p2, x, y, rh, sd, depth, scale, wc, color) {

    
    ctx.fillStyle = color;
    
    var np1 = new Point(0, 0);
    np1 = projectPoint3D(p1, sd, scale, x, y, wc, np1);
    
    var np2 = new Point(0, 0);
    rh = rh - np2.y;    
    np2 = projectPoint3D(p2, sd, scale, x, y, wc, np2);
    
    var rw = np2.x - np1.x;
    var r = new Rectangle(np1.x, np1.y, rw, rh);
    ctx.beginPath();
    r.draw(ctx);
    
    var sdd = depth * scale;
    var npt = new Point(0, 0);
    var poly = new Polygon();
    var np3 = new Point(0, 0);
    np3 = projectPoint3D(np1, sdd, scale, x, y, wc, np3);
    if (np3.x < np1.x) {
        poly.addPoint(np1);
        poly.addPoint(np3);
        npt.x = np3.x;
        npt.y = np3.y + rh;
        poly.addPoint(npt);
        npt.x = np1.x;
        npt.y = np1.y + rh;
        poly.addPoint(npt);
        ctx.beginPath();
        poly.draw(ctx);
    }
    var np4 = new Point(0, 0);
    np4 = projectPoint3D(np2, sdd, scale, x, y, wc, np4);
    if (np4.x > np2.x) {
        poly.addPoint(np2);
        poly.addPoint(np4);
        npt.x = np4.x;
        npt.y = np4.y + rh;
        poly.addPoint(npt);
        npt.x = np2.x;
        npt.y = np2.y + rh;
        poly.addPoint(npt);
        ctx.beginPath();
        poly.draw(ctx);
    }
}

StageRenderer.prototype.clearGraphics = function(graphics) { 
    var keys = Object.keys(graphics);
    for (var i = 0; i < keys.length; i++)  {
        var g = graphics[keys[i]];
        clearRect(g.ctx, 0, 0, g.canvas.width, g.canvas.height);
    }
}
