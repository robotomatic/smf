function PartyView(id, players, width, height, scale) {
    this.view = new View(id, null, null, scale);
    this.players = players;
    this.lastview = null;
    this.viewpad = 500;
    this.ui = {
        topleft : document.getElementById("game-canvas-text-top-left"),
        topcenter : document.getElementById("game-canvas-text-top-center"),
        topright : document.getElementById("game-canvas-text-top-right"),
        bottomleft : document.getElementById("game-canvas-text-bottom-left"),
        bottomcenter : document.getElementById("game-canvas-text-bottom-center"),
        bottomright : document.getElementById("game-canvas-text-bottom-right")
    };
    
    this.drawleveldebug = false;
    this.drawplayerdebug = false;
    this.drawnpcdebug = false;
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

PartyView.prototype.render = function(delta, stage) { 
    if (this.view.render(delta, stage)) {
        for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(delta, stage, stage.level.layers[i]); 
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        this.updateUI();
        this.view.dirty=false;
    }
}

PartyView.prototype.renderLayer = function(delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.view.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, this.view.canvas_render.width, this.view.canvas_render.height);
    
    var opp = stage.players;
    var tmbr = getMbr(opp, this.viewpad);
    
    var viewBuffer = 1000 * (tmbr.width / stage.level.width);
    var mbr = getMbr(opp, viewBuffer);
    
    
    
    
    if (this.lastview) {
        this.lastview.x = mbr.x;
        this.lastview.width = mbr.width;

        var thresh = 1;
        var amount = .25;
        
        var my = clamp(mbr.y);
        var ly = clamp(this.lastview.y);

        if (my < ly) {
            var d = ly - my;
            if (d >= thresh) {
                this.lastview.y = this.lastview.y - amount;
                mbr.y = this.lastview.y;
            }
        } else if (my > ly) {
            var d = my - ly;
            if (d >= thresh) {
                this.lastview.y = this.lastview.y + (amount * 5);
                mbr.y = this.lastview.y;
            }
        }
        
        var mh = clamp(mbr.height);
        var lh = clamp(this.lastview.height);
        
        if (mh < lh) {
            var d = lh - mh;
            if (d >= thresh) {
                this.lastview.height = this.lastview.height - amount;
                mbr.height = this.lastview.height;
            }
        } else if (mh > lh) {
            var d = mh - lh;
            if (d >= thresh) {
                this.lastview.height = this.lastview.height + (amount * 5);
                mbr.height = this.lastview.height;
            }
        }
    } else {
        this.lastview = {
            x : mbr.x,
            y: mbr.y,
            width: mbr.width,
            height: mbr.height
        }
    }
    
    
    
    
    var mbr_x = mbr.x;
    var mbr_y = mbr.y;
    var mbr_w = mbr.width;
    var mbr_h = mbr.height;
    var zoom = (view.width > view.height) ? view.height / mbr.height : view.width / mbr.width;
    var nh = mbr.height * zoom;
    if (nh > view.height) {
        var diff = view.height / nh;
        mbr.x -= (mbr.width * diff) / 2;
        mbr.width *= diff;
        mbr.y -= (mbr.height * diff) / 2;
        mbr.height *= diff;
    }
    var nw = mbr.width * zoom;
    if (nw > view.width) {
        var diff = view.width / nw;
        mbr.y -= (mbr.height * diff) / 2;
        mbr.height *= diff;
        mbr.x -= (mbr.width * diff) / 2;
        mbr.width *= diff;
    }
    
    
    
    
    
    

    
    
    
    
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var cmbrtrans = {
        "x" : cx - ((mbr.width * zoom) / 2),
        "y" : cy - ((mbr.height * zoom) / 2),
        "width" : mbr.width * zoom,
        "height" : mbr.height * zoom
    };

    var scale = (cmbrtrans.width > cmbrtrans.height) ?  cmbrtrans.width / mbr_w : cmbrtrans.height / mbr_h;
    var bounds_topy = cmbrtrans.y + (-mbr_y * scale);
    var bounds_height = stage.level.height * scale;
    var bounds_bottomy = bounds_topy + bounds_height;
    var border_height = (canvas.height - view.height) / 2;
    var diff_top = bounds_topy + bounds_height;
    var diff_height = canvas.height - diff_top - border_height;
    var diffbottom = diff_top + diff_height;
    var dy = (diff_height > 0) ? diff_height : 0;
    if (layer.cache != false) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(delta, canvas, ctx, cmbrtrans, stage.level, layer, mbr_x, mbr_y, scale, dy);
    } else {
        clearRect(ctx, 0, 0, canvas.width, canvas.height);
        if (layername == "players") {
            if (this.view.drawshadows) {
                ctx.shadowBlur = this.view.shadowblur;
                ctx.shadowColor = this.view.shadowcolor;    
                this.renderPlayers(delta, ctx, stage, cmbrtrans, mbr_x, mbr_y, scale, dy);
                ctx.shadowBlur = 0;
            }
            if (this.view.drawoutlines) {
                var oc = this.view.canvas[String(layername + "-outline")];
                var ocanvas = oc.canvas;
                var octx = oc.context;
                clearRect(octx, 0, 0, ocanvas.width, ocanvas.height);
                this.renderPlayers(delta, octx, stage, cmbrtrans, mbr_x, mbr_y + 1, scale, dy, true);
                this.clearViewEdges(octx, ocanvas, view);
                this.view.ctx_buffer.drawImage(ocanvas, 0, 0);
            }
            this.renderPlayers(delta, ctx, stage, cmbrtrans, mbr_x, mbr_y, scale, dy, false);
        } else {
            if (this.view.drawshadows) {
                ctx.shadowBlur = this.view.shadowblur;
                ctx.shadowColor = this.view.shadowcolor;    
                this.renderLayerItems(delta, canvas, ctx, cmbrtrans, stage.level, layer, mbr_x, mbr_y, scale, dy);
                ctx.shadowBlur = 0;
            }
            if (this.view.drawoutlines && layer.outline) {
                var oc = this.view.canvas[String(layername + "-outline")];
                var ocanvas = oc.canvas;
                var octx = oc.context;
                clearRect(octx, 0, 0, ocanvas.width, ocanvas.height);
                this.renderLayerItems(delta, ocanvas, octx, cmbrtrans, stage.level, layer, mbr_x, mbr_y, scale, dy, true);
                this.clearViewEdges(octx, ocanvas, view);
                this.view.ctx_buffer.drawImage(ocanvas, 0, 0);
            }
            this.renderLayerItems(delta, canvas, ctx, cmbrtrans, stage.level, layer, mbr_x, mbr_y, scale, dy, false);
        }
    }
    this.clearViewEdges(ctx, canvas, view);
    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}
    
