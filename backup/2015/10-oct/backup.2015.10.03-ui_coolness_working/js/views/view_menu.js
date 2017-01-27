function MenuView(id, menubox, width, height, zoom) {
    this.id = id;
    this.menubox = menubox;
    this.width = width;
    this.height = height;
    this.maxwidth = this.width;
    this.maxheight = this.height;
    this.zoom = zoom ? zoom : 1;
    this.parent = document.getElementById(this.id);
    this.canvas = new Array();
    this.dirty = false;

    this.ui = null;
    this.dev = null;
    
    this.drawPlayerShadows = true;
    this.playerShadowBlur = 5;
    this.playerShadowColor = "#585858";
    
    this.canvas_buffer = document.createElement('canvas');
    this.ctx_buffer = this.canvas_buffer.getContext("2d");
    
    this.canvas_render = document.createElement('canvas');
    this.canvas_render.className = "fade-hide";
    this.ctx_render = this.canvas_render.getContext("2d");
    this.parent.appendChild(this.canvas_render);

    this.dorender = false;
    this.renderdelay = 0;
    this.last = timestamp();
    this.alpha = 0;
    
    this.currentchar = 0;
};

MenuView.prototype.setUI = function(ui) { 
    this.ui = ui; 
    this.parent.appendChild(ui.getUI());
    this.ui.namebox = document.getElementById("menu-canvas-text");
}

MenuView.prototype.setDevTools = function(dev) { 
    return;
    this.dev = dev; 
    this.parent.appendChild(dev.getUI());
}

MenuView.prototype.setLevel = function(level) { 
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]); 
    if (level.background && level.background.color) this.canvas_render.style.background = level.background.color;
}

MenuView.prototype.addLayer = function(layer) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    this.canvas[layer.name] = {"canvas" : c, "context" : ctx};
}

MenuView.prototype.resize = function() {
    var pw = this.parent.offsetWidth;
    var ph = this.parent.offsetHeight;
    for (var layername in this.canvas) {
        this.canvas[layername].canvas.width = (pw > this.maxwidth) ? this.maxwidth : pw;
        this.canvas[layername].canvas.height = (ph > this.maxheight) ? this.maxheight : ph;
        var dx = pw - this.canvas[layername].canvas.width;
        var dy = ph - this.canvas[layername].canvas.height;
        this.canvas[layername].canvas.style.left = (dx / 2) + "px";
        this.canvas[layername].canvas.style.top = (dy / 2) + "px";
    }
    this.canvas_buffer.width = (pw > this.maxwidth) ? this.maxwidth : pw;
    this.canvas_buffer.height = (ph > this.maxheight) ? this.maxheight : ph;
    this.canvas_render.width = (pw > this.maxwidth) ? this.maxwidth : pw;
    this.canvas_render.height = (ph > this.maxheight) ? this.maxheight : ph;
    var px = pw - this.canvas_render.width;
    var py = ph - this.canvas_render.height;
    var diff = (pw > ph) ? pw / this.canvas_render.width : ph / this.canvas_render.height;
    var pad = diff - (diff / 20);
    //this.canvas_render.style.webkitTransform = "scale(" + pad + ")";
    this.canvas_render.style.left = (px / 2) + "px";
    this.canvas_render.style.top = (py / 2) + "px";
    this.resizeUI();
    this.dirty = true;
}

MenuView.prototype.resizeUI = function() {
    if (this.ui) {
        var width = this.canvas_render.width;
        var height = this.canvas_render.height;
        this.ui.setSize(width, height);
    }
}

MenuView.prototype.show = function() { 
    fadeIn(this.canvas_render);
    fadeIn(this.ui.getUI());
}

MenuView.prototype.hide = function() { 
    fadeOut(this.canvas_render);
    fadeOut(this.ui.getUI());
}

