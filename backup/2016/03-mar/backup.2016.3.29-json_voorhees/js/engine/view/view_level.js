"use strict";

function LevelView(id) {
    this.view = new View(id);
    this.view.canvas_render.style.background = "white";
    this.view.canvas_render.className += " round-corners";
    this.view.renderdelay = 0;
}

LevelView.prototype.view;
LevelView.prototype.setLevel = function(level) { 
    level.background = "";
    this.view.setLevel(level); 
}
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

LevelView.prototype.update = function(now, stage) {
    this.view.update(now, stage);
}

LevelView.prototype.render = function(now, stage) {
    if (!this.view.render(now, stage)) return;
    clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, stage, stage.level.layers[i]);
    clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
    this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
    this.updateUI();
    this.view.dirty = false;
}

LevelView.prototype.renderLayer = function(now, stage, layer) {
    if (layer.draw === false) return;
    var layername = layer.name;
    
    if (layer.preview == false) {
        layer.items[0].itemtype = "";
        layer.items[0].color = "white";
    }
    
    var canvas = this.view.canvas_buffer;
    var ctx = this.view.ctx_buffer;

    
    var view = getViewWindow(canvas, stage.level.width, stage.level.height);
    var dx = (canvas.width - view.width) / 2;                 
    var dy = (canvas.height - view.height);                 
    if (layer.cache != false) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dx, dy);
    } else {
        this.renderLayerItems(canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dx, dy); 
    }
}

LevelView.prototype.renderLayerCache = function(canvas, ctx, level, layer, view, width, height, dx, dy) {
    var levelbox = {
        "x" : 0,
        "y" : 0,
        "width" : level.width,
        "height" : level.height
    };
    var trans = translateItem(view.width, view.height, levelbox, width, height);

    layer.lastX = trans.x;
    layer.lastY = trans.y;
    layer.lastW = trans.width;
    layer.lastH = trans.height;

    var itemx = trans.x + dx;
    var itemwidth = trans.width;
    if (layer.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    var itemheight = trans.height;
    if (layer.height == "100%") {
        itemy = 0;
        itemwheight = layer.height;
    }
    
    var itemy = trans.y + dy;
    var img = level.layerCache[layer.name];
    
    var layerscale = 1;
    
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, itemheight * layerscale); 
}

LevelView.prototype.renderLayerItems = function(canvas, ctx, level, layer, view, width, height, dx, dy) {
    if (layer.items) for (var i = 0; i < layer.items.length; i++) this.renderLayerItem(canvas, ctx, level, layer, layer.items[i], view, width, height, dx, dy);
}

LevelView.prototype.renderLayerItem = function(canvas, ctx, level, layer, item, view, width, height, dx, dy) {

    if (item.draw == false) return;
    
    if (!item.width || !item.height) {
        var mbr = item.getMbr();
        item.width = mbr.width;
        item.height = mbr.height;
    }
    
    var trans = new Rectangle(item.x, item.y, item.width, item.height);
    trans =  translateItem(view.width, view.height, trans, width, height);
    var itemx = trans.x + dx;
    var itemwidth = trans.width;
    if (item.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    
    var itemheight = trans.height;
    if (item.height == "100%") {
        itemy = 0;
        itemheight = level.height;
    }
    var itemy = trans.y + dy;
    
    var scale = (trans.width) ? trans.width / item.width : trans.height / item.height ;

    var cache = !layer.animate;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, itemheight * layer.scale, level.itemrenderer, scale, cache); 
}

LevelView.prototype.setMessage = function(message) { 
//    this.view.setMessage(message);
}

LevelView.prototype.updateUI = function() {
//    if (!this.view.updateUI()) return;
//    //this.view.ui.setMessage("Ready");
}