PartyView.prototype.renderLayerCache = function(delta, canvas, ctx, view, level, layer, mbrx, mbry, scale, dy) {
    if (!this.view.dirty && layer.lastX == mbrx && layer.lastY == mbry && layer.lastW == view.width && layer.lastH == view.height) return;
    layer.lastX = mbrx;
    layer.lastY = mbry;
    layer.lastW = view.width;
    layer.lastH = view.height;
    clearRect(ctx, 0, 0, canvas.width, canvas.height);

    var x = 0;
    var y = 0;
    
    if (layer.parallax) {
        mbrx *= layer.parallax;
        //dy /= layer.parallax * 5;
    }
    
    var levelbox = {
        "x" : x,
        "y" : y,
        "width" : level.width,
        "height" : level.height
    };
    var ix = (levelbox.x - mbrx) * scale;
    var iy = levelbox.y;
    iy = (iy - mbry) * scale;
    iy += dy;
    var itemx = view.x + ix;

    var itemwidth = levelbox.width * scale;
    if (layer.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    var itemheight = levelbox.height * scale;
    if (layer.height == "100%") {
        itemy = 0;
        itemheight = level.height;
    }
    
    var itemy = view.y + iy;
    var img = level.layerCache[layer.name];
    
    var layerscale = 1;
    
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, itemheight * layerscale);
}

PartyView.prototype.renderLayerItems = function(delta, canvas, ctx, view, level, layer, mbrx, mbry, scale, dy, outline) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, view, level, layer, layer.items[i], mbrx, mbry, scale, dy, outline);
    if (this.drawleveldebug) this.renderLayerDebug(ctx, view, level, layer, mbrx, mbry, scale, dy);
}

