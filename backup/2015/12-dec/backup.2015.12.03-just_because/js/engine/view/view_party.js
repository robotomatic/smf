function PartyView(id, players, width, height, scale) {
    this.view = new View(id, null, null, scale);
    this.players = players;

    this.viewpad = 200;
    this.playerpad = 140;
    
    this.ui = {
        topleft : document.getElementById("game-canvas-text-top-left"),
        topcenter : document.getElementById("game-canvas-text-top-center"),
        topright : document.getElementById("game-canvas-text-top-right"),
        bottomleft : document.getElementById("game-canvas-text-bottom-left"),
        bottomcenter : document.getElementById("game-canvas-text-bottom-center"),
        bottomright : document.getElementById("game-canvas-text-bottom-right")
    };

    this.camera = new PartyViewCamera();
    
    this.drawleveldebug = false;
    this.drawplayerdebug = false;
    this.drawnpcdebug = false;
    
    this.lastp = null;
    
    this.ready = false;
    
    var controller = this;
    this.view.canvas_render.onclick = function() {
        controller.view.dirty = true;
        controller.camera.shakeScreen(2.5, 200);
        
    }
    
    this.viewwindow = new Rectangle();
    this.mbr = new Rectangle();
    this.transmbr = new Rectangle();
    this.levelbox = new Rectangle();
}

PartyView.prototype.view;
PartyView.prototype.setLevel = function(level) { this.view.setLevel(level); }
PartyView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
PartyView.prototype.resizeText = function() { this.view.resizeText(); }
PartyView.prototype.show = function() { 
    this.resizeUI();
    this.view.show(); 
}
PartyView.prototype.hide = function() { this.view.hide(); }

PartyView.prototype.resize = function() { 
    this.view.resize();
    this.resizeUI();
}
PartyView.prototype.resizeUI = function() { this.view.resizeUI(); }

PartyView.prototype.render = function(now, delta, stage) { 
    
    if (!this.ready) {
        if (stage.level.itemrenderer) {
            if (stage.level.itemrenderer.theme && stage.level.itemrenderer.theme.background) {
                this.view.canvas_render.style.background = stage.level.itemrenderer.theme.background.color;
            }
        }
        this.ready = true;
    }
    
    
    if (this.view.render(now, delta, stage)) {
        clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, delta, stage, stage.level.layers[i]); 
        
        clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        this.updateUI();
        this.view.dirty=false;
    }
}

