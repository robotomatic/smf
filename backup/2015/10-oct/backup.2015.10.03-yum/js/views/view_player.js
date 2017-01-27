function PlayerView(id, player, width, height, zoom) {
    this.id = id;
    this.player = player;
    this.width = width;
    this.height = height;
    
    this.maxwidth = this.width;
    this.maxheight = this.height;

    this.maxwidth = 10000;
    this.maxheight = 10000;
    
    this.zoom = zoom ? zoom : 1;
    this.parent = document.getElementById(this.id);
    this.canvas = new Array();
    this.dirty = false;

    this.ui = null;
    this.uiready = false;
    this.dev = null;
    
    this.drawPlayerShadows = false;
    this.playerShadowBlur = 5;
    this.playerShadowColor = "#585858";
    
    this.canvas_buffer = document.createElement('canvas');
    this.ctx_buffer = this.canvas_buffer.getContext("2d");
    
    this.canvas_render = document.createElement('canvas');
    this.canvas_render.className = "fade-hide";
    this.ctx_render = this.canvas_render.getContext("2d");
    this.parent.appendChild(this.canvas_render);

    this.dorender = false;
    this.renderdelay = 1;
    this.last = timestamp();
    this.alpha = 0;
};

PlayerView.prototype.setLevel = function(level) { 
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]); 
    if (level.background && level.background.color) this.canvas_render.style.background = level.background.color;
}

PlayerView.prototype.addLayer = function(layer) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    this.canvas[layer.name] = {"canvas" : c, "context" : ctx};
}

PlayerView.prototype.resize = function() {
    
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

PlayerView.prototype.resizeUI = function() {
    if (this.ui) {
        var rect = this.canvas_render.getBoundingClientRect();
        var left = rect.left;
        var top = rect.top;
        var view = getViewWindow(this.canvas_render, this.width, this.height);
        var viewleft = (this.canvas_render.width - view.width) / 2;
        var viewtop = (this.canvas_render.height - view.height) / 2;
        var padleft = 15;
        var padtop = 0;
        var uileft = left + viewleft + padleft;
        var uitop = top + viewtop + padtop;
        var uiwidth = view.width - view.x;
        var uiheight = 100;
        this.ui.setLocation(uileft, uitop);
        //this.ui.setSize(uiwidth, uiheight);
        this.resizeText();
    }
}

PlayerView.prototype.resizeText = function() {
    var m = document.getElementById("game-text");
    if (!m) return;
    var p = m.parentNode;
    var pw = p.offsetWidth;
    var fs = Number(pw / 50);
    if (fs > 12) fs = 12;
    m.style.fontSize = fs + "px";
}

PlayerView.prototype.show = function() {
    this.resizeUI();
    fadeIn(this.canvas_render);
}

PlayerView.prototype.hide = function() { 
    fadeOut(this.canvas_render);
    fadeOut(this.ui.getUI());
}

PlayerView.prototype.render = function(delta, stage) { 
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
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(delta, stage, stage.level.layers[i]); 
    this.ctx_render.drawImage(this.canvas_buffer, 0, 0);
    this.updateUI();
    if (this.dev) this.dev.update();
    this.dirty = false;
}

PlayerView.prototype.renderLayer = function(delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, this.width, this.height);
    var cx = this.width / 2;
    var cy = (this.height / 2);
    var pbox = {
        "x" : cx - ((this.player.width * this.zoom) / 2),
        "y" : cy - ((this.player.height * this.zoom) / 2),
        "width" : this.player.width * this.zoom, 
        "height" : this.player.height * this.zoom
    }
    var ptrans = translateItem(canvas.width, canvas.height, pbox, this.width, this.height);
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
    var bounds_trans = translateItem(canvas.width, canvas.height, bounds_rel, this.width, this.height);
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
            if (this.drawPlayerShadows) {
                ctx.shadowBlur = this.playerShadowBlur;
                ctx.shadowColor = this.playerShadowColor;    
                this.renderPlayers(delta, canvas, ctx, stage.players, dx, dy, offset_y); 
                this.player.draw(ctx, ptrans.x * layer.scale, (ptrans.y + offset_y) * layer.scale, ptrans.width * layer.scale, ptrans.height * layer.scale);            
                ctx.shadowBlur = 0;
            }
        } else this.renderLayerItems(delta, canvas, ctx, stage.level, layer, dx, dy, offset_y); 
        if (layer.blur) blurCanvas(canvas, ctx, layer.blur);
    }
    this.clearViewEdges(ctx, canvas, view);
    this.ctx_buffer.drawImage(canvas, 0, 0);
}

PlayerView.prototype.renderLayerCache = function(delta, canvas, ctx, view, level, layer, dx, dy, offset_y) {
    if (!this.dirty && layer.lastX == dx && layer.lastY == dy && layer.lastW == view.width && layer.lastH == view.height) return;
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
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.width, this.height);
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

PlayerView.prototype.renderPlayers = function(delta, canvas, ctx, players, dx, dy, offset_y) { 
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player===this.player) continue;
        this.renderPlayer(delta, canvas, ctx, player, dx, dy, offset_y);
    }
}

PlayerView.prototype.renderPlayer = function(delta, canvas, ctx, player, dx, dy, offset_y) {
    var rel = translateRelative(player, dx, dy, this.zoom);
    var rtrans = translateItem(canvas.width, canvas.height, rel, this.width, this.height);
    player.draw(ctx, rtrans.x, rtrans.y + offset_y, rtrans.width, rtrans.height);
}

PlayerView.prototype.clearViewEdges = function(ctx, canvas, view) {
    var bw = (canvas.width - view.width) / 2;
    clearRect(ctx, 0, 0, bw, canvas.height);        
    clearRect(ctx, bw + view.width, 0, bw, canvas.height);        
    var bh = (canvas.height - view.height) / 2;
    clearRect(ctx, 0, 0, canvas.width, bh);        
    clearRect(ctx, 0, view.height + bh, canvas.width, bh);        
}

PlayerView.prototype.updateUI = function() {
    if (this.aplha < 0) return;
    if (!this.uiready) {
        this.ui = new UI(document.getElementById("game-ui"));
        this.resizeUI();
        fadeIn(this.ui.getUI());
        this.uiready = true;
    }
    this.ui.setMessage(this.player.character.name);
}