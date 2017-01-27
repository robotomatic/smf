ViewRenderer = function() {
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
}

ViewRenderer.prototype.render = function(now, stage, canvas, ctx, width, height) {
    clearRect(ctx, 0, 0, canvas.width, canvas.height);
    this.mbr = this.camera.getView(now, this.mbr, width, height);
    var x = this.mbr.x;
    var y = this.mbr.y;
    var scale = width / this.mbr.width;
    var svw = canvas.width / scale;
    var dw = svw - this.mbr.width;
    if (dw) x = x - dw / 2;
    var svh = canvas.height / scale;
    var dh = svh - this.mbr.height;
    if (dh) y = y - dh / 2;
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, stage, stage.level.layers[i], canvas, ctx, x, y, scale); 
}

ViewRenderer.prototype.renderLayer = function(now, stage, layer, canvas, ctx, x, y, scale) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    if (layer.cache === true) {
        if (!stage.level.layerCache[layername]) stage.level.cacheLayer(layer);
        this.renderLayerCache(canvas, ctx, stage.level, layer, x, y, scale);
    } else {
        if (layername == "players") this.renderPlayers(now, ctx, stage, x, y, scale);
        else this.renderLayerItems(now, ctx, stage, layer, x, y, scale);
    }
}

ViewRenderer.prototype.renderPlayers = function(now, ctx, stage, x, y, scale) {
    if (!stage.players || !stage.players.players.length) return; 
    for (var i = 0; i < stage.players.players.length; i++) this.renderPlayer(now, ctx, stage.players.players[i], x, y, scale);
}

ViewRenderer.prototype.renderPlayer = function(now, ctx, player, x, y, scale) {
    var px = (player.x - x) * scale;
    var py = (player.y - y) * scale;
    var pw = player.width * scale;
    var ph = player.height * scale;
    player.draw(now, ctx, px, py, pw, ph, scale);            
}

ViewRenderer.prototype.renderLayerItems = function(now, ctx, stage, layer, x, y, scale) {
    if (!layer.items) return;
    for (var i = 0; i < layer.items.length; i++) {
        this.renderLayerItem(now, ctx, stage, layer, layer.items[i], x, y, scale);
        if (this.debug || stage.level.debug) this.renderLayerDebug(ctx, stage.level, layer, x, y, scale);
    }
}

ViewRenderer.prototype.renderLayerItem = function(now, ctx, stage, layer, item, x, y, scale) {
    if (item.draw == false) return;
    var level = stage.level;
    var ix = (item.x - x) * scale;
    var iy = (item.y - y) * scale;;
    var iw = item.width * scale;
    if (item.width === "100%") {
        ix = 0;
        iw = stage.level.width * scale;
    }
    var ih = item.height * scale;
    if (item.height === "100%") {
        iy = 0;
        ih = level.height * scale;
    }
    var cache = !layer.animate;
    layer.drawItem(ctx, item, ix, iy, iw, ih, level.itemrenderer, scale, cache);
}

ViewRenderer.prototype.renderLayerCache = function(canvas, ctx, level, layer, x, y, scale) {
    var ix = -x * scale;
    var iy = -y * scale;
    var iw = level.width * scale;
    if (layer.width === "100%") {
        iw = canvas.width;
        ix = 0;
    }
    var ih = level.height * scale;
    var img = level.layerCache[layer.name];
    ctx.drawImage(img, ix, iy, iw, ih);
}

ViewRenderer.prototype.renderLayerDebug = function(ctx, level, layer, x, y, scale) {

    var mbrx = (this.mbr.x - x) * scale;
    var mbry = (this.mbr.y - y) * scale;
    var mbrw = this.mbr.width * scale;
    var mbrh = this.mbr.height * scale;
    var r = new Rectangle(mbrx, mbry, mbrw, mbrh);
    r.drawOutline(ctx, "purple", 2);
    
    var svw = round(this.canvas_render.width / scale);
    var svh = round(this.canvas_render.height / scale);
    var message = "x: " + this.mbr.x + "\ny: " + this.mbr.y + "\nw: " + this.mbr.width + "\nh: " + this.mbr.height;
    message += "\n\nvw: " + svw + "\nvh: " + svh;
    message += "\n\ns: " + scale;
    var pad = 5 * scale;
    var top = (this.mbr.height / 2 - 20) * scale;
    drawText(ctx, message, "purple", mbrx + pad, mbry + (pad * 2) + top);

    return;
    
    if (!layer.playercollisions) return;
    for (var i = 0; i< layer.playercollisions.length; i++) {
        var collisions = layer.playercollisions[i];
        if (collisions) for (var ii = 0; ii < collisions.length; ii++) {
            var item = {
                x : collisions[ii].item.x,
                y : collisions[ii].item.y,
                width : collisions[ii].item.width,
                height : collisions[ii].item.height
            }
            var mx = item.x;
            var my = item.y;
            var mc = collisions[ii].item.collide;
            var mpx;
            var mpy;
            if (collisions[ii].part) {
                item.x += collisions[ii].part.x;
                item.y += collisions[ii].part.y;
                item.width = collisions[ii].part.width;
                item.height = collisions[ii].part.height;
                mpx = collisions[ii].part.x;
                mpy = collisions[ii].part.y;
                if (collisions[ii].part.collide) mc = collisions[ii].part.collide;
            }
            var ix = (item.x - x) * scale;
            var iy = item.y;
            iy = (iy - y) * scale;
            var itemx = ix;
            var itemwidth = item.width * scale;
            if (item.width === "100%") {
                itemx = 0;
                itemwidth = canvas.width;
            }
            var itemheight = item.height * scale;
            if (item.height === "100%") {
                itemy = 0;
                itemheight = level.height;
            }
            var itemy = iy;
            var box = {
                x : itemx,
                y: itemy,
                width : itemwidth,
                height: itemheight
            };
            drawShapeOutline(ctx, "red", item, itemx, itemy, itemwidth, itemheight, 2, 1, scale);
            var message = "x:" + mx + "\ny: " + my;
            if (mpx || mpy) message += "\npx:" + mpx + "\npy: " + mpy;
            if (mc) message += "\ncollide:" + mc;
            drawText(ctx, message, "red", itemx + itemwidth + pad, itemy + pad);
        }
    }
}