MenuView.prototype.render = function(delta, stage) { 
    if (!this.dorender) {
        var now = timestamp();
        var dt = (now - this.last) / 1000;
        if (dt < this.renderdelay) return;
        this.dorender = true;
        this.last = now;
    }
    if (this.alpha < 1) {
        this.ctx_render.globalAlpha = this.alpha;
        this.alpha += .01;
    }
    clearRect(this.ctx_buffer, 0, 0, this.canvas_buffer.width, this.canvas_buffer.height);
    clearRect(this.ctx_render, 0, 0, this.ctx_render.width, this.ctx_render.height);
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(delta, stage, stage.level.layers[i]); 
    this.ctx_render.drawImage(this.canvas_buffer, 0, 0);
    this.showPlayerInfo(stage);
    if (this.dev) this.dev.update();
    this.dirty = false;
}

MenuView.prototype.showPlayerInfo = function(stage) { 
    if (stage.npcs) if (stage.npcs.npcs[stage.npcs.currentnpc]) this.ui.namebox.innerHTML = stage.npcs.npcs[stage.npcs.currentnpc].player.name;
}
    
MenuView.prototype.renderLayer = function(delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, this.width, this.height);
    var cx = this.width / 2;
    var cy = (this.height / 2);
    var pbox = {
        "x" : cx - ((this.menubox.width * this.zoom) / 2),
        "y" : cy - ((this.menubox.height * this.zoom) / 2),
        "width" : this.menubox.width * this.zoom, 
        "height" : this.menubox.height * this.zoom
    }
    var ptrans = translateItem(canvas.width, canvas.height, pbox, this.width, this.height);
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
    var bounds_trans = translateItem(canvas.width, canvas.height, bounds_rel, this.width, this.height);
    var bounds_bottom_y = bounds_trans.y + bounds_trans.height;
    var border_height = (canvas.height - view.height)  / 2;
    var border_top = view.height + border_height;
    var height_diff = border_top - bounds_bottom_y;
    var offset_y = (height_diff > 0) ? height_diff : 0;
    
    offset_y += 44;

    clearRect(ctx, 0, 0, canvas.width, canvas.height);
    if (layername == "players") {
        this.renderPlayers(delta, canvas, ctx, stage.players, dx, dy, offset_y); 
    } else if (layername == "players-shadows") {
        if (this.drawPlayerShadows) {
            ctx.shadowBlur = this.playerShadowBlur;
            ctx.shadowColor = this.playerShadowColor;    
            this.renderPlayers(delta, canvas, ctx, stage.players, dx, dy, offset_y); 
            ctx.shadowBlur = 0;
        }
    } else this.renderLayerItems(delta, canvas, ctx, stage.level, layer, dx, dy, offset_y); 
    this.ctx_buffer.drawImage(canvas, 0, 0);
}

MenuView.prototype.renderLayerItems = function(delta, canvas, ctx, level, layer, dx, dy, offset_y) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, level, layer, layer.items[i], dx, dy, offset_y);
}

MenuView.prototype.renderLayerItem = function(delta, canvas, ctx, level, layer, item, dx, dy, offset_y) {
    if (item.draw == false) return;
    var rel = translateRelative(item, dx, dy, this.zoom);
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.width, this.height);
    var itemx = rtrans.x;
    var itemwidth = rtrans.width;
    if (item.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    var itemy = rtrans.y + offset_y;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, rtrans.height * layer.scale, level.itemrenderer);
}

MenuView.prototype.renderPlayers = function(delta, canvas, ctx, players, dx, dy, offset_y) { 
    if (players) for (var i = 0; i < players.length; i++) {
        var player = players[i];
        this.renderPlayer(delta, canvas, ctx, player, dx, dy, offset_y);
    }
}

MenuView.prototype.renderPlayer = function(delta, canvas, ctx, player, dx, dy, offset_y) {
    var rel = translateRelative(player, dx, dy, this.zoom);
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.width, this.height);
    player.draw(ctx, rtrans.x, rtrans.y + offset_y, rtrans.width, rtrans.height);
}