PartyView.prototype.renderLayer = function(now, delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.view.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    
    ctx.beginPath();
    
    this.viewwindow = getViewWindow(canvas, this.view.canvas_render.width, this.view.canvas_render.height, this.viewwindow);
    
    var opp = stage.players;
    
    var pad = (opp.length == 1) ? this.playerpad: this.viewpad;
    this.mbr = getMbr(opp, pad, this.mbr);

    
//    var testx = false;
//    for (var i = 0; i < opp.length; i++) {
//        if (!opp.ready) {
//            testx = true;
//            break;
//        }
//    }

    var testx = true;
//    if (opp.length == 1 && opp.ready) testx = false;
    
    var amount = opp.length == 1 ? .8 : .2;
    
    this.mbr = this.camera.getCameraBox(this.mbr, testx, amount);
    if (this.camera.isShaking()) this.view.dirty = true;
    
    var mbr_x = this.mbr.x;
    var mbr_y = this.mbr.y;
    var mbr_w = this.mbr.width;
    var mbr_h = this.mbr.height;
    var zoom = (this.viewwindow.width > this.viewwindow.height) ? this.viewwindow.height / this.mbr.height : this.viewwindow.width / this.mbr.width;

    var nh = this.mbr.height * zoom;
    if (nh > this.viewwindow.height) {
        var diff = this.viewwindow.height / nh;
        this.mbr.x -= (this.mbr.width * diff) / 2;
        this.mbr.width *= diff;
        this.mbr.y -= (this.mbr.height * diff) / 2;
        this.mbr.height *= diff;
    }
    var nw = this.mbr.width * zoom;
    if (nw > this.viewwindow.width) {
        var diff = this.viewwindow.width / nw;
        this.mbr.y -= (this.mbr.height * diff) / 2;
        this.mbr.height *= diff;
        this.mbr.x -= (this.mbr.width * diff) / 2;
        this.mbr.width *= diff;
    }

    var centerx = canvas.width / 2;
    var centery = canvas.height / 2;
    
    var centerpoint = new Point(centerx, centery);
    var center = this.camera.getCenterPoint(now, centerpoint);
    
    var cx = center.x;
    var cy = center.y;

    this.transmbr.x = cx - ((this.mbr.width * zoom) / 2);
    this.transmbr.y = cy - ((this.mbr.height * zoom) / 2);
    this.transmbr.width = this.mbr.width * zoom;
    this.transmbr.height = this.mbr.height * zoom;

    var scale = (this.transmbr.width > this.transmbr.height) ?  this.transmbr.width / mbr_w : this.transmbr.height / mbr_h;
    
    var dy = (opp.length == 1) ? -50 : -50;

    dy += cy - centery;
    
    if (layer.cache === true) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(delta, canvas, ctx, this.transmbr, stage.level, layer, mbr_x, mbr_y, scale, dy);
        if (this.drawleveldebug) this.renderLayerDebug(ctx, this.transmbr, stage.level, layer, mbr_x, mbr_y, scale, dy);
    } else {
        clearRect(ctx, 0, 0, canvas.width, canvas.height);
        if (layername == "players") this.renderPlayers(now, delta, ctx, stage, this.transmbr, mbr_x, mbr_y, scale, dy);
        else this.renderLayerItems(now, delta, canvas, ctx, this.transmbr, stage, layer, mbr_x, mbr_y, scale, dy);
    }
    this.clearViewEdges(ctx, canvas, this.viewwindow);
    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}

PartyView.prototype.renderLayerCache = function(delta, canvas, ctx, view, level, layer, mbrx, mbry, scale, dy) {
    
    if (!this.view.dirty && layer.lastX == mbrx && layer.lastY == mbry && layer.lastW == view.width && layer.lastH == view.height) return;
    layer.lastX = mbrx;
    layer.lastY = mbry;
    layer.lastW = view.width;
    layer.lastH = view.height;
    clearRect(ctx, 0, 0, canvas.width, canvas.height);

    
//    var lbw = level.width * parallax;
//    var lbh = level.height * parallax;

    var lbw = level.width;
    var lbh = level.height;

    var lbx = 0;
    var lby = level.height - lbh;
    
    var parallax = layer.parallax ? layer.parallax : 1;
    
    if (parallax != 1) {
        // todo: gah - parallax still fucked!!!
        var cmbrx = mbrx + view.width / 2;
        lbx = cmbrx - (cmbrx * parallax);
    }

    
    this.levelbox.x = lbx;
    this.levelbox.y = lby;
    this.levelbox.width = lbw;
    this.levelbox.height = lbh;
    
    var ix = (this.levelbox.x - mbrx) * scale;
    
    var iy = this.levelbox.y;
    iy = (iy - mbry) * scale;
    
    iy += dy;
    var itemx = view.x + ix;

    var itemwidth = this.levelbox.width * scale;
    if (layer.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    
    var itemheight = this.levelbox.height * scale;
    if (layer.height == "100%") {
        itemy = 0;
        itemheight = level.height;
    }
    
    var itemy = view.y + iy;
    var img = level.layerCache[layer.name];
    
    var layerscale = layer.parallax ? layer.parallax : 1;
    var layerscaley = 1;
    
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, itemheight * layerscaley);
}

PartyView.prototype.renderLayerItems = function(now, delta, canvas, ctx, view, stage, layer, mbrx, mbry, scale, dy) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(now, delta, canvas, ctx, view, stage, layer, layer.items[i], mbrx, mbry, scale, dy, i);
//    if (this.drawleveldebug) this.renderLayerDebug(ctx, view, stage, layer, mbrx, mbry, scale, dy);
}

