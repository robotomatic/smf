function PartyView(id, players, width, height) {
    this.view = new View(id, width, height);
    this.players = players;
    this.lastView = null;
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
        if (this.view.dev) this.view.dev.update();
        this.view.dirty=false;
    }
}

PartyView.prototype.renderLayer = function(delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.view.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, this.view.width, this.view.height);
    var opp = stage.players.slice(1, stage.players.length);
    var tmbr = getMbr(opp);
    var viewBuffer = 1000 * (tmbr.width / stage.level.width);
    var mbr = getMbr(opp, viewBuffer);
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
        if (layername == "players") this.renderPlayers(delta, ctx, stage, cmbrtrans, mbr_x, mbr_y, scale, dy);
        else if (layername == "players-shadows") {
            if (this.view.drawPlayerShadows) {
                ctx.shadowBlur = this.view.playerShadowBlur;
                ctx.shadowColor = this.view.playerShadowColor;    
                this.renderPlayers(delta, ctx, stage, cmbrtrans, mbr_x, mbr_y, scale, dy);
                ctx.shadowBlur = 0;
            }
        } else this.renderLayerItems(delta, canvas, ctx, cmbrtrans, stage.level, layer, mbr_x, mbr_y, scale, dy);
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
    
    var itemy = view.y + iy;
    var img = level.layerCache[layer.name];
    
    var layerscale = 1;
    
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, (levelbox.height * scale) * layerscale);
}

PartyView.prototype.renderLayerItems = function(delta, canvas, ctx, view, level, layer, mbrx, mbry, scale, dy) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, view, level, layer, layer.items[i], mbrx, mbry, scale, dy);
}

PartyView.prototype.renderLayerItem = function(delta, canvas, ctx, view, level, layer, item, mbrx, mbry, scale, dy) {
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
    var itemy = view.y + iy;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, (item.height * scale) * layer.scale, level.itemrenderer);
}

PartyView.prototype.renderPlayers = function(delta, ctx, stage, view, mbrx, mbry, scale, dy) {
    for (var i = 0; i < stage.players.length; i++) this.renderPlayer(delta, ctx, stage.players[i], view, mbrx, mbry, scale, dy);
}

PartyView.prototype.renderPlayer = function(delta, ctx, player, view, mbrx, mbry, scale, dy) {
    var px = (player.x - mbrx) * scale;
    var py = player.y;
    py = (py - mbry) * scale;
    py += dy;
    player.draw(ctx, view.x + px, view.y + py, player.width * scale, player.height * scale);            
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
    this.view.setMessage(message);
}

PartyView.prototype.updateUI = function() {
    if (!this.view.updateUI()) return;
    this.view.ui.setMessage("Ready.");
}