function PlayerView(id, player, width, height, zoom, scale) {
    this.view = new View(id, width, height, scale);
    this.player = player;
    this.zoom = zoom ? zoom : 1;
};

PlayerView.prototype.view;
PlayerView.prototype.setLevel = function(level) { this.view.setLevel(level); }
PlayerView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
PlayerView.prototype.resizeText = function() { this.view.resizeText(); }
PlayerView.prototype.show = function() { 
    this.resizeUI();
    this.view.show(); 
}
PlayerView.prototype.hide = function() { this.view.hide(); }

PlayerView.prototype.resize = function() { 
    this.view.resize(); 
    this.resizeUI();
}
PlayerView.prototype.resizeUI = function() { this.view.resizeUI(); }

PlayerView.prototype.render = function(delta, stage) { 
    if (this.view.render(delta, stage)) {
        for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(delta, stage, stage.level.layers[i]); 
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        this.updateUI();
        this.view.dirty = false;
    }
}

PlayerView.prototype.renderLayer = function(delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.view.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, this.view.width, this.view.height);
    var cx = this.view.width / 2;
    var cy = (this.view.height / 2);
    var pbox = {
        "x" : cx - ((this.player.width * this.zoom) / 2),
        "y" : cy - ((this.player.height * this.zoom) / 2),
        "width" : this.player.width * this.zoom, 
        "height" : this.player.height * this.zoom
    }
    var ptrans = translateItem(canvas.width, canvas.height, pbox, this.view.width, this.view.height);
    var x = this.player.x;
    var y = this.player.y;
    var pw = this.player.width * this.zoom;
    var ph = this.player.height * this.zoom;
    var px = x * this.zoom;
    var py = y * this.zoom;
    var dx = cx - (px + (pw / 2) );
    var dy = cy - (py + (ph / 2) );
    var bounds = {
        "x" : 0,
        "y" : 0,
        "width" : stage.level.width,
        "height" : stage.level.height
    }
    var bounds_rel = translateRelative(bounds, dx, dy, this.zoom);
    var bounds_trans = translateItem(canvas.width, canvas.height, bounds_rel, this.view.width, this.view.height);
    var bounds_bottom_y = bounds_trans.y + bounds_trans.height;
    var border_height = (canvas.height - view.height)  / 2;
    var border_top = view.height + border_height;
    var height_diff = border_top - bounds_bottom_y;
    var offset_y = (height_diff > 0) ? height_diff : 0;
    if (layer.cache != false) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(delta, canvas, ctx, view, stage.level, layer, dx, dy, offset_y); 
    } else { 
        clearRect(ctx, 0, 0, canvas.width, canvas.height);
        if (layername == "players") {
            this.renderPlayers(delta, canvas, ctx, stage.players, dx, dy, offset_y); 
            this.player.draw(ctx, ptrans.x * layer.scale, (ptrans.y + offset_y) * layer.scale, ptrans.width * layer.scale, ptrans.height * layer.scale);            
        } else if (layername == "players-shadows") {
            if (this.view.drawPlayerShadows) {
                ctx.shadowBlur = this.view.playerShadowBlur;
                ctx.shadowColor = this.view.playerShadowColor;    
                this.renderPlayers(delta, canvas, ctx, stage.players, dx, dy, offset_y); 
                this.player.draw(ctx, ptrans.x * layer.scale, (ptrans.y + offset_y) * layer.scale, ptrans.width * layer.scale, ptrans.height * layer.scale);            
                ctx.shadowBlur = 0;
            }
        } else this.renderLayerItems(delta, canvas, ctx, stage.level, layer, dx, dy, offset_y); 
        if (layer.blur) blurCanvas(canvas, ctx, layer.blur);
    }
    this.clearViewEdges(ctx, canvas, view);
    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}

PlayerView.prototype.renderLayerCache = function(delta, canvas, ctx, view, level, layer, dx, dy, offset_y) {
    if (!this.view.dirty && layer.lastX == dx && layer.lastY == dy && layer.lastW == view.width && layer.lastH == view.height) return;
    layer.lastX = dx;
    layer.lastY = dy;
    layer.lastW = view.width;
    layer.lastH = view.height;
    clearRect(ctx, 0, 0, canvas.width, canvas.height);
    var x= 0;
    var y = 0;
    if (layer.parallax) {
        dx *= layer.parallax;
        //dy /= layer.parallax * 5;
    }
    var levelbox = {
        "x" : x,
        "y" : y,
        "width" : level.width,
        "height" : level.height
    };
    var rel = translateRelative(levelbox, dx, dy, this.zoom);
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.view.width, this.view.height);
    var itemx = rtrans.x;
    var itemwidth = rtrans.width;
    if (layer.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    var itemheight = rtrans.height;
    var itemy = rtrans.y + offset_y;
    var layerscale = 1;
    var img = level.layerCache[layer.name];
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, itemheight * layerscale);
}

PlayerView.prototype.renderLayerItems = function(delta, canvas, ctx, level, layer, dx, dy, offset_y) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, level, layer, layer.items[i], dx, dy, offset_y);
}

PlayerView.prototype.renderLayerItem = function(delta, canvas, ctx, level, layer, item, dx, dy, offset_y) {
    if (item.draw == false) return;
    var rel = translateRelative(item, dx, dy, this.zoom);
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.view.width, this.view.height);
    var itemx = rtrans.x;
    var itemwidth = rtrans.width;
    if (item.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    var itemy = rtrans.y + offset_y;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, rtrans.height * layer.scale, level.itemrenderer);
}

PlayerView.prototype.renderPlayers = function(delta, canvas, ctx, players, dx, dy, offset_y) { 
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player===this.player) continue;
        this.renderPlayer(delta, canvas, ctx, player, dx, dy, offset_y);
    }
}

PlayerView.prototype.renderPlayer = function(delta, canvas, ctx, player, dx, dy, offset_y) {
    var rel = translateRelative(player, dx, dy, this.zoom);
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.view.width, this.view.height);
    player.draw(ctx, rtrans.x, rtrans.y + offset_y, rtrans.width, rtrans.height);
}

PlayerView.prototype.clearViewEdges = function(ctx, canvas, view) {

    var bw = (canvas.width - view.width) / 2;
    var bh = (canvas.height - view.height) / 2;

    /*
    ctx.fillStyle = "white";

    drawRect(ctx, 0, 0, bw, canvas.height);        
    drawRect(ctx, bw + view.width, 0, bw, canvas.height);        
    drawRect(ctx, 0, 0, canvas.width, bh);        
    drawRect(ctx, 0, view.height + bh, canvas.width, bh);        
    */

    clearRect(ctx, 0, 0, bw, canvas.height);        
    clearRect(ctx, bw + view.width, 0, bw, canvas.height);        
    clearRect(ctx, 0, 0, canvas.width, bh);        
    clearRect(ctx, 0, view.height + bh, canvas.width, bh);        
}

PlayerView.prototype.setMessage = function(message) { 
    this.view.setMessage(message);
}

PlayerView.prototype.updateUI = function() {
    if (!this.view.updateUI()) return;
    this.view.ui.setMessage(this.player.character.name);
}