function LevelView(id) {
    this.view = new View(id, null, null);
    this.view.canvas_render.style.background = "white";
    this.view.canvas_render.className += " round-corners";
    this.view.renderdelay = 0;
}

LevelView.prototype.view;
LevelView.prototype.setLevel = function(level) { this.view.setLevel(level); }
LevelView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
LevelView.prototype.resizeText = function() { this.view.resizeText(); }
LevelView.prototype.show = function() { 
    this.resizeUI();
    this.view.show(); 
}
LevelView.prototype.hide = function() { this.view.hide(); }

LevelView.prototype.resize = function() { 
    this.view.resize(); 
    this.resizeUI();
}
LevelView.prototype.resizeUI = function() { this.view.resizeUI(); }

LevelView.prototype.render = function(delta, stage) {
    
    //if (stage.level.background && stage.level.background.color) this.view.canvas_render.style.background = stage.level.background.color;
    
    if (this.view.render(delta, stage)) {
        for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(delta, stage, stage.level.layers[i]);
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        this.updateUI();
        this.view.dirty = false;
    }
}

LevelView.prototype.renderLayer = function(delta, stage, layer) {
    if (layer.draw === false) return;
    var layername = layer.name;
    
    if (layername == "gradient") return;
    
    var c = this.view.canvas[layername];
    var canvas = c.canvas;
    var ctx = c.context;
    var view = getViewWindow(canvas, stage.level.width, stage.level.height);
    var dy = (canvas.height - view.height);                 
    if (layer.cache != false) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(delta, canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dy);
    } else {
        clearRect(ctx, 0, 0, canvas.width, canvas.height);
        this.renderLayerItems(delta, canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dy); 
    }
    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}

LevelView.prototype.renderLayerCache = function(delta, canvas, ctx, level, layer, view, width, height, dy) {
    var levelbox = {
        "x" : 0,
        "y" : 0,
        "width" : level.width,
        "height" : level.height
    };
    var trans = translateItem(view.width, view.height, levelbox, width, height);

    if (!this.view.dirty && layer.lastX == trans.x && layer.lastY == trans.y && layer.lastW == trans.width && layer.lastH == trans.height) return;
    
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

LevelView.prototype.renderLayerItems = function(delta, canvas, ctx, level, layer, view, width, height, dy) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, level, layer, layer.items[i], view, width, height, dy);
}

LevelView.prototype.renderLayerItem = function(delta, canvas, ctx, level, layer, item, view, width, height, dy) {
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

LevelView.prototype.renderPlayers = function(delta, canvas, ctx, players, view, width, height, dy) { 
    return;
}

LevelView.prototype.renderPlayer = function(delta, canvas, ctx, player, view, width, height, dy) {
    return;
}

LevelView.prototype.setMessage = function(message) { 
    this.view.setMessage(message);
}

LevelView.prototype.updateUI = function() {
    if (!this.view.updateUI()) return;
    //this.view.ui.setMessage("Ready");
}