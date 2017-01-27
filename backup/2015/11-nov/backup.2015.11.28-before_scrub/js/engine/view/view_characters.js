function CharactersView(id, playernum, menubox, width, height, zoom) {
    this.view = new View(id, width, height, null, "menu-canvas");
    this.id = id;
    this.playernum = playernum;
    this.menubox = menubox;
    this.zoom = zoom ? zoom : 1;
    this.currentchar = this.playernum;
    this.view.renderdelay = 0;
};

CharactersView.prototype.view;
CharactersView.prototype.setLevel = function(level) { this.view.setLevel(level); }
CharactersView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
CharactersView.prototype.resizeText = function() { this.view.resizeText(); }
CharactersView.prototype.show = function() { this.view.show(); }
CharactersView.prototype.hide = function() { this.view.hide(); }

CharactersView.prototype.resize = function() { this.view.resize(); }
CharactersView.prototype.resizeUI = function() { }

CharactersView.prototype.render = function(delta, stage) { 
    if (this.view.render(delta, stage)) {
        clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(delta, stage, stage.level.layers[i]); 
        clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        this.updateUI(stage);
        this.view.dirty = false;
    }
}

CharactersView.prototype.renderLayer = function(delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.view.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, this.view.width, this.view.height);
    
    var cx = this.view.width / 2;
    var cy = (this.view.height / 2);
    
    cy += 100 * this.playernum;
    
//    var pbox = {
//        "x" : cx - ((this.menubox.width * this.zoom) / 2),
//        "y" : cy - ((this.menubox.height * this.zoom) / 2),
//        "width" : this.menubox.width * this.zoom, 
//        "height" : this.menubox.height * this.zoom
//    }
    
    var pbox = {
        "x" : cx - ((this.menubox.width * this.zoom) / 2),
        "y" : cy,
        "width" : this.menubox.width * this.zoom, 
        "height" : this.menubox.height * this.zoom
    }
    var ptrans = translateItem(canvas.width, canvas.height, pbox, this.view.width, this.view.height);
    var x = this.menubox.x;
    var y = this.menubox.y;
    var pw = this.menubox.width * this.zoom;
    var ph = this.menubox.height * this.zoom;
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
    
    offset_y += 100;

    clearRect(ctx, 0, 0, canvas.width, canvas.height);
    if (layername == "players") {
        if (this.view.drawshadows) {
            ctx.shadowBlur = this.view.shadowblur;
            ctx.shadowColor = this.view.shadowcolor;    
            this.renderPlayers(delta, canvas, ctx, stage.players, dx, dy, offset_y, this.view.drawoutlines); 
            ctx.shadowBlur = 0;
        }
        this.renderPlayers(delta, canvas, ctx, stage.players, dx, dy, offset_y, this.view.drawoutlines); 
    }// else this.renderLayerItems(delta, canvas, ctx, stage.level, layer, dx, dy, offset_y); 
    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}

CharactersView.prototype.renderLayerItems = function(delta, canvas, ctx, level, layer, dx, dy, offset_y) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, level, layer, layer.items[i], dx, dy, offset_y);
}

CharactersView.prototype.renderLayerItem = function(delta, canvas, ctx, level, layer, item, dx, dy, offset_y) {
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
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, rtrans.height * layer.scale, level.itemrenderer, 1);
}

CharactersView.prototype.renderPlayers = function(delta, canvas, ctx, players, dx, dy, offset_y, outlines) { 
    if (players) for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (!player) continue;
        this.renderPlayer(delta, canvas, ctx, player, dx, dy, offset_y, outlines);
    }
}

CharactersView.prototype.renderPlayer = function(delta, canvas, ctx, player, dx, dy, offset_y, outlines) {
    var rel = translateRelative(player, dx, dy, this.zoom);
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.view.width, this.view.height);
    player.draw(ctx, rtrans.x, rtrans.y + offset_y, rtrans.width, rtrans.height, outlines, 1);
}

CharactersView.prototype.setMessage = function(message) { 
    this.view.setMessage(message);
}

CharactersView.prototype.updateUI = function(stage) {
    if (!this.view.updateUI()) return;
}