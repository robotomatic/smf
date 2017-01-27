function StageView(id) {
    this.id = id;
    this.parent = document.getElementById(this.id);
    this.canvas = new Array();
    this.layerCache = new Array();
}

StageView.prototype.setLevel = function(level) {
    if (level.layers && level.layers.length) for (var i = 0; i < level.layers.length; i++) this.addLayer(level.layers[i]);
}

StageView.prototype.addLayer = function(layer) {
    var layername = layer.name;
    var c = document.createElement('canvas');
    c.id = layername;
    if (layer.cssblur) c.className += " " + layer.cssblur;
    this.parent.appendChild(c);
    var ctx = c.getContext("2d");
    this.canvas[layername] = {"canvas" : c, "context" : ctx};
}

StageView.prototype.resize = function() {
    var pw = this.parent.offsetWidth;
    var ph = this.parent.offsetHeight;
    for (var layername in this.canvas) {
        this.canvas[layername].canvas.width = pw;
        this.canvas[layername].canvas.height = ph;
    }
}

StageView.prototype.render = function(delta, stage) {
    
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
            "width" : stage.level.width, 
            "height" : stage.level.height
        }
        var vtrans = translateItem(canvas.width, canvas.height, vbox, stage.level.width, stage.level.height);

        /*
        var mbr = getMbr(stage.players);
        var smbr = makeSquare(mbr);
        smbr["color"] = "yellow";
        this.renderStageItem(smbr, stage);
        mbr["color"] = "lightgray";
        this.renderStageItem(mbr, stage);
        */

        var dy = (canvas.height - vtrans.height);

        for (var ii = 0; ii < layer.items.length; ii++) {

            var item = layer.items[ii];
            if (item.draw == false) continue;
            
            var trans = translateItem(vtrans.width, vtrans.height, item, stage.level.width, stage.level.height);

            var color;
            if (item.color) {
                if (item.color.gradient) {
                    var gradient = item.color.gradient;
                    
                    var g = ctx.createLinearGradient(0, trans.y + dy, 0, trans.height + (trans.y + dy));        
                    
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

            var itemx = trans.x;
            var itemwidth = trans.width;
            if (item.width == "100%") {
                itemx = 0;
                itemwidth = canvas.width;
            }

            var itemy = trans.y + dy;
            
            drawRect(ctx, itemx, itemy, itemwidth * layerscale, trans.height * layerscale); 
        }

        if (layername == "front") {
            for (var iii = 0; iii < stage.players.length; iii++) {
                var trans = translateItem(vtrans.width, vtrans.height, stage.players[iii], stage.level.width, stage.level.height);
                stage.players[iii].draw(ctx, trans.x, trans.y + dy, trans.width, trans.height);    
            }
        }
        
        if (layer.blur) blurCanvas(canvas, ctx, layer.blur * layerscale);

        if (layer.cache === false) continue;
        this.layerCache[layername] = layer;
    }
}