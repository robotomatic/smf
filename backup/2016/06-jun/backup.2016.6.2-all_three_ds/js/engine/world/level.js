"use strict";

function Level(width, height) {
    this.name = "";
    this.theme = "";
    this.width = width;
    this.height = height;
    
    this.debug = false;
    
    this.zoompad;
    this.gravity;
    this.speed;
    this.jumpspeed;
    
    this.layers = new Array();
    this.layerkeys = new Array();
    this.itemrendermanager = new ItemRenderManager();
    
    this.rect = new Rectangle(0, 0, 0, 0);
    this.text = new Text(0, 0, "");
}

Level.prototype.loadJson = function(json) { 
    this.name = json.name;
    this.theme = json.theme;
    this.width = json.width;
    this.height = json.height;
    
    this.debug = json.debug;
    
    this.zoompad = json.zoompad;
    this.gravity = json.gravity;
    this.speed = json.speed;
    this.jumpspeed = json.jumpspeed;
    
    for (var layername in json.layers) {
        this.layers.push(new Layer().loadJson(json.layers[layername]));
    }
    this.layerkeys = Object.keys(this.layers);
    
    return this;
}

Level.prototype.getWidth = function() { return this.width; }
Level.prototype.getHeight = function() { return this.height; }

Level.prototype.setTheme = function(theme) { this.itemrendermanager.theme = theme; }

Level.prototype.update = function(now) {
    if (this.layers) {
        for (var i = 0; i < this.layerkeys.length; i++) {
            var l = this.layerkeys[i];
            var layer = this.layers[l];
            layer.update(now);
        }
    }
}

Level.prototype.render = function(now, ctx, window, x, y, scale, quality) {
    for (var i = 0; i < this.layers.length; i++) {
        this.layers[i].render(now, ctx, window, x, y, this.width, this.height, scale, quality, this.itemrendermanager);
        // todo: debuggery
    }
}










    
    
    
    



Level.prototype.collidePlayer = function(player) {
    player.resetLevelCollisions();
    if (this.layers) {
        for (var i = 0; i < this.layerkeys.length; i++) {
            var l = this.layerkeys[i];
            var layer = this.layers[l];
            layer.collidePlayer(player);
        }
    }
}



Level.prototype.resetPlayer = function(player, timeout) {
    
    
    player.controller.stop();

    // todo:
    // - look for spawn zones first
    
    var lw = this.width / 2;
    var py = 50;
    var px;
    var safe = false;
    while (!safe) {
        px = random(0, lw) + (lw / 2);
        var sp = new Point(px, py);
        safe = this.checkPlayerSpawnPoint(player, sp);
        if (safe) {
            px = safe.x;
            break;
        }
    }

    player.respawn(px, py);
    player.reset();
}

Level.prototype.checkPlayerSpawnPoint = function(player, spawnpoint) {
    var safe = false;
    var lh = this.height;
    var pw = player.controller.width;
    var px = spawnpoint.x;
    var rect = new Rectangle(px + ( pw / 2), 20, pw * 2, lh - 50);
    for (var i = 0; i < this.layers.length; i++) {
        var layer = this.layers[i];
        if (!layer.collide || layer.draw == false) continue;
        for (var ii = 0; ii < layer.items.items.length; ii++) {

            var item = layer.items.items[ii];
            
            if (item.draw === false) continue;
            
            if (item.damage || item.gravity || item.viscosity || item.physics || item.actions) continue;
            
            var col = collideRough(rect, item);
            if (col) {
                
                var ix = item.x;
                var iw = item.width;
                
                var buffer = pw * 2;
                var npx = px;
  
                // todo: make sure no other players are on selected item
                // todo: dropping in the drink sometimes

                if ((Math.abs(ix - px) < buffer) || (Math.abs((ix + iw) - px) < buffer)) {
                    // todo: still hanging off edge sometimes...
                    npx = ix + (iw / 2) - (pw / 2);
                }
                
                safe = new Point(npx, item.y);
                break;
            }
        }
    }
    return safe;
}






























