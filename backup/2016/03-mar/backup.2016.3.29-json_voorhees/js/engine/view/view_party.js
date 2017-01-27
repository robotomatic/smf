"use strict";

function PartyView(id, players, width, height, scale) {
    
    this.debug = false;
    
    this.view = new View(id, null, null, scale);
    this.players = players;

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
        controller.camera.shakeScreen(5.5, 1200);
        
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

PartyView.prototype.update = function(now, stage) {
    this.view.update(now, stage);
}

PartyView.prototype.render = function(now, stage) { 
    if (!this.ready) {
        if (stage.level.itemrenderer) {
            if (stage.level.itemrenderer.theme && stage.level.itemrenderer.theme.background) {
                this.view.canvas_render.style.background = stage.level.itemrenderer.theme.background.color;
            }
        }
        this.ready = true;
    }
    if (!this.view.render(now, stage)) return;
    clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_buffer.width, this.view.canvas_buffer.height);
    var canvas = this.view.canvas_buffer;
    var ctx = this.view.ctx_buffer;
    this.viewwindow = getViewWindow(canvas, this.view.canvas_render.width, this.view.canvas_render.height, this.viewwindow);
    this.mbr = this.camera.getMbr(stage.players.players);
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

    var dy = -50;
    dy += cy - centery;

    var dx = (stage.players.players.length == 1) ? this.camera.ox : 0;
    
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, stage, stage.level.layers[i], canvas, ctx, mbr_x, mbr_y, mbr_w, mbr_h, scale, dx, dy); 
    
    clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
    this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
    this.updateUI();
    this.view.dirty=false;
}

PartyView.prototype.renderLayer = function(now, stage, layer, canvas, ctx, mbr_x, mbr_y, mbr_w, mbr_h, scale, dx, dy) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    if (layer.cache === true) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(canvas, ctx, this.transmbr, stage.level, layer, mbr_x, mbr_y, scale, dy);
    } else {
        if (layername == "players") this.renderPlayers(now, ctx, stage, this.transmbr, mbr_x, mbr_y, scale, dx, dy);
        else this.renderLayerItems(now, canvas, ctx, this.transmbr, stage, layer, mbr_x, mbr_y, mbr_w, mbr_h, scale, dy);
    }
}

PartyView.prototype.renderLayerCache = function(canvas, ctx, view, level, layer, mbrx, mbry, scale, dy) {
    layer.lastX = mbrx;
    layer.lastY = mbry;
    layer.lastW = view.width;
    layer.lastH = view.height;
    var lbw = level.width;
    var lbh = level.height;
    var lbx = 0;
    var lby = level.height - lbh;
    this.levelbox.x = lbx;
    this.levelbox.y = lby;
    this.levelbox.width = lbw;
    this.levelbox.height = lbh;
    var ix = (this.levelbox.x - mbrx) * scale;
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
    var iy = this.levelbox.y;
    iy = (iy - mbry) * scale;
    iy += dy;
    var itemy = view.y + iy;
    var layerscalex = 1;
    var layerscaley = 1;
    var itemw = clamp(itemwidth * layerscalex);
    var itemh = clamp(itemheight * layerscaley);
    var img = level.layerCache[layer.name];
    
//    itemx = round(itemx);
//    itemy = round(itemy);
//    itemw = round(itemw);
//    itemh = round(itemh);
    ctx.drawImage(img, itemx, itemy, itemw, itemh);
}

PartyView.prototype.renderLayerItems = function(now, canvas, ctx, view, stage, layer, mbrx, mbry, mbrw, mbrh, scale, dy) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) {
        this.renderLayerItem(now, canvas, ctx, view, stage, layer, layer.items[i], mbrx, mbry, mbrw, mbrh, scale, dy, i);
        if (this.debug || stage.level.debug) this.renderLayerDebug(ctx, view, stage.level, layer, mbrx, mbry, scale, dy);
    }
}

PartyView.prototype.renderLayerItem = function(now, canvas, ctx, view, stage, layer, item, mbrx, mbry, mbrw, mbrh, scale, dy, index) {
    if (item.draw == false) return;
    var level = stage.level;
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
    var cache = !layer.animate;

    var itemw = clamp(itemwidth * layer.scale);
    var itemh = clamp(itemheight * layer.scale);
    
//    itemx = round(itemx);
//    itemy = round(itemy);
//    itemw = round(itemw);
//    itemh = round(itemh);
    layer.drawItem(ctx, item, itemx, itemy, itemw, itemh, level.itemrenderer, scale, cache);
}


PartyView.prototype.renderLayerDebug = function(ctx, view, level, layer, mbrx, mbry, scale, dy) {
    if (!layer.playercollisions) return;
    for (var i = 0; i< layer.playercollisions.length; i++) {
        var collisions = layer.playercollisions[i];
        if (collisions) for (var ii = 0; ii < collisions.length; ii++) {
            var item = {
                x : collisions[ii].item.x,
                y : collisions[ii].item.y,
                width : collisions[ii].item.width,
                height : collisions[ii].item.height
            }
            var mx = item.x;
            var my = item.y;
            var mc = collisions[ii].item.collide;
            var mpx;
            var mpy;
            if (collisions[ii].part) {
                item.x += collisions[ii].part.x;
                item.y += collisions[ii].part.y;
                item.width = collisions[ii].part.width;
                item.height = collisions[ii].part.height;
                mpx = collisions[ii].part.x;
                mpy = collisions[ii].part.y;
                if (collisions[ii].part.collide) mc = collisions[ii].part.collide;
            }
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
            var box = {
                x : itemx,
                y: itemy,
                width : itemwidth,
                height: itemheight
            };
            drawShapeOutline(ctx, "red", item, itemx, itemy, itemwidth, itemheight, 2, 1, scale);
            var pad = 5 * scale;
            var message = "x:" + mx + "\ny: " + my;
            if (mpx || mpy) message += "\npx:" + mpx + "\npy: " + mpy;
            if (mc) message += "\ncollide:" + mc;
            drawText(ctx, message, "red", itemx + itemwidth + pad, itemy + pad);
        }
    }
}



PartyView.prototype.renderPlayers = function(now, ctx, stage, view, mbrx, mbry, scale, dx, dy) {
    for (var i = 0; i < stage.players.players.length; i++) this.renderPlayer(now, ctx, stage.players.players[i], view, mbrx, mbry, scale, dx, dy, i);
}

PartyView.prototype.renderPlayer = function(now, ctx, player, view, mbrx, mbry, scale, dx, dy, index) {
    // todo: move this shit into player class
    var px = player.x;
    px = (player.x - mbrx) * scale;
    var py = player.y;
    py = (py - mbry) * scale;
    py += dy;
    player.translate(view.x + px, view.y + py);
    
    var dpx = view.x + px;
    var dpy = view.y + py;
    var dpw = player.width * scale;
    var dph = player.height * scale;

//    dpx = round(dpx);
//    dpy = round(dpy);
//    dpw = round(dpw);
//    dph = round(dph);
    player.draw(now, ctx, dpx, dpy, dpw, dph, scale);            
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