PartyView.prototype.renderLayerItem = function(now, delta, canvas, ctx, view, stage, layer, item, mbrx, mbry, scale, dy, index) {
    
    if (item.draw == false) return;
    
    var level = stage.level;

//    if (collide(view, item, false)) return;

    var ix = (item.x - mbrx) * scale;
    var iy = item.y;
    iy = (iy - mbry) * scale;
    iy += dy;
    var itemx = view.x + ix;
    var itemwidth = item.width * scale;
    if (item.width === "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    var itemheight = item.height * scale;
    if (item.height === "100%") {
        itemy = 0;
        itemheight = level.height;
    }
    var itemy = view.y + iy;
    
    
    // todo: item parallax isn't the same as cache parallax!
    
    var parallax = layer.parallax ? Number(layer.parallax) : 1;
    
    if (stage.players.length > 1) parallax = 1;
    
    
    if (parallax != 1) {
        itemx = itemx * parallax;
    }
    
    var cache = !layer.animate;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, itemheight * layer.scale, level.itemrenderer, scale, cache);
}

PartyView.prototype.renderLayerDebug = function(ctx, view, stage, layer, mbrx, mbry, scale, dy) {
//    if (!layer.playercollisions) return;
//
//    var level = stage.level;
//    
//    for (var i = 0; i< layer.playercollisions.length; i++) {
//
//        var collisions = layer.playercollisions[i];
//        
//        if (collisions) for (var ii = 0; ii < collisions.length; ii++) {
//
//            
//            
//            var item = {
//                x : collisions[ii].item.x,
//                y : collisions[ii].item.y,
//                width : collisions[ii].item.width,
//                height : collisions[ii].item.height
//            }
//            
//            
//            
//            
//            if (collisions[ii].part) {
//                item.x += collisions[ii].part.x;
//                item.y += collisions[ii].part.y;
//                item.width = collisions[ii].part.width;
//                item.height = collisions[ii].part.height;
//            }
//            
//            var ix = (item.x - mbrx) * scale;
//            var iy = item.y;
//            iy = (iy - mbry) * scale;
//            iy += dy;
//            var itemx = view.x + ix;
//            
//            var itemwidth = item.width * scale;
//            if (item.width === "100%") {
//                itemx = 0;
//                itemwidth = canvas.width;
//            }
//            var itemheight = item.height * scale;
//            if (item.height === "100%") {
//                itemy = 0;
//                itemheight = level.height;
//            }
//            var itemy = view.y + iy;
//
//            
//            
//            var box = {
//                x : itemx,
//                y: itemy,
//                width : itemwidth,
//                height: itemheight
//            };
//            
//            
//            
//            drawShapeOutline(ctx, "yellow", item, itemx, itemy, itemwidth, itemheight, 2, 1, scale);
//
//            
//        }
//    }
}


PartyView.prototype.renderPlayers = function(now, delta, ctx, stage, view, mbrx, mbry, scale, dy) {
    for (var i = 0; i < stage.players.length; i++) this.renderPlayer(now, delta, ctx, stage.players[i], view, mbrx, mbry, scale, dy, i);
}

PartyView.prototype.renderPlayer = function(now, delta, ctx, player, view, mbrx, mbry, scale, dy, index) {
//    if (index == 0 && this.drawplayerdebug) this.renderPlayerDebug(delta, ctx, player, view, mbrx, mbry, scale, dy);
//    else if (index > 0 && this.drawnpcdebug) this.renderPlayerDebug(delta, ctx, player, view, mbrx, mbry, scale, dy);
    var px = (player.x - mbrx) * scale;
    var py = player.y;
    py = (py - mbry) * scale;
    py += dy;
    player.draw(now, ctx, view.x + px, view.y + py, player.width * scale, player.height * scale, scale);            
}