//ViewRenderer.prototype.renderDebug = function(ctx, layer, x, y, width, height, scale) {
////    this.renderWindowDebug(ctx, layer, x, y, width, height, scale)
////    this.renderCollisionDebug(ctx, layer, x, y, width, height, scale)
//}
//
//ViewRenderer.prototype.renderWindowDebug = function(ctx, layer, x, y, width, height, scale) {
//    var mbrx = (this.mbr.x - x) * scale;
//    var mbry = (this.mbr.y - y) * scale;
//    var mbrw = this.mbr.width * scale;
//    var mbrh = this.mbr.height * scale;
//    var r = new Rectangle(mbrx, mbry, mbrw, mbrh);
//    r.drawOutline(ctx, "purple", 2);
//    
//    var wx = (this.window.x - x) * scale;
//    var wy = (this.window.y - y) * scale;
//    var ww = this.window.width * scale;
//    var wh = this.window.height * scale;
//    var w = new Rectangle(wx, wy, ww, wh);
//    w.drawOutline(ctx, "yellow", 10);
//    
//    var svw = round(width / scale);
//    var svh = round(height / scale);
//    var message = "x: " + this.mbr.x + "\ny: " + this.mbr.y + "\nw: " + this.mbr.width + "\nh: " + this.mbr.height;
//    message += "\n\nvw: " + svw + "\nvh: " + svh;
//    message += "\n\ns: " + scale;
//    var pad = 5 * scale;
//    var top = (this.mbr.height / 2 - 20) * scale;
//    
//    ctx.fillStyle = "purple";
//    this.text.x = mbrx + pad;
//    this.text.y = mbry + (pad * 2) + top;
//    this.text.message = message;
//    this.text.draw(ctx);
//}
//
//ViewRenderer.prototype.renderCollisionDebug = function(ctx, level, layer, x, y, width, height, scale) {
//    if (!layer.playercollisions) return;
//    
//    var pad = 5;
//    
//    for (var i = 0; i< layer.playercollisions.length; i++) {
//        var collisions = layer.playercollisions[i];
//        if (collisions) for (var ii = 0; ii < collisions.length; ii++) {
//            var item = {
//                x : collisions[ii].item.x,
//                y : collisions[ii].item.y,
//                width : collisions[ii].item.width,
//                height : collisions[ii].item.height
//            }
//            var mx = item.x;
//            var my = item.y;
//            var mc = collisions[ii].item.collide;
//            var mpx;
//            var mpy;
//            if (collisions[ii].part) {
//                item.x += collisions[ii].part.x;
//                item.y += collisions[ii].part.y;
//                item.width = collisions[ii].part.width;
//                item.height = collisions[ii].part.height;
//                mpx = collisions[ii].part.x;
//                mpy = collisions[ii].part.y;
//                if (collisions[ii].part.collide) mc = collisions[ii].part.collide;
//            }
//            var ix = (item.x - x) * scale;
//            var iy = item.y;
//            iy = (iy - y) * scale;
//            var itemx = ix;
//            var itemwidth = item.width * scale;
//            if (item.width === "100%") {
//                itemx = 0;
//                itemwidth = width;
//            }
//            var itemheight = item.height * scale;
//            if (item.height === "100%") {
//                itemy = 0;
//                itemheight = level.height;
//            }
//            var itemy = iy;
//            var box = {
//                x : itemx,
//                y: itemy,
//                width : itemwidth,
//                height: itemheight
//            };
//            
//            
//            ctx.fillStyle = "red";
//
//            this.rect.x = itemx;
//            this.rect.y = itemy;
//            this.rect.width = itemwidth;
//            this.rect.height = itemheight;
//            this.rect.drawOutline(ctx, "red", 2);
//
//            var message = "x:" + mx + "\ny: " + my;
//            if (mpx || mpy) message += "\npx:" + mpx + "\npy: " + mpy;
//            if (mc) message += "\ncollide:" + mc;
//            this.text.x = itemx + itemwidth + pad;
//            this.text.y = itemy + pad;
//            this.text.message = message;
//            this.text.draw(ctx);
//        }
//    }
//}

