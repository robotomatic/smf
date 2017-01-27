function GameView(id, players, width, height, dev) {
    this.id = id;
    this.players = players;
    this.width = width;
    this.height = height;
    this.maxwidth = this.width;
    this.maxheight = this.height;
    this.parent = document.getElementById(this.id);
    if (dev) {
        this.dev = dev;
        this.parent.appendChild(dev.getUI());
    }
    this.canvas = new Array();
    this.dirty = false;

    this.drawPlayerShadows = false;
    this.playerShadowBlur = 2;
    this.playerShadowColor = "#585858";
    
    this.lastView = null;

    this.canvas_buffer = document.createElement('canvas');
    this.ctx_buffer = this.canvas_buffer.getContext("2d");
    
    this.canvas_render = document.createElement('canvas');
    this.ctx_render = this.canvas_render.getContext("2d");
    this.parent.appendChild(this.canvas_render);
}

GameView.prototype.setLevel = function(level) { 
    this.canvas = new Array();
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]); 
    if (level.background && level.background.color) this.canvas_render.style.background = level.background.color;
}

GameView.prototype.addLayer = function(layer) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    this.canvas[layer.name] = {"canvas" : c, "context" : ctx};
}

GameView.prototype.resize = function() {
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
    this.canvas_render.style.webkitTransform = "scale(" + pad + ")";
    this.canvas_render.style.left = (px / 2) + "px";
    this.canvas_render.style.top = (py / 2) + "px";
    this.dirty = true;
}

GameView.prototype.render = function(delta, stage) { 
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(delta, stage, stage.level.layers[i]); 
    this.ctx_render.drawImage(this.canvas_buffer, 0, 0);
    if (this.dev) this.dev.update();
    this.dirty=false;
}

GameView.prototype.renderLayer = function(delta, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    var c = this.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, this.width, this.height);
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
            if (this.drawPlayerShadows) {
                ctx.shadowBlur = this.playerShadowBlur;
                ctx.shadowColor = this.playerShadowColor;    
                this.renderPlayers(delta, ctx, stage, cmbrtrans, mbr_x, mbr_y, scale, dy);
                ctx.shadowBlur = 0;
            }
        } else this.renderLayerItems(delta, canvas, ctx, cmbrtrans, stage.level, layer, mbr_x, mbr_y, scale, dy);
    }
    this.clearViewEdges(ctx, canvas, view);
    this.ctx_buffer.drawImage(canvas, 0, 0);
}
    
GameView.prototype.renderLayerCache = function(delta, canvas, ctx, view, level, layer, mbrx, mbry, scale, dy) {
    if (!this.dirty && layer.lastX == mbrx && layer.lastY == mbry && layer.lastW == view.width && layer.lastH == view.height) return;
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

GameView.prototype.renderLayerItems = function(delta, canvas, ctx, view, level, layer, mbrx, mbry, scale, dy) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, view, level, layer, layer.items[i], mbrx, mbry, scale, dy);
}

GameView.prototype.renderLayerItem = function(delta, canvas, ctx, view, level, layer, item, mbrx, mbry, scale, dy) {
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

GameView.prototype.renderPlayers = function(delta, ctx, stage, view, mbrx, mbry, scale, dy) {
    for (var i = 0; i < stage.players.length; i++) this.renderPlayer(delta, ctx, stage.players[i], view, mbrx, mbry, scale, dy);
}

GameView.prototype.renderPlayer = function(delta, ctx, player, view, mbrx, mbry, scale, dy) {
    var px = (player.x - mbrx) * scale;
    var py = player.y;
    py = (py - mbry) * scale;
    py += dy;
    player.draw(ctx, view.x + px, view.y + py, player.width * scale, player.height * scale);            
}

GameView.prototype.clearViewEdges = function(ctx, canvas, view) {
    var bw = (canvas.width - view.width) / 2;
    clearRect(ctx, 0, 0, bw, canvas.height);        
    clearRect(ctx, bw + view.width, 0, bw, canvas.height);        
    var bh = (canvas.height - view.height) / 2;
    clearRect(ctx, 0, 0, canvas.width, bh);        
    clearRect(ctx, 0, view.height + bh, canvas.width, bh);        
}