PartyView.prototype.renderPlayerDebug = function(delta, ctx, player, view, mbrx, mbry, scale, dy) {

//    var viewbox = player.camerabox;
//    this.drawDebugShape(ctx, "red", 2, .5, view, viewbox, mbrx, mbry, dy, scale);
//    
//    var collisionbox = player.collisionbox;
//    this.drawDebugShape(ctx, "blue", 2, .3, view, collisionbox, mbrx, mbry, dy, scale);
//    
//    var colliders = player.colliders;
//    if (colliders) {
//        var ckeys = Object.keys(colliders);
//        for (var i = 0; i < ckeys.length; i++) {
//            var collider = colliders[ckeys[i]];
//            this.drawDebugShape(ctx, collider.color, 2, .5, view, collider, mbrx, mbry, dy, scale);
//        }
//    }
//    
//    var collisions = player.levelcollisions;
//    if (collisions) {
//        for (var i = 0; i < collisions.length; i++) {
//            var item = collisions[i];
//            this.drawDebugShape(ctx, collisions[i].color, 1, 1, view, item.item, mbrx, mbry, dy, scale);
//        }
//    }
//    
//    var groundpoint = player.getGroundPoint();
//    if (groundpoint) {
//        var circle = {
//            x : groundpoint.x - 2.5,
//            y : groundpoint.y - 2.5,
//            "width" : 5,
//            "height" : 5,
//            "radius" : 5
//        }
//        this.drawShape(ctx, "magenta", circle, view, mbrx, mbry, dy, scale);
//    }
}

PartyView.prototype.drawShape = function(ctx, color, shape, view, mbrx, mbry, dy, scale) {
    var bx = (shape.x - mbrx) * scale;
    var by = shape.y;
    by = (by - mbry) * scale;
    by += dy;
    ctx.fillStyle = color;
    drawShape(ctx, shape, view.x + bx, view.y + by, shape.width * scale, shape.height * scale, scale);
}

PartyView.prototype.drawDebugShape = function(ctx, color, weight, opacity, view, box, mbrx, mbry, dy, scale) {
    var bx = (box.x - mbrx) * scale;
    var by = box.y;
    by = (by - mbry) * scale;
    by += dy;
    drawShapeOutline(ctx, color, box, view.x + bx, view.y + by, box.width * scale, box.height * scale, weight, opacity, 1);
}


PartyView.prototype.clearViewEdges = function(ctx, canvas, view) {
    var bw = (canvas.width - view.width) / 2;
    clearRect(ctx, 0, 0, bw, canvas.height);        
    clearRect(ctx, bw + view.width, 0, bw, canvas.height);        
    var bh = (canvas.height - view.height) / 2;
    clearRect(ctx, 0, 0, canvas.width, bh);        
    clearRect(ctx, 0, view.height + bh, canvas.width, bh);        
}

PartyView.prototype.setMessage = function(message) { 
    // todo: need center message too
    //this.view.setMessage(message);
}

PartyView.prototype.updateUI = function() {
    
    return;
    
    if (this.players.players.length == 4) {
        this.updatePlayerUI(this.players.players[0], this.ui.topleft);
        this.updatePlayerUI(this.players.players[1], this.ui.topright);
        this.updatePlayerUI(this.players.players[2], this.ui.bottomleft);
        this.updatePlayerUI(this.players.players[3], this.ui.bottomright);
    } else if (this.players.players.length == 3) {
        this.updatePlayerUI(this.players.players[0], this.ui.topleft);
        this.updatePlayerUI(this.players.players[1], this.ui.topcenter);
        this.updatePlayerUI(this.players.players[2], this.ui.topright);
    } else if (this.players.players.length == 2) {
        this.updatePlayerUI(this.players.players[0], this.ui.topleft);
        this.updatePlayerUI(this.players.players[1], this.ui.topright);
    } else {
        this.updatePlayerUI(this.players.players[0], this.ui.topleft);
    }
}

PartyView.prototype.updatePlayerUI = function(player, ui) {
    
    return;
    
    //  todo: flash for damage, only update class on change
    
    ui.innerHTML = player.name;
    ui.className = ui.className.replace(/\bplayer-dead\b/,'');
    ui.className = ui.className.replace(/\bplayer-damage\b/,'');
    if (!player.alive || !player.ready) {
        ui.className += " player-dead";
    } else if (player.isDamaged()) {
        ui.className += " player-damage";
    }
}