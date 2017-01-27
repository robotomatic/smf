"use strict";

function PartyView(id, players, width, height, scale) {
    
    this.debug = false;
    
    this.view = new View(id, null, null, scale);
    this.players = players;

    this.viewpad = 100;
    this.playerpad = 200;
    
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
    
    let controller = this;
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

PartyView.prototype.update = function(now, delta, stage) {
    this.view.update(now, delta, stage);
}

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

        clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_buffer.width, this.view.canvas_buffer.height);
        for (let i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, delta, stage, stage.level.layers[i]); 
        
        clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        this.updateUI();
        this.view.dirty=false;
    }
}

PartyView.prototype.renderLayer = function(now, delta, stage, layer) { 
    if (layer.draw === false) return;
    let layername = layer.name;
    
//    let canvas = this.view.canvas_buffer;
//    let ctx = this.view.ctx_buffer;
    
    
//    let c = this.view.canvas[layername];
//    let canvas = c.canvas;
//    let ctx = c.context;

    let canvas = this.view.canvas_buffer;
    let ctx = this.view.ctx_buffer;
    
    
//    ctx.beginPath();
    
    this.viewwindow = getViewWindow(canvas, this.view.canvas_render.width, this.view.canvas_render.height, this.viewwindow);
    
    let opp = stage.players;
    
    let pad = (opp.length == 1) ? this.playerpad: this.viewpad;
    this.mbr = getMbr(opp, pad, this.mbr);

    
//    let testx = false;
//    for (let i = 0; i < opp.length; i++) {
//        if (!opp.ready) {
//            testx = true;
//            break;
//        }
//    }

//    let testx = false;
    let testx = true;
//    if (opp.length == 1 && opp.ready) testx = false;
    
//    testx = false;
    
    let cam = true;
//    for (let i = 0; i < opp.length; i++) {
//        if (!opp[i].set) {
//            cam = false;
//            break;
//        }
//    }
    
    if (cam) {
        let amount = .8;
        this.mbr = this.camera.getCameraBox(this.mbr, testx, amount);
    }
    
    
//    if (opp.length == 1) {
//        if (opp[0].set) {
//            let amount = .8;
//            this.mbr = this.camera.getCameraBox(this.mbr, testx, amount);
//        }
//    } else {
//        let amount = .8;
//        this.mbr = this.camera.getCameraBox(this.mbr, testx, amount);
//    }
    
    
    if (this.camera.isShaking()) this.view.dirty = true;
    
    let mbr_x = this.mbr.x;
    let mbr_y = this.mbr.y;
    let mbr_w = this.mbr.width;
    let mbr_h = this.mbr.height;
    let zoom = (this.viewwindow.width > this.viewwindow.height) ? this.viewwindow.height / this.mbr.height : this.viewwindow.width / this.mbr.width;

    let nh = this.mbr.height * zoom;
    if (nh > this.viewwindow.height) {
        let diff = this.viewwindow.height / nh;
        this.mbr.x -= (this.mbr.width * diff) / 2;
        this.mbr.width *= diff;
        this.mbr.y -= (this.mbr.height * diff) / 2;
        this.mbr.height *= diff;
    }
    let nw = this.mbr.width * zoom;
    if (nw > this.viewwindow.width) {
        let diff = this.viewwindow.width / nw;
        this.mbr.y -= (this.mbr.height * diff) / 2;
        this.mbr.height *= diff;
        this.mbr.x -= (this.mbr.width * diff) / 2;
        this.mbr.width *= diff;
    }

    let centerx = canvas.width / 2;
    let centery = canvas.height / 2;
    
    let centerpoint = new Point(centerx, centery);
    let center = this.camera.getCenterPoint(now, centerpoint);
    
    let cx = center.x;
    let cy = center.y;

    this.transmbr.x = cx - ((this.mbr.width * zoom) / 2);
    this.transmbr.y = cy - ((this.mbr.height * zoom) / 2);
    this.transmbr.width = this.mbr.width * zoom;
    this.transmbr.height = this.mbr.height * zoom;

    let scale = (this.transmbr.width > this.transmbr.height) ?  this.transmbr.width / mbr_w : this.transmbr.height / mbr_h;
    
    let dy = (opp.length == 1) ? -50 : -50;

    dy += cy - centery;
    
    
    
    if (layer.cache === true) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(delta, canvas, ctx, this.transmbr, stage.level, layer, mbr_x, mbr_y, scale, dy);
    } else {
//        clearRect(ctx, 0, 0, canvas.width, canvas.height);
        if (layername == "players") this.renderPlayers(now, delta, ctx, stage, this.transmbr, mbr_x, mbr_y, scale, dy);
        else this.renderLayerItems(now, delta, canvas, ctx, this.transmbr, stage, layer, mbr_x, mbr_y, mbr_w, mbr_h, scale, dy);
    }
//    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}

