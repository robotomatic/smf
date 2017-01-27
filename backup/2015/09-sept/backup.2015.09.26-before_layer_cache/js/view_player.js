function PlayerView(id, player, width, height, zoom) {
    this.id = id;
    this.player = player;
    this.width = width;
    this.height = height;
    this.zoom = zoom ? zoom : 1;
    this.parent = document.getElementById(this.id);
    this.canvas = new Array();
    this.layerCache = new Array();
};

PlayerView.prototype.setLevel = function(level) {
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]);
}

PlayerView.prototype.addLayer = function(layer) {
    var layername = layer.name;
    var c = document.createElement('canvas');
    c.id = layername;
    if (layer.cssblur) c.className += " " + layer.cssblur;
    this.parent.appendChild(c);
    var ctx = c.getContext("2d");
    this.canvas[layername] = {"canvas" : c, "context" : ctx};
}

PlayerView.prototype.resize = function() {
    var pw = this.parent.offsetWidth;
    var ph = this.parent.offsetHeight;
    for (var layername in this.canvas) {
        this.canvas[layername].canvas.width = pw;
        this.canvas[layername].canvas.height = ph;
    }
}

PlayerView.prototype.render = function(delta, stage) {
    
    var background = false;
    for (var i = 0; i < stage.level.layers.length; i++) {

        var layer = stage.level.layers[i];
        if (layer.draw === false) continue;

        var layername = layer.name;
        
        if (this.layerCache[layername]) {
            //console.log(layername);
            //drawLayer(layerCache[layername]);
            continue;
        }
        
        var layerscale = layer.scale ? layer.scale : 1;
        var lighten = layer.lighten ? layer.lighten : 0;
        var parallax = layer.parallax ? layer.parallax : 0;
    
        var c = this.canvas[layername];
        var canvas = c.canvas;
        var ctx = c.context;

        clearRect(ctx, 0, 0, canvas.width, canvas.height);

        if (!background && stage.level.background) {
            background = true;
            if (stage.level.background.color) {
                ctx.fillStyle = stage.level.background.color;
                drawRect(ctx, 0, 0, canvas.width, canvas.height);            
            }
        }

        var vbox = {
            "x" : 0,
            "y" : 0,
            "width" : this.width, 
            "height" : this.height
        }
        var vtrans = translateItem(canvas.width, canvas.height, vbox, this.width, this.height);

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

        /*
        if (parallax) {
            var bg_px = (stage.level.width / 2) - (this.player.x + (this.player.width / 2));
            dx += bg_px * parallax;
            var bg_py = (stage.level.height / 2) - (this.player.y + (this.player.height / 2));
            //dy -= (bg_py / 2) * parallax;
        }
        */

        var bounds = {
            "x" : 0,
            "y" : 0,
            "width" : stage.level.width,
            "height" : stage.level.height
        }
        var bounds_rel = translateRelative(bounds, dx, dy, this.zoom);
        var bounds_trans = translateItem(canvas.width, canvas.height, bounds_rel, this.width, this.height);
        var bounds_bottom_y = bounds_trans.y + bounds_trans.height;
        var border_height = (canvas.height - vtrans.height)  / 2;
        var border_top = vtrans.height + border_height;
        var height_diff = border_top - bounds_bottom_y;
        var offset_y = (height_diff > 0) ? height_diff : 0;

        for (var ii = 0; ii < layer.items.length; ii++) {

            // todo: need to tell if item is in view

            var item = layer.items[ii];
            if (item.draw == false) continue;

            var rel = translateRelative(item, dx, dy, this.zoom);
            var rtrans = translateItem(canvas.width, canvas.height, rel, this.width, this.height);

            var color;
            if (item.color) {
                if (item.color.gradient) {
                    var gradient = item.color.gradient;
                    var g = ctx.createLinearGradient(0, rtrans.y + offset_y, 0, rtrans.height + rtrans.y + offset_y);
                    
                    var start = gradient.start;
                    var stop = gradient.stop;
                    if (lighten) {
                        start = lightenColor(start, lighten);
                        stop = lightenColor(stop, lighten);
                    }
                    
                    g.addColorStop(0, start);
                    g.addColorStop(1, stop);
                    color = g;
                } else {
                    color = item.color;
                    if (lighten) color = lightenColor(color, lighten);
                }
            } else {
                color = "#A3B5A3";
                if (lighten) color = lightenColor(color, lighten);
            }
            
            ctx.fillStyle = color;

            var itemx = rtrans.x;
            var itemwidth = rtrans.width;
            if (item.width == "100%") {
                itemx = 0;
                itemwidth = canvas.width;
            }
            var itemy = rtrans.y + offset_y;
            
            drawRect(ctx, itemx, itemy, itemwidth * layerscale, rtrans.height * layerscale);        
        }
        
        if (layername == "front") {
            for (var iii = 0; iii < stage.players.length; iii++) {
                var opponent = stage.players[iii];
                if (opponent===this.player) continue;

                // todo: need to tell if item is in view

                var rel = translateRelative(opponent, dx, dy, this.zoom);
                var rtrans = translateItem(canvas.width, canvas.height, rel, this.width, this.height);
                opponent.draw(ctx, rtrans.x, rtrans.y + offset_y, rtrans.width, rtrans.height);
            }

            this.player.draw(ctx, ptrans.x * layerscale, (ptrans.y + offset_y) * layerscale, ptrans.width * layerscale, ptrans.height * layerscale);            
        }

        if (layer.blur) blurCanvas(canvas, ctx, layer.blur * layerscale);
        
        var dw = canvas.width - vtrans.width;
        var bw = dw / 2;
        clearRect(ctx, 0, 0, bw, canvas.height);        
        clearRect(ctx, bw + vtrans.width, 0, bw, canvas.height);        

        var dh = canvas.height - vtrans.height;
        var bh = dh / 2;
        clearRect(ctx, 0, 0, canvas.width, bh);        
        clearRect(ctx, 0, vtrans.height + bh, canvas.width, bh);        

        if (!layer.cache) continue;
 
        this.layerCache[layername] = layer;
        console.log(layername);
        
    }
}