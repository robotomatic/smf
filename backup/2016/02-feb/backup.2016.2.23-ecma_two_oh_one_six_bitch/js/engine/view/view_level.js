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

LevelView.prototype.update = function(now, delta, stage) {
    this.view.update(now, delta, stage);
}

LevelView.prototype.render = function(now, delta, stage) {
    if (this.view.render(now, delta, stage)) {
        clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        for (let i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, delta, stage, stage.level.layers[i]);
        clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        this.updateUI();
        this.view.dirty = false;
    }
}

LevelView.prototype.renderLayer = function(now, delta, stage, layer) {
    if (layer.draw === false) return;
    let layername = layer.name;
    
    if (layer.preview == false) {
        layer.items[0].itemtype = "";
        layer.items[0].color = "white";
    }
    
//    let c = this.view.canvas[layername];
//    let canvas = c.canvas;
//    let ctx = c.context;
    
    let canvas = this.view.canvas_buffer;
    let ctx = this.view.ctx_buffer;
    

    
    let view = getViewWindow(canvas, stage.level.width, stage.level.height);
    let dx = (canvas.width - view.width) / 2;                 
    let dy = (canvas.height - view.height);                 
    if (layer.cache != false) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(delta, canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dx, dy);
    } else {
//        clearRect(ctx, 0, 0, canvas.width, canvas.height);
        this.renderLayerItems(delta, canvas, ctx, stage.level, layer, view, stage.level.width, stage.level.height, dx, dy); 
        //if (layer.blur) blurCanvas(canvas, ctx, layer.blur);
    }
//    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}

LevelView.prototype.renderLayerCache = function(delta, canvas, ctx, level, layer, view, width, height, dx, dy) {
    let levelbox = {
        "x" : 0,
        "y" : 0,
        "width" : level.width,
        "height" : level.height
    };
    let trans = translateItem(view.width, view.height, levelbox, width, height);

//    if (!this.view.dirty && layer.lastX == trans.x && layer.lastY == trans.y && layer.lastW == trans.width && layer.lastH == trans.height) return;
    
    layer.lastX = trans.x;
    layer.lastY = trans.y;
    layer.lastW = trans.width;
    layer.lastH = trans.height;

//    clearRect(ctx, 0, 0, canvas.width, canvas.height);

    let itemx = trans.x + dx;
    let itemwidth = trans.width;
    if (layer.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    let itemheight = trans.height;
    if (layer.height == "100%") {
        itemy = 0;
        itemwheight = layer.height;
    }
    
    let itemy = trans.y + dy;
    let img = level.layerCache[layer.name];
    
    let layerscale = 1;
    
    ctx.drawImage(img, itemx, itemy, itemwidth * layerscale, itemheight * layerscale); 
}

LevelView.prototype.renderLayerItems = function(delta, canvas, ctx, level, layer, view, width, height, dx, dy) {
    if (layer.items) for (let i = 0; i < layer.items.length; i++) this.renderLayerItem(delta, canvas, ctx, level, layer, layer.items[i], view, width, height, dx, dy);
}

LevelView.prototype.renderLayerItem = function(delta, canvas, ctx, level, layer, item, view, width, height, dx, dy) {

    if (item.draw == false) return;
    
    if (!item.width || !item.height) {
        let mbr = item.getMbr();
        item.width = mbr.width;
        item.height = mbr.height;
    }
    
    let trans = new Rectangle(item.x, item.y, item.width, item.height);
    trans =  translateItem(view.width, view.height, trans, width, height);
    let itemx = trans.x + dx;
    let itemwidth = trans.width;
    if (item.width == "100%") {
        itemx = 0;
        itemwidth = canvas.width;
    }
    
    let itemheight = trans.height;
    if (item.height == "100%") {
        itemy = 0;
        itemheight = level.height;
    }
    let itemy = trans.y + dy;
    
    let scale = (trans.width) ? trans.width / item.width : trans.height / item.height ;

    let cache = !layer.animate;
    layer.drawItem(ctx, item, itemx, itemy, itemwidth * layer.scale, itemheight * layer.scale, level.itemrenderer, scale, cache); 
}

LevelView.prototype.setMessage = function(message) { 
//    this.view.setMessage(message);
}

LevelView.prototype.updateUI = function() {
//    if (!this.view.updateUI()) return;
//    //this.view.ui.setMessage("Ready");
}