PartyView.prototype.renderLayerCache = function(delta, canvas, ctx, view, level, layer, mbrx, mbry, scale, dy) {

//    if (!this.view.dirty && layer.lastX == mbrx && layer.lastY == mbry && layer.lastW == view.width && layer.lastH == view.height) return;
    layer.lastX = mbrx;
    layer.lastY = mbry;
    layer.lastW = view.width;
    layer.lastH = view.height;
//    clearRect(ctx, 0, 0, canvas.width, canvas.height);

    
//    let lbw = level.width * parallax;
//    let lbh = level.height * parallax;

    let lbw = level.width;
    let lbh = level.height;

    let lbx = 0;
    let lby = level.height - lbh;
    
    let parallax = layer.parallax ? layer.parallax : 1;
    
    if (parallax != 1) {
        // todo: gah - parallax still fucked!!!
        let cmbrx = mbrx + view.width / 2;
        lbx = cmbrx - (cmbrx * parallax);
    }

    
    this.levelbox.x = lbx;
    this.levelbox.y = lby;
    this.levelbox.width = lbw;
    this.levelbox.height = lbh;
    
    let ix = (this.levelbox.x - mbrx) * scale;
    
    let iy = this.levelbox.y;
    iy = (iy - mbry) * scale;
    
    iy += dy;
    let itemx = view.x + ix;

    let itemwidth = this.levelbox.width * scale;
    if (layer.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    
    let itemheight = this.levelbox.height * scale;
    if (layer.height == "100%") {
        itemy = 0;
        itemheight = level.height;
    }
    
    let itemy = view.y + iy;
    let img = level.layerCache[layer.name];
    
    let layerscale = layer.parallax ? layer.parallax : 1;
    
    
    layerscale = 1;
    
    let layerscaley = 1;
    
//    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, itemheight * layerscaley);
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, itemheight * layerscaley);
}

PartyView.prototype.renderLayerItems = function(now, delta, canvas, ctx, view, stage, layer, mbrx, mbry, mbrw, mbrh, scale, dy) {
    if (layer.items) for (let i = 0; i < layer.items.length; i++) {
        this.renderLayerItem(now, delta, canvas, ctx, view, stage, layer, layer.items[i], mbrx, mbry, mbrw, mbrh, scale, dy, i);
        if (this.debug || stage.level.debug) this.renderLayerDebug(ctx, view, stage.level, layer, mbrx, mbry, scale, dy);
    }
}

PartyView.prototype.renderLayerItem = function(now, delta, canvas, ctx, view, stage, layer, item, mbrx, mbry, mbrw, mbrh, scale, dy, index) {
    
    if (item.draw == false) return;
    
    let level = stage.level;

//    if ((item.x + item.width < mbrx) || (item.x > mbrx + mbrw)) return;
//    if ((item.y + item.height < mbry) || (item.y > mbry + mbrh)) return;

    //    if (collide(view, item, false)) return;

    let ix = (item.x - mbrx) * scale;
    let iy = item.y;
    iy = (iy - mbry) * scale;
    iy += dy;
    let itemx = view.x + ix;
    let itemwidth = item.width * scale;
    if (item.width === "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    let itemheight = item.height * scale;
    if (item.height === "100%") {
        itemy = 0;
        itemheight = level.height;
    }
    let itemy = view.y + iy;
    
    
    // todo: item parallax isn't the same as cache parallax!
    
    let parallax = layer.parallax ? Number(layer.parallax) : 1;
    
    if (stage.players.length > 1) parallax = 1;
    
    
    if (parallax != 1) {
//        itemx = itemx * parallax;
    }
    
    let cache = !layer.animate;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, itemheight * layer.scale, level.itemrenderer, scale, cache);
}


PartyView.prototype.renderLayerDebug = function(ctx, view, level, layer, mbrx, mbry, scale, dy) {
    
    if (!layer.playercollisions) return;
    
    for (let i = 0; i< layer.playercollisions.length; i++) {

        let collisions = layer.playercollisions[i];
        
        if (collisions) for (let ii = 0; ii < collisions.length; ii++) {
            
            let item = {
                x : collisions[ii].item.x,
                y : collisions[ii].item.y,
                width : collisions[ii].item.width,
                height : collisions[ii].item.height
            }

            let mx = item.x;
            let my = item.y;
            
            let mc = collisions[ii].item.collide;

            let mpx;
            let mpy;
            
            if (collisions[ii].part) {
                item.x += collisions[ii].part.x;
                item.y += collisions[ii].part.y;
                item.width = collisions[ii].part.width;
                item.height = collisions[ii].part.height;
                
                mpx = collisions[ii].part.x;
                mpy = collisions[ii].part.y;
                
                if (collisions[ii].part.collide) mc = collisions[ii].part.collide;
            }
            
            
            let ix = (item.x - mbrx) * scale;
            let iy = item.y;
            iy = (iy - mbry) * scale;
            iy += dy;
            let itemx = view.x + ix;
            
            let itemwidth = item.width * scale;
            if (item.width === "100%") {
                itemx = 0;
                itemwidth = canvas.width;
            }
            let itemheight = item.height * scale;
            if (item.height === "100%") {
                itemy = 0;
                itemheight = level.height;
            }
            let itemy = view.y + iy;
            
            let box = {
                x : itemx,
                y: itemy,
                width : itemwidth,
                height: itemheight
            };
            
            drawShapeOutline(ctx, "red", item, itemx, itemy, itemwidth, itemheight, 2, 1, scale);

            let pad = 5 * scale;
            
            let message = "x:" + mx + "\ny: " + my;
            if (mpx || mpy) message += "\npx:" + mpx + "\npy: " + mpy;
            if (mc) message += "\ncollide:" + mc;
            
            drawText(ctx, message, "red", itemx + itemwidth + pad, itemy + pad);
            
        }
    }
}



PartyView.prototype.renderPlayers = function(now, delta, ctx, stage, view, mbrx, mbry, scale, dy) {
    for (let i = 0; i < stage.players.length; i++) this.renderPlayer(now, delta, ctx, stage.players[i], view, mbrx, mbry, scale, dy, i);
}

PartyView.prototype.renderPlayer = function(now, delta, ctx, player, view, mbrx, mbry, scale, dy, index) {
    let px = player.x;
    px = (player.x - mbrx) * scale;
    let py = player.y;
    py = (py - mbry) * scale;
    py += dy;
    player.translate(view.x + px, view.y + py);
    player.draw(now, ctx, view.x + px, view.y + py, player.width * scale, player.height * scale, scale);            
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