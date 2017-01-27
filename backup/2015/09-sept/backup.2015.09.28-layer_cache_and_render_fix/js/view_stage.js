function StageView(id, dev) {
    this.id = id;
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
    
    this.canvas_buffer = document.createElement('canvas');
    this.ctx_buffer = this.canvas_buffer.getContext("2d");
    
    this.canvas_render = document.createElement('canvas');
    this.ctx_render = this.canvas_render.getContext("2d");
    this.parent.appendChild(this.canvas_render);
}

StageView.prototype.setLevel = function(level) { 
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]); 
    if (level.background && level.background.color) this.canvas_render.style.background = level.background.color;
}

StageView.prototype.addLayer = function(layer) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    this.canvas[layer.name] = {"canvas" : c, "context" : ctx};
}

StageView.prototype.resize = function() {
    var pw = this.parent.offsetWidth;
    var ph = this.parent.offsetHeight;
    for (var layername in this.canvas) {
        this.canvas[layername].canvas.width = pw;
        this.canvas[layername].canvas.height = ph;
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

StageView.prototype.render = function(delta, stage) { 
    for (var i = 0; i < stage.level.layers.length; i++) {
        var layer = stage.level.layers[i];
        if (layer.draw === false) continue;
        var layername = layer.name;
        var c = this.canvas[layername];
        var canvas = c.canvas;
        var ctx = c.context;
        var view = getViewWindow(canvas, stage.level.width, stage.level.height);
        var dy = (canvas.height - view.height);                 
        if (layer.cache != false) {
            if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
            this.renderLayerCache(delta, canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dy);
        } else {
            clearRect(ctx, 0, 0, canvas.width, canvas.height);
            if (layername == "players") this.renderPlayers(delta, canvas, ctx, stage.players, view, stage.level.width, stage.level.height, dy); 
            else if (layername == "players-shadows") {
                if (this.drawPlayerShadows) {
                    ctx.shadowBlur = this.playerShadowBlur;
                    ctx.shadowColor = this.playerShadowColor;
                    this.renderPlayers(delta, canvas, ctx, stage.players, view, stage.level.width, stage.level.height, dy); 
                    ctx.shadowBlur = 0;
                }
            } else this.renderLayerItems(delta, canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dy); 
        }
        this.ctx_buffer.drawImage(canvas, 0, 0);
    }
    this.ctx_render.drawImage(this.canvas_buffer, 0, 0);
    if (this.dev) this.dev.update();
    this.dirty = false;
}

StageView.prototype.renderLayerCache = function(delta, canvas, ctx, level, layer, view, width, height, dy) {
    var levelbox = {
        "x" : 0,
        "y" : 0,
        "width" : level.width,
        "height" : level.height
    };
    var trans = translateItem(view.width, view.height, levelbox, width, height);

    if (!this.dirty && layer.lastX == trans.x && layer.lastY == trans.y && layer.lastW == trans.width && layer.lastH == trans.height) return;
    layer.lastX = trans.x;
    layer.lastY = trans.y;
    layer.lastW = trans.width;
    layer.lastH = trans.height;

    clearRect(ctx, 0, 0, canvas.width, canvas.height);

    var itemx = trans.x;
    var itemwidth = trans.width;
    if (layer.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    
    var itemy = trans.y + dy;
    var img = level.layerCache[layer.name];
    
    var layerscale = 1;
    
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, trans.height * layerscale); 
}

StageView.prototype.renderLayerItems = function(delta, canvas, ctx, level, layer, view, width, height, dy) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, level, layer, layer.items[i], view, width, height, dy);
}

StageView.prototype.renderLayerItem = function(delta, canvas, ctx, level, layer, item, view, width, height, dy) {
    if (item.draw == false) return;
    var trans = translateItem(view.width, view.height, item, width, height);
    var itemx = trans.x;
    var itemwidth = trans.width;
    if (item.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    var itemy = trans.y + dy;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, trans.height * layer.scale, level.itemrenderer); 
}

StageView.prototype.renderPlayers = function(delta, canvas, ctx, players, view, width, height, dy) { 
    for (var i = 0; i < players.length; i++) this.renderPlayer(delta, canvas, ctx, players[i], view, width, height, dy);
}

StageView.prototype.renderPlayer = function(delta, canvas, ctx, player, view, width, height, dy) {
    var ptrans = translateItem(view.width, view.height, player, width, height);
    player.draw(ctx, ptrans.x, ptrans.y + dy, ptrans.width, ptrans.height);    
}