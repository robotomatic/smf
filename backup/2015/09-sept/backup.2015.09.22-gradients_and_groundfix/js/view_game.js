function GameView(id, players, width, height) {
    this.id = id;
    this.players = players;
    this.width = width;
    this.height = height;
    this.canvas = document.getElementById(this.id);
    this.parent = this.canvas.parentNode;
    this.ctx = this.canvas.getContext("2d");
    
    this.lastView = null;
}

GameView.prototype.resize = function() {
	this.canvas.width = this.parent.offsetWidth;
	this.canvas.height = this.parent.offsetHeight;
}

GameView.prototype.render = function(delta, stage) {
    clearRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);
    
    if (stage.level.background) {
        if (stage.level.background.color) {
            this.ctx.fillStyle = stage.level.background.color;
            drawRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);            
        }
    }
    
    var vbox = {
        "x" : 0,
        "y" : 0,
        "width" : this.width, 
        "height" : this.height
    }
    var vtrans = translateItem(this.canvas.width, this.canvas.height, vbox, this.width, this.height);

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
    
    var cx = this.canvas.width / 2;
    var cy = this.canvas.height / 2;
    
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

    var border_height = (this.canvas.height - vtrans.height) / 2;
    
    var diff_top = bounds_topy + bounds_height;
    var diff_height = this.canvas.height - diff_top - border_height;
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
    // todo: item renderer

    for (var i = 0; i < stage.level.items.length; i++) {
        if (stage.level.items[i].draw == false) continue;

        var item = stage.level.items[i];
        var ix = (item.x - mbr_x) * scale;
        var iy = item.y;
        iy = (iy - mbr_y) * scale;
        iy += dy;
        
        var color;
        if (item.color) {
            if (item.color.gradient) {
                var gradient = item.color.gradient;
                var g = this.ctx.createLinearGradient(0, cmbrtrans.y + iy, 0, item.height * scale + (cmbrtrans.y + iy));
                g.addColorStop(0, gradient.start);
                g.addColorStop(1, gradient.stop);
                color = g;
                
            } else color = item.color;
        } else color = "gray";
        this.ctx.fillStyle = color;
        
        var itemx = cmbrtrans.x + ix;
        var itemwidth = item.width * scale;
        if (item.width === "100%") {
            itemx = 0;
            itemwidth = this.canvas.width;
        }
        
        drawRect(this.ctx, itemx, cmbrtrans.y + iy, itemwidth, item.height * scale);            
    }

    /*
    this.ctx.fillStyle = "lightgray";
    drawRect(this.ctx, cmbrtrans.x, cmbrtrans.y, cmbrtrans.width, cmbrtrans.height);            
    */
    
    for (var i = 0; i < stage.players.length; i++) {
        var p = stage.players[i];
        var px = (p.x - mbr_x) * scale;
        var py = p.y;
        py = (py - mbr_y) * scale;
        py += dy;
        p.draw(this.ctx, cmbrtrans.x + px, cmbrtrans.y + py, p.width * scale, p.height * scale);            
    }
    
    //return;
    
    var dw = this.canvas.width - vtrans.width;
    var bw = dw / 2;
    clearRect(this.ctx, 0, 0, bw, this.canvas.height);        
    clearRect(this.ctx, bw + vtrans.width, 0, bw, this.canvas.height);        
    
    var dh = this.canvas.height - vtrans.height;
    var bh = dh / 2;
    clearRect(this.ctx, 0, 0, this.canvas.width, bh);        
    clearRect(this.ctx, 0, vtrans.height + bh, this.canvas.width, bh);        
}