PartyView.prototype.renderLayerItem = function(delta, canvas, ctx, view, level, layer, item, mbrx, mbry, scale, dy, outline) {
    if (item.draw == false) return;
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
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, itemheight * layer.scale, level.itemrenderer, outline);
}

PartyView.prototype.renderLayerDebug = function(ctx, view, level, layer, mbrx, mbry, scale, dy) {
    
    if (!layer.playercollisions) return;
    
    for (var i = 0; i< layer.playercollisions.length; i++) {
        var collisions = layer.playercollisions[i];
        if (collisions) for (var ii = 0; ii < collisions.length; ii++) {
            var item = collisions[ii].item;

            
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
            
            drawRectOutline(ctx, "yellow", itemx, itemy, itemwidth, itemheight, 2, 1);

            
        }
    }
}


PartyView.prototype.renderPlayers = function(delta, ctx, stage, view, mbrx, mbry, scale, dy, outline) {
    for (var i = 0; i < stage.players.length; i++) this.renderPlayer(delta, ctx, stage.players[i], view, mbrx, mbry, scale, dy, outline, i);
}

PartyView.prototype.renderPlayer = function(delta, ctx, player, view, mbrx, mbry, scale, dy, outline, index) {
    if (index == 0 && this.drawplayerdebug) this.renderPlayerDebug(delta, ctx, player, view, mbrx, mbry, scale, dy);
    else if (index > 0 && this.drawnpcdebug) this.renderPlayerDebug(delta, ctx, player, view, mbrx, mbry, scale, dy);
    var px = (player.x - mbrx) * scale;
    var py = player.y;
    py = (py - mbry) * scale;
    py += dy;
    player.draw(ctx, view.x + px, view.y + py, player.width * scale, player.height * scale, outline);            
}

PartyView.prototype.renderPlayerDebug = function(delta, ctx, player, view, mbrx, mbry, scale, dy) {

    var viewbox = player.camerabox;
    this.drawDebugRect(ctx, "red", 2, .5, view, viewbox, mbrx, mbry, dy, scale);
    
    var collisionbox = player.collisionbox;
    this.drawDebugRect(ctx, "blue", 2, .3, view, collisionbox, mbrx, mbry, dy, scale);
    
    var colliders = player.colliders;
    if (colliders) for (var c in colliders) {
        var collider = colliders[c];
        this.drawDebugRect(ctx, collider.color, 2, .5, view, collider, mbrx, mbry, dy, scale);
    }
    
    var collisions = player.levelcollisions;
    if (collisions) for (var i = 0; i < collisions.length; i++) {
        var item = collisions[i];
        this.drawDebugRect(ctx, collisions[i].color, 1, 1, view, item.item, mbrx, mbry, dy, scale);
    }
}



PartyView.prototype.drawDebugRect = function(ctx, color, weight, opacity, view, box, mbrx, mbry, dy, scale) {
    var bx = (box.x - mbrx) * scale;
    var by = box.y;
    by = (by - mbry) * scale;
    by += dy;
    drawRectOutline(ctx, color, view.x + bx, view.y + by, box.width * scale, box.height * scale, weight, opacity);
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
    switch (this.players.players.length) {
        case 4 :
            this.ui.topleft.innerHTML = this.players.players[0].name;
            this.ui.topright.innerHTML = this.players.players[1].name;
            this.ui.bottomleft.innerHTML = this.players.players[2].name;
            this.ui.bottomright.innerHTML = this.players.players[3].name;
            break;
        case 3 :
            this.ui.topleft.innerHTML = this.players.players[0].name;
            this.ui.topcenter.innerHTML = this.players.players[1].name;
            this.ui.topright.innerHTML = this.players.players[2].name;
            break;
        case 2 :
            this.ui.topleft.innerHTML = this.players.players[0].name;
            this.ui.topright.innerHTML = this.players.players[1].name;
            break;
        default:
            this.ui.topleft.innerHTML = this.players.players[0].name;
            break;
    }
}