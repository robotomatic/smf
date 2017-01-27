function GameView(id, players, width, height) {
    this.id = id;
    this.players = players;
    this.width = width;
    this.height = height;
    this.parent = document.getElementById(this.id);
    this.canvas = new Array();
    this.layerCache = new Array();
    this.lastView = null;
}

GameView.prototype.setLevel = function(level) {
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]);
}

GameView.prototype.addLayer = function(layer) {
    var layername = layer.name;
    var c = document.createElement('canvas');
    c.id = layername;
    if (layer.cssblur) c.className += " " + layer.cssblur;
    this.parent.appendChild(c);
    var ctx = c.getContext("2d");
    this.canvas[layername] = {"canvas" : c, "context" : ctx};
}

GameView.prototype.resize = function() {
    var pw = this.parent.offsetWidth;
    var ph = this.parent.offsetHeight;
    for (var layername in this.canvas) {
        this.canvas[layername].canvas.width = pw;
        this.canvas[layername].canvas.height = ph;
    }
}

GameView.prototype.render = function(delta, stage) {

    var background = false;
    for (var i = 0; i < stage.level.layers.length; i++) {

        var layer = stage.level.layers[i];
        if (layer.draw === false) continue;

        var layername = layer.name;
        
        if (this.layerCache[layername]) {
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

        var tmbr = getMbr(stage.players);
        var viewBuffer = 1000 * (tmbr.width / stage.level.width);
        var mbr = getMbr(stage.players, viewBuffer);

        var mbr_x = mbr.x;
        var mbr_y = mbr.y;
        
        var mbr_w = mbr.width;
        var mbr_h = mbr.height;

        var zoom = (vtrans.width > vtrans.height) ? vtrans.height / mbr.height : vtrans.width / mbr.width;

        var nh = mbr.height * zoom;
        if (nh > vtrans.height) {
            var diff = vtrans.height / nh;
            mbr.x -= (mbr.width * diff) / 2;
            mbr.width *= diff;
            mbr.y -= (mbr.height * diff) / 2;
            mbr.height *= diff;
        }

        var nw = mbr.width * zoom;
        if (nw > vtrans.width) {
            var diff = vtrans.width / nw;
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

        var border_height = (canvas.height - vtrans.height) / 2;

        var diff_top = bounds_topy + bounds_height;
        var diff_height = canvas.height - diff_top - border_height;
        var diffbottom = diff_top + diff_height;

        /*
        this.ctx.fillStyle = "magenta";
        drawRect(this.ctx, 0, bounds_topy, this.canvas.width, bounds_height);            


        this.ctx.fillStyle = "yellow";
        drawRect(this.ctx, 0, diff_top, this.canvas.width, diff_height);            


        this.ctx.fillStyle = "lightgray";
        drawRect(this.ctx, 0, diff_top + diff_height, this.canvas.width, border_height);            
        */

        
        var dy = (diff_height > 0) ? diff_height : 0;

        // todo: add level layers
        // todo: add parallax to level layers
        // todo: stage renderer
        // todo: level renderer
        
        /*
        if (parallax) {
            var px = cx - mbr_x;
            var py = mbr_y - cy;
            mbr_x -= px;
            //mbr_y -= py / parallax;
        }
        */
        
        /*
        if (parallax) {
            var bg_px = (stage.level.width / 2) - (mbr_x + (mbr_w / 2));
            mbr_x -= bg_px * (parallax * scale);
            var bg_py = (stage.level.height / 2) - (mbr_y + (mbr_h / 2));
            mbr_y -= (bg_py / 2) * (parallax * scale);
        }
        */
        
        
        // todo: item renderer

        for (var ii = 0; ii < layer.items.length; ii++) {

            if (layer.items[ii].draw == false) continue;

            var item = layer.items[ii];
            var ix = (item.x - mbr_x) * scale;
            var iy = item.y;
            iy = (iy - mbr_y) * scale;
            iy += dy;
            var color;
            if (item.color) {
                if (item.color.gradient) {
                    var gradient = item.color.gradient;
                    var g = ctx.createLinearGradient(0, cmbrtrans.y + iy, 0, item.height * scale + (cmbrtrans.y + iy));
                    
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

            var itemx = cmbrtrans.x + ix;
            var itemwidth = item.width * scale;
            if (item.width === "100%") {
                itemx = 0;
                itemwidth = canvas.width;
            }

            var itemy = cmbrtrans.y + iy;
            
            drawRect(ctx, itemx, itemy, itemwidth * layerscale, (item.height * scale) * layerscale);            
        }

        /*
        this.ctx.fillStyle = "lightgray";
        drawRect(this.ctx, cmbrtrans.x, cmbrtrans.y, cmbrtrans.width, cmbrtrans.height);            
        */

        if (layername == "front") {
            for (var iii = 0; iii < stage.players.length; iii++) {
                var p = stage.players[iii];
                var px = (p.x - mbr_x) * scale;
                var py = p.y;
                py = (py - mbr_y) * scale;
                py += dy;
                p.draw(ctx, cmbrtrans.x + px, cmbrtrans.y + py, p.width * scale, p.height * scale);            
            }
        }
        
        
        if (layer.blur) blurCanvas(canvas, ctx, layer.blur * layerscale);
        
        //return;
 
        var dw = canvas.width - vtrans.width;
        var bw = dw / 2;
        clearRect(ctx, 0, 0, bw, canvas.height);        
        clearRect(ctx, bw + vtrans.width, 0, bw, canvas.height);        

        var dh = canvas.height - vtrans.height;
        var bh = dh / 2;
        clearRect(ctx, 0, 0, canvas.width, bh);        
        clearRect(ctx, 0, vtrans.height + bh, canvas.width, bh);        
        
        if (layer.cache === false) continue;
        this.layerCache[layername] = layer;
        
    }
}